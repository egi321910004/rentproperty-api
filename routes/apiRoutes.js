const express = require("express");
const app = express();

const templateRoutes = require("./templatesRoute/templateRoutes");
const auth = require("./userRoute/userRoutes");

app.use("/templates", templateRoutes);
app.use("/auth", auth);

module.exports = app;
