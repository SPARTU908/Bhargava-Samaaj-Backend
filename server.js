// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const { v2: cloudinary } = require("cloudinary");
// require("dotenv").config();
// const seedRoutes = require("./routes/seed");

// const formRoute = require("./routes/form");
// const loginRoute = require("./routes/login");
// const memberRoute = require("./routes/member");
// const paymentRoute = require("./routes/payment");
// const authRoute = require("./routes/auth");
// const vivahRoute = require("./routes/vivahMemberRegister");

// const app = express();

// // Cloudinary config
// cloudinary.config({
//   cloud_name: "doj76lpfe",
//   api_key: "362821681467625",
//   api_secret: "twv0zQP_E0Qu7mAswUAqEMGMSOo",
// });

// // Multer config
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const upload = multer({ storage: storage });

// // Mongoose Schema
// const fileSchema = new mongoose.Schema({
//   filename: String,
//   public_id: String,
//   imgUrl: String,
// });
// const File = mongoose.model("Cloudinary", fileSchema);

// // Middlewares
// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// // app.use(cors({
// //   origin: "https://bhargavasamajglobal.org", // or "*" to allow all (not recommended for production)
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// // }));


// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://bhargavasamajglobal.org"
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true, // if using cookies
// }));
// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB Connection Successful"))
//   .catch((err) => {
//     console.log("DB Connection Failed");
//     console.log(err);
//   });

// // Routes
// app.use("/api/v1/form", formRoute);
// app.use("/api/v1", loginRoute);
// // app.use("/api/v1/admin", adminRoute);
// app.use("/api/v1/member", memberRoute);
// app.use("/api/v1/payment", paymentRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/seed", seedRoutes);
// app.use("/api/v1",vivahRoute);


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

// // Fallbacks
// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// app.use((error, req, res, next) => {
//   console.log(error);
//   res.status(500).json({ errorMessage: "Something went wrong" });
// });

// // Server Start
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Backend server running on ${port}`);
// });



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

const seedRoutes = require("./routes/seed");
const formRoute = require("./routes/form");
const loginRoute = require("./routes/login");
const memberRoute = require("./routes/member");
const paymentRoute = require("./routes/payment");
const authRoute = require("./routes/auth");
const vivahRoute = require("./routes/vivahMemberRegister");

const app = express();


// ✅ Setup CORS BEFORE other middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://bhargavasamajglobal.org"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// JSON and URL encoding middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary config
cloudinary.config({
  cloud_name: "doj76lpfe",
  api_key: "362821681467625",
  api_secret: "twv0zQP_E0Qu7mAswUAqEMGMSOo",
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
app.use("/api/v1/member", memberRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/auth", authRoute);
app.use("/api/seed", seedRoutes);
app.use("/api/v1", vivahRoute);

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
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

// Fallback for unknown routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ errorMessage: "Something went wrong" });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server running on ${port}`);
});
