const express = require("express");
const {
  createEvent,
  eventsUpload,
  getAllEvents,
} = require("../../controllers/event/EventController");

const router = express.Router();

// Route for creating a new event with image upload
router.post("/events", createEvent);
router.post("/events/upload", eventsUpload);
router.get("/events", getAllEvents);
module.exports = router;
