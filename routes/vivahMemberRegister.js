const express = require("express");
const {registerMember, loginMember,getPendingMembers,reviewVivahMember} = require("../controllers/vivahMemberRegister.js");
const router = express.Router();

router.post("/register", registerMember); 
router.post("/member/login",loginMember);
router.get("/pending",getPendingMembers);
router.post("/review", reviewVivahMember);


module.exports = router;
