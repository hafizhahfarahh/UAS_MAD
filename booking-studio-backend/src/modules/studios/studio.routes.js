const router = require("express").Router();
const {getStudios,getStudioDetail} = require("./studio.controller");

router.get("/", getStudios);
router.get("/:id", getStudioDetail);

module.exports = router;
