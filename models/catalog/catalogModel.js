const mongoose = require("mongoose");
const { Schema } = mongoose;

const catalogueSchema = new Schema({
  catalog_name: {
    type: String,
    required: true,
  },
  catalog_color: {
    type: String,
    required: true,
  },
  interest: {
    type: Number,
    required: true,
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

const Catalogue = mongoose.model("Catalog", catalogueSchema);

module.exports = Catalogue;
