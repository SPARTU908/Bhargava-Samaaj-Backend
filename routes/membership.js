const express = require('express');
const {createMember,uploadFormFile,loginMember,getMemberStatus,updateMemberStatus,dispatchMemberForm} = require('../controllers/membership');
const {getAllMembers} = require("../controllers/membership");
 const {getMemberCount} = require("../controllers/membership");
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage }); // ✅ define 'upload'


router.post('/login/member',loginMember);
router.post('/register', createMember);
router.post('/:id/upload', upload.single('uploadForm'), uploadFormFile);
router.get("/allmember", getAllMembers);
router.get("/count",getMemberCount);
router.get("/:id/status", getMemberStatus);
router.patch("/members/:id/status", updateMemberStatus);
router.get('/allmember', protect(['superadmin', 'membershipadmin']), getAllMembers);
router.put("/dispatch/:id", dispatchMemberForm);


module.exports=router;
