const express = require("express");
const app = express();

const templateRoutes = require("./templatesRoute/templateRoutes");
const auth = require("./userRoute/userRoutes");
const catalog = require("./catalogRoute/catalogRoutes");

app.use("/templates", templateRoutes);
app.use("/auth", auth);
app.use("/catalog", catalog);

module.exports = app;
