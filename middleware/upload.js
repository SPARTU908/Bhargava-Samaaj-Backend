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


