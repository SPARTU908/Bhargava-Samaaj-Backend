const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

const formRoute = require("./routes/form");
const loginRoute = require("./routes/login");
const adminRoute = require("./routes/admin")
const memberRoute = require("./routes/member")
const paymentRoute= require("./routes/payment")

const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name: 'doj76lpfe',
  api_key:'362821681467625',
  api_secret: 'twv0zQP_E0Qu7mAswUAqEMGMSOo',

});

// Multer config
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Mongoose Schema
const fileSchema = new mongoose.Schema({
  filename: String,
  public_id: String,
  imgUrl: String,
});
const File = mongoose.model("Cloudinary", fileSchema);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => {
    console.log("DB Connection Failed");
    console.log(err);
  });

// Routes
app.use("/api/v1/form", formRoute);
app.use("/api/v1", loginRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/member", memberRoute);
app.use("/api/v1/payment", paymentRoute);

// Upload Route (for React frontend)
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      folder: "images",
    });

    const savedToDb = await File.create({
      filename: req.file.originalname,
      public_id: cloudinaryResponse.public_id,
      imgUrl: cloudinaryResponse.secure_url,
    });

    res.status(200).json({
      message: "File uploaded successfully",
      url: cloudinaryResponse.secure_url,
    });

    // console.log("Cloudinary response:", cloudinaryResponse);
    // console.log("Saved to DB:", savedToDb);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});



// Fallbacks
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ errorMessage: "Something went wrong" });
});

// Server Start
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server running on ${port}`);
});

