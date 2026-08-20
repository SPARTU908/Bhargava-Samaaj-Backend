const express = require("express");

const router = express.Router();

const {
  createConferenceRegistration,
  getConferenceRegistration,
  submitConferencePayment,handleConferenceAdminAction,
} = require("../controllers/conferenceRegistrationController");

const upload = require("../middleware/upload");


router.post(
  "/create",
  createConferenceRegistration
);


/*
|--------------------------------------------------------------------------
| Get Registration
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  getConferenceRegistration
);


/*
|--------------------------------------------------------------------------
| STEP 2 - Submit Payment
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/payment",

  // Tell upload.js which folder to use
  (req, res, next) => {
    req.uploadContext = "conference-payment";
    next();
  },

  upload.fields([
    {
      name: "paymentScreenshot",
      maxCount: 1,
    },
  ]),

  submitConferencePayment
);

router.get(
  "/:id/admin-action",
  handleConferenceAdminAction
);


module.exports = router;