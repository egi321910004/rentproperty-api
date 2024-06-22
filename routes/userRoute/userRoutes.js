const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// user logged in routes:

// admin routes:
router.get("/", userController.getUsers);

module.exports = router;
