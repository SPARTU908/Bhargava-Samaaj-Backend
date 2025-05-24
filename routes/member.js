const express = require('express');
const {createMember} = require('../controllers/member.js');

const router = express.Router();
router.post('/register', createMember);

module.exports=router;
