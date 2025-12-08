const express = require("express");
const router = express.Router();
const placeController = require("../controllers/place.controller");

// 1. Route lấy danh sách filter options
// URL: /api/places/filters
router.get("/filters", placeController.getFilterOptions);

// 2. Route tìm kiếm (Static route - Phải đặt TRƯỚC dynamic route)
// URL: /api/places/search
router.get("/search", placeController.searchPlaces);

// 3. Route lấy chi tiết (Dynamic route - Đặt SAU)
// URL: /api/places/:id
router.get("/:id", placeController.getPlaceDetail);

module.exports = router;