const express = require('express');
const {createMember,uploadFormFile,loginMember,getMemberStatus,updateMemberStatus,dispatchMemberForm} = require('../controllers/membership');
const {getAllMembers} = require("../controllers/membership");
 const {getMemberCount} = require("../controllers/membership");
const { protect } = require('../middleware/authMiddleware');
const path = require('path');
const upload = require("../middleware/upload");
const router = express.Router();



const setUploadContext = (req, res, next) => {
  req.uploadContext = "membership";
  next();
};

router.post('/login/member',loginMember);
router.post(
  "/register",
  setUploadContext,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "spousePhoto", maxCount: 1 },
    { name: "spouseSignature", maxCount: 1 },
    { name: "uploadAadharUser", maxCount: 1 },
    { name: "uploadAadharSpouse", maxCount: 1 },
  ]),
  (req, res, next) => {
    
    const fileFields = [
      "photo",
      "signature",
      "spousePhoto",
      "spouseSignature",
      "uploadAadharUser",
      "uploadAadharSpouse",
    ];

    fileFields.forEach((field) => {
      if (req.files[field]) {
        req.body[field] = req.files[field][0].location; 
      }
    });

    next();
  },
  createMember
);
router.post('/:id/upload', upload.single('uploadForm'), uploadFormFile);
router.get("/allmember", getAllMembers);
router.get("/count",getMemberCount);
router.get("/:id/status", getMemberStatus);
router.patch("/members/:id/status", updateMemberStatus);
router.get('/allmember', protect(['superadmin', 'membershipadmin']), getAllMembers);
router.put("/dispatch/:id", dispatchMemberForm);


module.exports=router;




