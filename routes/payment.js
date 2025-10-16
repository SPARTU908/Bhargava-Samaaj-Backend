const express = require("express");
const router = express.Router();
const { savePayment,getPayment,updatePaymentForm,createPayment} = require("../controllers/payment");


router.get("/allpayment", getPayment)

router.post("/create", createPayment);


module.exports = router;
