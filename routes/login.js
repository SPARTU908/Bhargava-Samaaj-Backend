const express = require("express");
const router = express.Router();
const { loginUser,resetPassword } = require("../controllers/login");

router.post("/login", loginUser);
router.post("/auth/reset-password", resetPassword);

module.exports = router;
