// // middleware/upload.js
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); 
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;



// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directory exists
function ensureDirExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/others'; // fallback

    // You can check based on route or define a custom flag
    if (req.uploadContext === 'registration') {
      uploadPath = 'uploads/registration/';
    } else if (req.uploadContext === 'awardform') {
      uploadPath = 'uploads/awardform/';
    }

    ensureDirExist(uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
