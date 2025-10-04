const express = require("express");
const router = express.Router();
const {
  searchLifeMember,

  getAllLifeMembers,
  updateLifeMember,
  getUpdatedLifeMembers,

} = require("../controllers/lifememberregistration");

const upload = require('../middleware/upload');

const setRegistrationContext = (req, res, next) => {
  req.uploadContext = 'registration';
  next();
};

router.get("/lifemembers", getAllLifeMembers);

router.get("/lifemember/:lm_no", searchLifeMember);

router.patch("/life-members/:lm_no",setRegistrationContext,
  upload.fields([{ name: "photo", maxCount: 1 }]), updateLifeMember);

router.get("/updated-members", getUpdatedLifeMembers);


module.exports = router;
