const express = require("express");
const router = express.Router();
const controllers = require("../controllers/dayPlan.controller");
const multer = require("multer");
const uploadNone = multer().none();

// TODO: Add authentication middleware to protect these routes
// const authMiddleware = require('../middlewares/auth.middleware');
// router.use(authMiddleware);

// CRUD routes for day plans
router.get("/", uploadNone, controllers.index);
router.get("/:id", uploadNone, controllers.detail);
router.post("/", uploadNone, controllers.create);
router.patch("/:id", uploadNone, controllers.update);
router.delete("/:id", uploadNone, controllers.delete);

// Item management routes
router.post("/:id/items", uploadNone, controllers.addItem);
router.patch("/:id/items/:itemId", uploadNone, controllers.updateItem);
router.delete("/:id/items/:itemId", uploadNone, controllers.deleteItem);

module.exports = router;
