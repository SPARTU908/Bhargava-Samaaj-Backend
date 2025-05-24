const express = require("express");
const {
  saveFormData,
  getApprovedFormData,
  getPendingFormData,
  reviewForm,
} = require("../controllers/form.js");



const router = express.Router();

router.post("/submit", saveFormData); 
router.get("/approved", getApprovedFormData); 
router.get("/admin/pending",  getPendingFormData); 
router.post("/admin/review",  reviewForm); 

module.exports = router;
