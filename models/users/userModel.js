const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  client_id: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    default: null,
  },
  client_name: {
    type: String,
    required: true,
  },
  client_status: {
    type: Boolean,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
  created_date: {
    type: String,
    default: null,
  },
  modified_date: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
