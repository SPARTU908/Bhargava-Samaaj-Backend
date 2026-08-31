const express = require("express");

const router = express.Router();

const {
  createConferenceRegistration,
  getConferenceRegistration,
  submitConferencePayment,handleConferenceAdminAction,
  getAllConferenceRegistrations,
  checkApprovedConferenceRegistration,
  checkNonAbbsConferenceRegistration,
} = require("../controllers/conferenceRegistrationController");

const upload = require("../middleware/upload");

router.get(
  "/admin/all",
  getAllConferenceRegistrations
);
router.post(
  "/create",
  createConferenceRegistration
);

router.get(
  "/check-approved/:memberId",
  checkApprovedConferenceRegistration,
);

router.get(
  "/check-non-abbs",
  checkNonAbbsConferenceRegistration,
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