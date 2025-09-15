// const express = require('express');
// const router = express.Router();
// const upload = require('../middleware/upload');


// const { register,getAllUsers } = require('../controllers/registeredUser');

// router.post('/user', upload.fields([
//   { name: 'paymentSlip', maxCount: 1 },
//   { name: 'photo', maxCount: 1 }
// ]), register);
// router.get('/all-users', getAllUsers);

// module.exports = router;





const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { register, getAllUsers } = require('../controllers/registeredUser');


const setRegistrationContext = (req, res, next) => {
  req.uploadContext = 'registration';
  next();
};


router.post(
  '/user',
  setRegistrationContext, 
  upload.fields([
    { name: 'paymentSlip', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
  ]),
  register
);


router.get('/all-users', getAllUsers);

module.exports = router;
