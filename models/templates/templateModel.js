const mongoose = require("mongoose");
const { Schema } = mongoose;
const Catalogue = require("../catalog/catalogModel");

const image_templatesSchema = mongoose.Schema({
  path: { type: String, required: true },
});

const templateSchema = new Schema({
  id: { type: Schema.Types.String, required: true, unique: true },
  id_catalogue: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Catalogue,
      required: true,
    },
  ],

  template_name: { type: Schema.Types.String, default: null },
  design_by: { type: Schema.Types.String, default: null },
  link_demo: { type: Schema.Types.String, default: null },
  description: { type: Schema.Types.String, default: null },
  rootpath: { type: Schema.Types.String, default: null },
  created_at: { type: Schema.Types.Date, default: null },
  created_by: { type: Schema.Types.String, default: null },
  modified_at: { type: Schema.Types.Date, default: null },
  modified_by: { type: Schema.Types.String, default: null },
  image_templates: [image_templatesSchema],
});

templateSchema.index(
  { template_name: "text", description: "text" },
  { id_catalogue: "text" }
);

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
