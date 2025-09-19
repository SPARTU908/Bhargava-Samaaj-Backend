// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// function ensureDirExist(dir) {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let uploadPath = 'uploads/others'; 

     
//     if (req.uploadContext === 'registration') {
//       uploadPath = 'uploads/registration/';
//     } else if (req.uploadContext === 'awardform') {
//       uploadPath = 'uploads/awardform/';
//     } else if (req.uploadContext === 'matrimonial') {
//       uploadPath = 'uploads/matrimonial/';
//     }
//     ensureDirExist(uploadPath);
//     cb(null, uploadPath);
//   },

//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;



// middleware/upload.js

// const AWS = require("aws-sdk"); // AWS SDK v2
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const path = require("path");

// // Function to choose folder based on form type
// function getFolderByContext(context) {
//   if (context === "registration") return "registration";
//   if (context === "awardform") return "awardform";
//   if (context === "matrimonial") return "matrimonial";
//   return "others";
// }

// // DigitalOcean Spaces config (v2 SDK)
// const s3 = new AWS.S3({
//   endpoint: process.env.DO_SPACES_ENDPOINT, 
//   accessKeyId: process.env.DO_SPACES_KEY,
//   secretAccessKey: process.env.DO_SPACES_SECRET,
// });

// // Multer S3 storage
// const storage = multerS3({
//   s3: s3,
//   bucket: process.env.DO_SPACES_BUCKET, // your space name
//   acl: "public-read", // so files can be accessed publicly
//   key: function (req, file, cb) {
//     const folder = getFolderByContext(req.uploadContext || "others");
//     const uniqueName =
//       Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//     cb(null, `${folder}/${uniqueName}`);
//   },
// });

// // Multer upload
// const upload = multer({ storage });

// module.exports = upload;





const multer = require("multer");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3-v3"); 


function getFolderByContext(context) {
  if (context === "registration") return "registration";
  if (context === "awardform") return "awardform";
  if (context === "matrimonial") return "matrimonial";
  if (context === "membership") return "membership"; 

  return "others";
}


const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION, 
  endpoint: process.env.DO_SPACES_ENDPOINT, 
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// Multer S3 storage (v3-compatible)
const storage = multerS3({
  s3: s3,
  bucket: process.env.DO_SPACES_BUCKET, // your space name
  acl: "public-read",
  key: function (req, file, cb) {
    const folder = getFolderByContext(req.uploadContext || "others");
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, `${folder}/${uniqueName}`);
  },
});

const upload = multer({ storage });

module.exports = upload;


