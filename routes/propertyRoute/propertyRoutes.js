const express = require("express");
const router = express.Router();
const {
  getPropertys,
  getPropertyById,
  adminCreateProperty,
  adminGetPropertys,
  adminUpload,
  adminDeletePropertyImage,
  adminDeleteProperty,
} = require("../../controllers/property/propertyController");

router.get("/", getPropertys);
router.get("/getdetail/:id", getPropertyById);

// admin routes:
router.get("/admin/getAllProperty", adminGetPropertys);
router.delete("/admin/:id", adminDeleteProperty);
router.post("/admin/NewProperty", adminCreateProperty);
router.post("/admin/upload", adminUpload);
router.delete("/admin/image/:imagePath/:propertyId", adminDeletePropertyImage);

module.exports = router;
