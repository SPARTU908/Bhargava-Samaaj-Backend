const express = require("express");
const router = express.Router();
const { loginUser,resetPassword,getUserByEmail } = require("../controllers/login");

router.post("/login", loginUser);
router.post("/auth/reset-password", resetPassword);
router.get("/form/:email", getUserByEmail);

module.exports = router;
