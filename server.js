// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const rateLimit = require('express-rate-limit');
// const { v2: cloudinary } = require("cloudinary");
// require("dotenv").config();

// const seedRoutes = require("./routes/seed");
// const formRoute = require("./routes/form");
// const loginRoute = require("./routes/login");
// const memberRoute = require("./routes/membership");
// const paymentRoute = require("./routes/payment");
// const authRoute = require("./routes/auth");
// const vivahRoute = require("./routes/vivahMemberRegister");

// const app = express();

// // ✅ Manual CORS Middleware
// app.use((req, res, next) => {
//   const allowedOrigins = [
//     "http://localhost:5173",
//     "https://bhargavasamajglobal.org"
//   ];
//   const origin = req.headers.origin;
//    console.log("CORS check, origin:", origin);

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//       res.setHeader("Access-Control-Allow-Credentials", "true");
//   }

//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
 

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

// // ✅ Body Parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Cloudinary Config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 90,             // limit each IP to 90 requests per minute
//   message: {
//     status: 429,
//     error: "Too many requests. Please try again in a minute.",
//   }
// });

// // ✅ Multer Setup
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });

// // ✅ Mongoose Schema for Cloudinary Uploads
// const fileSchema = new mongoose.Schema({
//   filename: String,
//   public_id: String,
//   imgUrl: String,
// });
// const File = mongoose.model("Cloudinary", fileSchema);

// // ✅ MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB Connection Successful"))
//   .catch((err) => {
//     console.log("DB Connection Failed");
//     console.log(err);
//   });

// // ✅ Routes

// app.use(limiter);
// app.use("/api/v1/form", formRoute);
// app.use("/api/v1", loginRoute);
// app.use("/api/v1/member", memberRoute);
// app.use("/api/v1/payment", paymentRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/seed", seedRoutes);
// app.use("/api/v1", vivahRoute);


// // ✅ File Upload Route
// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const fileType = path.extname(req.file.originalname).toLowerCase();
//     const resourceType = fileType === ".pdf" ? "raw" : "image";

//     const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
//       folder: "uploads",
//       resource_type: resourceType,
//     });

//     const savedToDb = await File.create({
//       filename: req.file.originalname,
//       public_id: cloudinaryResponse.public_id,
//       imgUrl: cloudinaryResponse.secure_url,
//     });

//     res.status(200).json({
//       message: "File uploaded successfully",
//       url: cloudinaryResponse.secure_url,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "File upload failed" });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("Backend is working 🚀");
// });

// // ✅ 404 Fallback
// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });


// app.use((error, req, res, next) => {
//   console.error("Error:", error.message);
//   res.status(500).json({ errorMessage: "Something went wrong" });
// });


// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Backend server running on ${port}`);
// });
