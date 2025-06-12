const express = require("express");
const router = express.Router();
const { savePayment,getPayment,updatePaymentForm} = require("../controllers/payment");

router.post("/register", savePayment);
router.get("/allpayment", getPayment)
router.put("/update",updatePaymentForm)


module.exports = router;
