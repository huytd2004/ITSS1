const express = require("express");
const router = express.Router();
const placeController = require("../controllers/place.controller");

// Định nghĩa route tìm kiếm
// URL sẽ là: /api/places/search
router.get("/search", placeController.searchPlaces);

module.exports = router;