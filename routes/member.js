const express = require('express');
const {createMember} = require('../controllers/member');
const {getAllMembers} = require("../controllers/member");
const {getMemberCount} = require("../controllers/member");
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', createMember);
router.get("/allmember", getAllMembers);
router.get("/count",getMemberCount);
router.get('/allmember', protect(['superadmin', 'membershipadmin']), getAllMembers);


module.exports=router;
