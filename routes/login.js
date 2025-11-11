const express = require("express");
const router = express.Router();
const { loginUser,resetPassword,getUserById } = require("../controllers/login");

router.post("/login", loginUser);
router.post("/auth/reset-password", resetPassword);
router.get("/form/:id", getUserById);

module.exports = router;
