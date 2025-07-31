const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const rateLimit = require('express-rate-limit');
const { v2: cloudinary } = require("cloudinary");
const serverless = require("serverless-http");
require("dotenv").config();

const seedRoutes = require("../routes/seed");
const formRoute = require("../routes/form");
const loginRoute = require("../routes/login");
const memberRoute = require("../routes/membership");
const paymentRoute = require("../routes/payment");
const authRoute = require("../routes/auth");
const vivahRoute = require("../routes/vivahMemberRegister");

const app = express();

// Manual CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://bhargavasamajglobal.org"
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to DB (only once)
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log("DB Connection Failed", err));
}

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 90,
  message: {
    status: 429,
    error: "Too many requests. Please try again in a minute.",
  }
});
app.use(limiter);

// Multer setup
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Mongoose model
const fileSchema = new mongoose.Schema({
  filename: String,
  public_id: String,
  imgUrl: String,
});
const File = mongoose.models.Cloudinary || mongoose.model("Cloudinary", fileSchema);

// Routes
app.use("/api/v1/form", formRoute);
app.use("/api/v1", loginRoute);
app.use("/api/v1/member", memberRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/auth", authRoute);
app.use("/api/seed", seedRoutes);
app.use("/api/v1", vivahRoute);

// Upload Route
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();
    const resourceType = fileType === ".pdf" ? "raw" : "image";

    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      resource_type: resourceType,
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
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// 404 Fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Error:", error.message);
  res.status(500).json({ errorMessage: "Something went wrong" });
});

// Export handler for Vercel
module.exports = serverless(app);
