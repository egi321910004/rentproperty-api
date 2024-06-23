const express = require("express");
const router = express.Router();
const {
  getPropertys,
  getPropertyById,
  adminCreateProperty,
  adminGetPropertys,
} = require("../../controllers/property/propertyController");

router.get("/", getPropertys);
router.get("/getdetail/:id", getPropertyById);

// admin routes:
router.get("/admin/getAllProperty", adminGetPropertys);
// router.delete("/admin/:id", adminDeleteProduct);
router.post("/admin/NewProperty", adminCreateProperty);

module.exports = router;
