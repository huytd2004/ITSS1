const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// Middleware xác thực (bạn cần import từ file auth của bạn)
// const { authMiddleware } = require("../middlewares/auth.middleware");

// ============ PUBLIC ROUTES ============

// Lấy danh sách review theo place
// GET /api/reviews/place/:place_id
router.get("/place/:place_id", reviewController.getReviewsByPlace);

// ============ PROTECTED ROUTES (cần đăng nhập) ============

// Tạo review mới
// POST /api/reviews
// Body: { place_id, rating, comment }
router.post("/", reviewController.createReview);

// Lấy review của user cho 1 place cụ thể
// GET /api/reviews/my-review/:place_id
router.get("/my-review/:place_id", reviewController.getUserReviewForPlace);

// Cập nhật review
// PUT /api/reviews/:id
// Body: { rating, comment }
router.put("/:id", reviewController.updateReview);

// Xóa review
// DELETE /api/reviews/:id
router.delete("/:id", reviewController.deleteReview);

module.exports = router;