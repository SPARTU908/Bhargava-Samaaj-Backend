const express = require("express");
const {
  saveFormData,
  getApprovedFormData,
  getPendingFormData,
  reviewForm,
  getDeletedForms,
  getUserStatus,getPendingFormCount,getRejectedFormCount,getFormCount,getRejectedForms,updateUserDetails,deleteUser,requestResetOtp,verifyResetOtp,
} = require("../controllers/form.js");
const { protect } = require('../middleware/authMiddleware');
const upload = require("../middleware/upload.js");

const router = express.Router();

// router.post("/submit", saveFormData); 

router.post(
  '/submit',
  (req, res, next) => {
    req.uploadContext = 'matrimonial'; 
    next();
  },
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'bioData', maxCount: 1 },
  ]),
  saveFormData
);

router.get("/approved", getApprovedFormData); 
router.get("/admin/pending",  getPendingFormData); 
router.post("/admin/review",  reviewForm); 
router.get('/status/:email', getUserStatus);
router.get('/approved', protect(['superadmin', 'matrimonialadmin']), getApprovedFormData);
router.get('/admin/pending', protect(['superadmin', 'matrimonialadmin']),  getPendingFormData);
router.get("/pending/count", getPendingFormCount);
router.get("/reject/count",getRejectedFormCount);
router.get("/rejected", getRejectedForms);
router.get("/deleted",getDeletedForms);
router.get("/approved/count",getFormCount);
router.delete('/deleteUser/:id', deleteUser);
router.post("/verify-reset-otp", verifyResetOtp);


const setProfileContext = (req, res, next) => {
  req.uploadContext = 'matrimonial'; 
  next();
};

router.patch(
  '/update/:id',
  setProfileContext,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'bioData', maxCount: 1 }
  ]),
  updateUserDetails
);

router.post("/request-reset-otp", requestResetOtp);

module.exports = router;
