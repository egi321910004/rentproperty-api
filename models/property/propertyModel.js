const mongoose = require("mongoose");
const { Schema } = mongoose;

const Catalogue = require("../catalog/catalogModel");

const images = mongoose.Schema({
  path: { type: String, required: true },
});
const propertySchema = new Schema({
  property_name: {
    type: String,
    required: true,
  },
  property_description: {
    type: String,
    required: true,
  },
  property_address: {
    type: String,
    required: true,
  },
  property_bedroom: {
    type: Number,
    required: true,
  },
  property_bathroom: {
    type: Number,
    required: true,
  },
  property_car: {
    type: Number,
    required: true,
  },
  property_price: {
    type: Number,
    required: true,
  },
  property_sales: {
    type: String,
    required: true,
  },
  id_catalogue: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Catalogue,
      required: true,
    },
  ],

  images: [images],

  created_date: {
    type: String,
    default: null,
  },
  modified_date: {
    type: String,
    default: null,
  },
});

propertySchema.index({
  property_name: "text",
  property_description: "text",
  id_catalogue: "text",
  property_name: "TextIndex",
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
