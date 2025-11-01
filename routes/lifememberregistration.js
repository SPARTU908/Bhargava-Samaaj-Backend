const express = require("express");
const router = express.Router();
const {
  searchLifeMember,
  createLifeMember,
  getAllLifeMembers,
  updateLifeMember,
  getUpdatedLifeMembers,
  getNewLifeMembers,
  softDeleteLifeMember

} = require("../controllers/lifememberregistration");

const upload = require('../middleware/upload');

const setRegistrationContext = (req, res, next) => {
  req.uploadContext = 'registration';
  next();
};

router.get("/lifemembers", getAllLifeMembers);

router.get("/lifemember/:LM_NO", searchLifeMember);

router.post(
  "/lifemember",
  setRegistrationContext,
  upload.fields([{ name: "photo", maxCount: 1 }]),
  createLifeMember
);

router.patch("/life-members/:LM_NO",setRegistrationContext,
  upload.fields([{ name: "photo", maxCount: 1 }]), updateLifeMember);

router.get("/updated-members", getUpdatedLifeMembers);

router.get("/life-members/new", getNewLifeMembers);
router.patch("/life-members/:id/delete", softDeleteLifeMember);

module.exports = router;
