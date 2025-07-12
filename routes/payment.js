const express = require("express");
const router = express.Router();
const { savePayment,getPayment,updatePaymentForm,createPayment} = require("../controllers/payment");

// router.post("/register", savePayment);
router.get("/allpayment", getPayment)
// router.put("/update",updatePaymentForm)
router.post("/create", createPayment);


module.exports = router;
