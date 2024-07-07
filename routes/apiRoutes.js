const express = require("express");
const app = express();

const templateRoutes = require("./templatesRoute/templateRoutes");
const auth = require("./userRoute/userRoutes");
const catalog = require("./catalogRoute/catalogRoutes");
const property = require("./propertyRoute/propertyRoutes");
const event = require("./event/eventRoute");

app.use("/templates", templateRoutes);
app.use("/auth", auth);
app.use("/catalog", catalog);
app.use("/property", property);
app.use("/event", event);

module.exports = app;
