const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { getUserByMembershipNo,updateMissingFields } = require('../controllers/registeredUser');


const setRegistrationContext = (req, res, next) => {
  req.uploadContext = 'registration';
  next();
};




// router.get('/all-users', getAllUsers);


router.get("/user/:lifemembershipNo", getUserByMembershipNo);
router.put(
  "/user/:lifemembershipNo",
  setRegistrationContext,
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  updateMissingFields
);

module.exports = router;
