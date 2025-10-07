const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');
const { registerMagazine,getAllMagazines } = require("../controllers/magazineForm");



const setMagazineContext = (req, res, next) => {
  req.uploadContext = 'magazineform';
  next();
};

router.post(
  '/register',
  setMagazineContext,
  upload.fields([
    { name: 'signature', maxCount: 1 }
  ]),
  registerMagazine
);
router.get("/get-all",getAllMagazines);

module.exports = router;
