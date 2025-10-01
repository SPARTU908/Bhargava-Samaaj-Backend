const AwardForm = require('../models/awardForm');

const registerAwardForm = async (req, res) => {
  try {
    const {
      code1, code2, code3,
      name, dob, mobile, email, address, pin,
      academicQualification, occupation,
      father, mother, spouse,spousedob, spouseOccupation,
      proposerName, proposerEmail, proposerMobile, proposerAddress
    } = req.body;


    const photo = req.files?.photo?.[0]?.location;
    const document1 = req.files?.document1?.[0]?.location;
    const document2 = req.files?.document2?.[0]?.location;


 if (!photo || !document1 ) {
      return res.status(400).json({ message: 'Photo and Documents are required.' });
    }

    const newForm = new AwardForm({
      code1, code2, code3,
      name, dob, mobile, email, address, pin,
      academicQualification, occupation,
      father, mother, spouse, spouseOccupation,spousedob,
      photo, document1, document2,
      proposerName, proposerEmail, proposerMobile, proposerAddress
    });

    await newForm.save();

    res.status(201).json({ message: 'Award form submitted successfully.', data: newForm });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `Duplicate entry for: ${duplicateField}` });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const awardForms = await AwardForm.find().sort({ createdAt: -1 });
    res.status(200).json({ awardForms });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch award forms" });
  }
};

module.exports = { registerAwardForm, getAllUsers };
