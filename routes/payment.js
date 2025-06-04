const express = require("express");
const router = express.Router();
const { savePayment,getPayment} = require("../controllers/payment");

router.post("/register", savePayment);
router.get("/allpayment", getPayment)


module.exports = router;
