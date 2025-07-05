const express = require("express");
const {
  saveFormData,
  getApprovedFormData,
  getPendingFormData,
  reviewForm,
  getUserStatus,getPendingFormCount,getFormCount,
} = require("../controllers/form.js");
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/submit", saveFormData); 
router.get("/approved", getApprovedFormData); 
router.get("/admin/pending",  getPendingFormData); 
router.post("/admin/review",  reviewForm); 
router.get('/status/:email', getUserStatus);
router.get('/approved', protect(['superadmin', 'matrimonialadmin']), getApprovedFormData);
router.get('/admin/pending', protect(['superadmin', 'matrimonialadmin']),  getPendingFormData);
router.get("/pending/count", getPendingFormCount);
router.get("/approved/count",getFormCount);

module.exports = router;
