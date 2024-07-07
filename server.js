const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const app = express();
const port = 5000;
const cors = require("cors");
const path = require("path");
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cors());

const apiRoutes = require("./routes/apiRoutes");

app.get("/", async (req, res, next) => {
  res.json({ message: "API running..." });
});
const corsOptions = {
  origin: ["http://localhost:5173", "https://fatednreturn.org"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// mongodb connection
const connectDB = require("./config/db");
connectDB();

app.use("/api", apiRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  next(error);
});
app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
