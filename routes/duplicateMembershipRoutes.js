const express = require("express");

const router = express.Router();

const {
  searchMemberByLmNo,
  searchMemberByDetails,
  createDuplicateMembership,
  submitDuplicatePayment,
  getAllDuplicateApplications,
  updateDuplicateApplicationStatus,
} = require(
  "../controllers/duplicateMembershipController"
);

const upload = require("../middleware/upload");


const setUploadContext = (context) => {
  return (req, res, next) => {
    req.uploadContext = context;
    next();
  };
};


/*
|--------------------------------------------------------------------------
| SEARCH EXISTING LIFE MEMBER
|--------------------------------------------------------------------------
*/

router.get(
  "/search/lm/:lmNo",
  searchMemberByLmNo
);

router.post(
  "/search/details",
  searchMemberByDetails
);


/*
|--------------------------------------------------------------------------
| CREATE DUPLICATE CARD APPLICATION
|--------------------------------------------------------------------------
*/

router.post(
  "/apply",

  // IMPORTANT: upload se pehle context set hoga
  setUploadContext("duplicate-membership"),

  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name: "aadharCard",
      maxCount: 1,
    },
    {
      name: "signature",
      maxCount: 1,
    },
    {
      name: "spousePhoto",
      maxCount: 1,
    },
    {
      name: "spouseAadharCard",
      maxCount: 1,
    },
    {
      name: "spouseSignature",
      maxCount: 1,
    },
  ]),

  createDuplicateMembership
);


/*
|--------------------------------------------------------------------------
| PAYMENT
|--------------------------------------------------------------------------
*/

router.post("/:id/payment", setUploadContext("duplicate-payment"), upload.single("paymentScreenshot"), submitDuplicatePayment );


/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/all",
  getAllDuplicateApplications
);

router.patch(
  "/admin/:id/status",
  updateDuplicateApplicationStatus
);


module.exports = router;