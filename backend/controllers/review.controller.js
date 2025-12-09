const mongoose = require("mongoose");
const Review = require("../models/review.model");
const Place = require("../models/place.model");
const User = require("../models/user.model");

// ============ HELPER: Cập nhật rating của Place ============
const updatePlaceRating = async (placeId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { place_id: new mongoose.Types.ObjectId(placeId) } },
      {
        $group: {
          _id: "$place_id",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      // Format rating: 4 -> 4.0
      const avgRating = parseFloat(stats[0].avgRating.toFixed(1));
      await Place.updateOne(
        { _id: placeId },
        {
          $set: {
            avg_rating: avgRating,
            total_reviews: stats[0].count
          }
        }
      );
    } else {
      // Không còn review nào -> reset về 0
      await Place.updateOne(
        { _id: placeId },
        {
          $set: {
            avg_rating: 0,
            total_reviews: 0
          }
        }
      );
    }

    return true;
  } catch (error) {
    console.error("Error updating place rating:", error);
    return false;
  }
};

// ============ LẤY DANH SÁCH REVIEW THEO PLACE ============
exports.getReviewsByPlace = async (req, res) => {
  try {
    const { place_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ place_id: place_id })
      .populate("user_id", "fullName email avatar")
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Review.countDocuments({ place_id: place_id });

    // Format rating trong response
    const formattedReviews = reviews.map(review => ({
      ...review.toObject(),
      rating: parseFloat(review.rating).toFixed(1)
    }));

    res.status(200).json({
      success: true,
      data: formattedReviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách bình luận"
    });
  }
};

// ============ TẠO REVIEW MỚI ============
exports.createReview = async (req, res) => {
  try {
    const { place_id, rating, comment } = req.body;
    const user_id = req.user._id; // Lấy từ middleware auth

    // Validate
    if (!place_id || !rating) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp place_id và rating"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating phải từ 1 đến 5"
      });
    }

    // Kiểm tra place tồn tại
    const place = await Place.findById(place_id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa điểm"
      });
    }

    // Kiểm tra user đã review chưa (mỗi user chỉ được review 1 lần/place)
    const existingReview = await Review.findOne({ user_id, place_id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá địa điểm này rồi. Vui lòng sửa đánh giá cũ."
      });
    }

    // Tạo review mới
    const newReview = await Review.create({
      user_id,
      place_id,
      rating,
      comment: comment || ""
    });

    // Cập nhật rating của Place
    await updatePlaceRating(place_id);

    // Populate user info để trả về
    const populatedReview = await Review.findById(newReview._id)
      .populate("user_id", "fullName email avatar")
      .exec();

    res.status(201).json({
      success: true,
      message: "Đánh giá thành công",
      data: {
        ...populatedReview.toObject(),
        rating: parseFloat(populatedReview.rating).toFixed(1)
      }
    });

  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đánh giá"
    });
  }
};

// ============ CẬP NHẬT REVIEW ============
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID
    const { rating, comment } = req.body;
    const user_id = req.user._id;

    // Tìm review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá"
      });
    }

    // Kiểm tra quyền (chỉ owner mới được sửa)
    if (review.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền sửa đánh giá này"
      });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating phải từ 1 đến 5"
      });
    }

    // Cập nhật
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    // Cập nhật rating của Place
    await updatePlaceRating(review.place_id);

    // Populate và trả về
    const updatedReview = await Review.findById(id)
      .populate("user_id", "fullName email avatar")
      .exec();

    res.status(200).json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: {
        ...updatedReview.toObject(),
        rating: parseFloat(updatedReview.rating).toFixed(1)
      }
    });

  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật đánh giá"
    });
  }
};

// ============ XÓA REVIEW ============
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user._id;

    // Tìm review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá"
      });
    }

    // Kiểm tra quyền
    if (review.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa đánh giá này"
      });
    }

    const placeId = review.place_id;

    // Xóa review
    await Review.deleteOne({ _id: id });

    // Cập nhật rating của Place
    await updatePlaceRating(placeId);

    res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công"
    });

  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa đánh giá"
    });
  }
};

// ============ LẤY REVIEW CỦA USER CHO 1 PLACE ============
exports.getUserReviewForPlace = async (req, res) => {
  try {
    const { place_id } = req.params;
    const user_id = req.user._id;

    const review = await Review.findOne({ user_id, place_id })
      .populate("user_id", "fullName email avatar")
      .exec();

    if (!review) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "Bạn chưa đánh giá địa điểm này"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...review.toObject(),
        rating: parseFloat(review.rating).toFixed(1)
      }
    });

  } catch (error) {
    console.error("Get User Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đánh giá"
    });
  }
};