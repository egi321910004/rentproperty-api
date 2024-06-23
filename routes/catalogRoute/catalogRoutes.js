const express = require("express");
const router = express.Router();
const catalogController = require("../../controllers/catalog/catalogController");

router.get("/getAll", catalogController.getCatalogs);
router.post("/createCatalog", catalogController.createCatalog);

// user logged in routes:

// admin routes:
// router.get("/", userController.getUsers);

module.exports = router;
