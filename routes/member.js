const express = require('express');
const {createMember} = require('../controllers/member');
const {getAllMembers} = require("../controllers/member");

const router = express.Router();
router.post('/register', createMember);
router.get("/allmember", getAllMembers);


module.exports=router;
