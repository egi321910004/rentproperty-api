const express = require("express");
const getTemplates = require("../../controllers/templates/templatesController");
const router = express.Router();

router.get("/", getTemplates);

module.exports = router;
