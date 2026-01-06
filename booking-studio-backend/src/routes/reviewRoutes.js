const router = require("express").Router();
const {
  addReview,
  getReviewsByStudio,
  getStudioRating
} = require("../controllers/reviewController");

const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, addReview);
router.get("/studio/:studioId", getReviewsByStudio);
router.get("/studio/:studioId/rating", getStudioRating);

module.exports = router;