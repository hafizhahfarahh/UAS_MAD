const router = require("express").Router();
const {
  getStudios,
  getStudioById,
  addStudio
} = require("../controllers/studioController");

const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// PUBLIC
router.get("/", getStudios);
router.get("/:id", getStudioById);

// ADMIN ONLY
router.post("/", verifyToken, isAdmin, addStudio);

module.exports = router;