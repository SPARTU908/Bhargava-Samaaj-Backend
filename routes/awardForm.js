const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { registerAwardForm,getAllUsers } = require('../controllers/awardForm');

// Middleware to set context
const setAwardFormContext = (req, res, next) => {
  req.uploadContext = 'awardform';
  next();
};

router.post(
  '/register',
  setAwardFormContext,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'document1', maxCount: 1 },
    { name: 'document2', maxCount: 1 }
  ]),
  registerAwardForm
);


router.get('/all-users', getAllUsers);

module.exports = router;
