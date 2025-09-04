const express = require("express");
const {registerMember, loginMember,getPendingMembers,reviewVivahMember,resetPassword } = require("../controllers/vivahMemberRegister.js");
const router = express.Router();

router.post("/register", registerMember); 
router.post("/member/login",loginMember);
router.get("/pending",getPendingMembers);
router.post("/review", reviewVivahMember);
router.post("/reset-password", resetPassword )



module.exports = router;
