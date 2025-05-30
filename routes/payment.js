const express = require("express");
const router = express.Router();
const { savePayment } = require("../controllers/payment");

router.post("/payment", savePayment);

module.exports = router;
