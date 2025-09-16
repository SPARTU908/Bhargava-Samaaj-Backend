const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDirExist(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/others'; 

     
    if (req.uploadContext === 'registration') {
      uploadPath = 'uploads/registration/';
    } else if (req.uploadContext === 'awardform') {
      uploadPath = 'uploads/awardform/';
    } else if (req.uploadContext === 'matrimonial') {
      uploadPath = 'uploads/matrimonial/';
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
