const express = require("express");
const Event = require("../../models/event/EventModel");
const imageValidate = require("../../utils/imageValidate");

const createEvent = async (req, res, next) => {
  try {
    const { team_name, dugeon, finish_time, date, status, party_list, images } =
      req.body;

    const existingEvent = await Event.findOne({ team_name });
    if (existingEvent) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    // Parse party_list JSON from req.body if it's a string
    const parsedPartyList =
      typeof party_list === "string" ? JSON.parse(party_list) : party_list;

    // Create a new event
    const newEvent = new Event({
      team_name: team_name,
      dugeon: dugeon,
      finish_time: finish_time,
      date: new Date().toISOString(),
      status: false,
      party_list: parsedPartyList,
      images: images ? [{ path: images }] : [], // Assuming images is a base64 string
    });

    // Save the event to the database
    const savedEvent = await newEvent.save();

    res
      .status(201)
      .json({ message: "Event created successfully", event: savedEvent });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

const eventsUpload = async (req, res, next) => {
  try {
    if (!req.files || !!req.files.images === false) {
      return res.status(400).send("No files were uploaded.");
    }

    const validateResult = imageValidate(req.files.images);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
    }

    const path = require("path");
    const { v4: uuidv4 } = require("uuid");
    const uploadDirectory = path.resolve(
      __dirname,
      "../../public",
      "images",
      "event"
    );

    let event = await Event.findById(req.query.eventId).orFail();

    let imagesTable = [];
    if (Array.isArray(req.files.images)) {
      imagesTable = req.files.images;
    } else {
      imagesTable.push(req.files.images);
    }

    for (let image of imagesTable) {
      var fileName = uuidv4() + path.extname(image.name);
      var uploadPath = uploadDirectory + "/" + fileName;
      event.images.push({ path: "/images/event/" + fileName });
      image.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }
    await event.save();
    return res.send("Files uploaded!");
  } catch (err) {
    next(err);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const event = await Event.find({});

    return res.json(event);
  } catch (err) {
    next(err);
  }
};
// Export the controller functions
module.exports = {
  createEvent,
  eventsUpload,
  getAllEvents,
};
