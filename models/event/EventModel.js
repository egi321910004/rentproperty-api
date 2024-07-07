const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the objects in party_list
const partyMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
});

const images = mongoose.Schema({
  path: { type: String, required: true },
});

// Define the main event schema
const eventSchema = new Schema({
  team_name: {
    type: String,
    required: true,
  },
  dugeon: {
    type: String,
    required: true,
  },
  finish_time: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: null,
  },
  images: [images],
  status: {
    type: Boolean,
    default: null,
  },
  party_list: [partyMemberSchema],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
