const DayPlan = require("../models/dayPlan.model");
const Place = require("../models/place.model");

// GET /api/day-plans - Lấy danh sách day plans với phân trang, tìm kiếm và filter
module.exports.index = async (req, res) => {
  try {
    // const userId = req.user._id; // Assuming auth middleware sets req.user

    const {
      province,
      district,
      price_min,
      price_max,
      age_min,
      age_max,
      page = 1,
      limit = 10,
      search,
      tags,
    } = req.query;

    // Build base filter for user's day plans
    // const filter = { user_id: userId };
    const filter = {};

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");
      filter.tags = { $in: tagArray };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get day plans first
    let query = DayPlan.find(filter)
      .populate("items.place_id")
      .skip(skip)
      .limit(limitNum)
      .sort({ created_at: -1 });

    const [dayPlans, total] = await Promise.all([
      query.exec(),
      DayPlan.countDocuments(filter),
    ]);

    // Filter day plans based on place criteria if any place filter is provided
    let filteredDayPlans = dayPlans;

    if (
      province ||
      district ||
      price_min ||
      price_max ||
      age_min !== undefined ||
      age_max !== undefined
    ) {
      // Build place filter
      const placeFilter = {};

      if (province) {
        placeFilter.city = new RegExp(province, "i");
      }

      if (district) {
        placeFilter.area = new RegExp(district, "i");
      }

      // Filter by age limit
      if (age_min !== undefined || age_max !== undefined) {
        const ageConditions = [];

        if (age_min !== undefined) {
          ageConditions.push({
            $or: [
              { "age_limit.max": { $gte: parseInt(age_min) } },
              { "age_limit.max": { $exists: false } },
              { "age_limit.max": null },
            ],
          });
        }

        if (age_max !== undefined) {
          ageConditions.push({
            $or: [
              { "age_limit.min": { $lte: parseInt(age_max) } },
              { "age_limit.min": { $exists: false } },
              { "age_limit.min": null },
            ],
          });
        }

        if (ageConditions.length > 0) {
          placeFilter.$and = ageConditions;
        }
      }

      // Get matching place IDs
      const matchingPlaces = await Place.find(placeFilter).select(
        "_id price_range"
      );

      // Filter by price range if needed
      let validPlaceIds = matchingPlaces.map((p) => p._id.toString());

      if (price_min || price_max) {
        validPlaceIds = matchingPlaces
          .filter((place) => {
            if (!place.price_range) return false;

            // Extract numbers from price_range string (e.g., "100000-500000", "500000+", "50000")
            const numbers = place.price_range.match(/\d+/g);
            if (!numbers || numbers.length === 0) return false;

            const minPrice = parseInt(numbers[0]);
            const maxPrice =
              numbers.length > 1 ? parseInt(numbers[1]) : minPrice;

            if (price_min && maxPrice < parseInt(price_min)) return false;
            if (price_max && minPrice > parseInt(price_max)) return false;

            return true;
          })
          .map((p) => p._id.toString());
      }

      // Filter day plans that have at least one matching place
      filteredDayPlans = dayPlans.filter((dayPlan) => {
        return dayPlan.items.some((item) => {
          if (!item.place_id) return false;
          return validPlaceIds.includes(item.place_id._id.toString());
        });
      });
    }

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      message: "Lấy danh sách thành công",
      data: filteredDayPlans,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        filteredCount: filteredDayPlans.length,
      },
    });
  } catch (err) {
    console.error("Get day plans error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// GET /api/day-plans/:id - Lấy chi tiết một day plan
module.exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user._id;

    const dayPlan = await DayPlan.findOne({
      _id: id,
      // user_id: userId,
    }).populate("items.place_id");

    if (!dayPlan) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }

    return res.status(200).json({
      message: "Lấy chi tiết thành công",
      data: dayPlan,
    });
  } catch (err) {
    console.error("Get day plan detail error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// POST /api/day-plans - Tạo mới day plan
module.exports.create = async (req, res) => {
  try {
    // const userId = req.user._id;
    const { title, description, date, cover_image, tags, items } =
      req.body || {};

    if (!title) {
      return res.status(400).json({ message: "Tiêu đề là bắt buộc" });
    }

    const dayPlan = await DayPlan.create({
      // user_id: userId,
      title,
      description,
      date,
      cover_image,
      tags,
      items: items || [],
    });

    const populated = await DayPlan.findById(dayPlan._id).populate(
      "items.place_id"
    );

    return res.status(201).json({
      message: "Tạo kế hoạch thành công",
      data: populated,
    });
  } catch (err) {
    console.error("Create day plan error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// PATCH /api/day-plans/:id - Cập nhật day plan
module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user._id;
    const { title, description, date, cover_image, tags, items } =
      req.body || {};

    const dayPlan = await DayPlan.findOne({ _id: id });

    if (!dayPlan) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }

    if (title !== undefined) dayPlan.title = title;
    if (description !== undefined) dayPlan.description = description;
    if (date !== undefined) dayPlan.date = date;
    if (cover_image !== undefined) dayPlan.cover_image = cover_image;
    if (tags !== undefined) dayPlan.tags = tags;
    if (items !== undefined) dayPlan.items = items;

    await dayPlan.save();

    const populated = await DayPlan.findById(dayPlan._id).populate(
      "items.place_id"
    );

    return res.status(200).json({
      message: "Cập nhật thành công",
      data: populated,
    });
  } catch (err) {
    console.error("Update day plan error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// DELETE /api/day-plans/:id - Xóa day plan
module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user._id;

    const dayPlan = await DayPlan.findOneAndDelete({
      _id: id,
      // user_id: userId,
    });

    if (!dayPlan) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }

    return res.status(200).json({
      message: "Xóa thành công",
    });
  } catch (err) {
    console.error("Delete day plan error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// POST /api/day-plans/:id/items - Thêm item vào day plan
module.exports.addItem = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user._id;
    const itemData = req.body || {};

    const dayPlan = await DayPlan.findOne({ _id: id });

    if (!dayPlan) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }

    dayPlan.items.push(itemData);
    await dayPlan.save();

    const populated = await DayPlan.findById(dayPlan._id).populate(
      "items.place_id"
    );

    return res.status(200).json({
      message: "Thêm địa điểm thành công",
      data: populated,
    });
  } catch (err) {
    console.error("Add item error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// PATCH /api/day-plans/:id/items/:itemId - Cập nhật item trong day plan
module.exports.updateItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    // const userId = req.user._id;
    const updateData = req.body || {};

    const dayPlan = await DayPlan.findOne({ _id: id });

    if (!dayPlan) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }

    const item = dayPlan.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy địa điểm" });
    }

    Object.keys(updateData).forEach((key) => {
      item[key] = updateData[key];
    });

    await dayPlan.save();

    const populated = await DayPlan.findById(dayPlan._id).populate(
      "items.place_id"
    );

    return res.status(200).json({
      message: "Cập nhật địa điểm thành công",
      data: populated,
    });
  } catch (err) {
    console.error("Update item error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// DELETE /api/day-plans/:id/items/:itemId - Xóa item khỏi day plan
module.exports.deleteItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;
    // const userId = req.user._id;

    const dayPlan = await DayPlan.findOne({ _id: id });

    if (!dayPlan) {
      return res.status(404).json({ message: "Không tìm thấy kế hoạch" });
    }

    const item = dayPlan.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy địa điểm" });
    }

    item.deleteOne();
    await dayPlan.save();

    const populated = await DayPlan.findById(dayPlan._id).populate(
      "items.place_id"
    );

    return res.status(200).json({
      message: "Xóa địa điểm thành công",
      data: populated,
    });
  } catch (err) {
    console.error("Delete item error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
