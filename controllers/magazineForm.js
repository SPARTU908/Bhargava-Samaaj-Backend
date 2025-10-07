const Magazine = require("../models/magazineForm"); 

const registerMagazine = async (req, res) => {
  try {
    const {
      name, dob, address, city, pin,
      contact, email, transactionId
    } = req.body;

 
    const signature = req.files?.signature?.[0]?.location;

    if (!signature) {
      return res.status(400).json({ message: 'Signature file is required.' });
    }

    const newMagazine = new Magazine({
      name,
      dob,
      address,
      city,
      pin,
      contact,
      email,
      signature,
      transactionId,
    });

    await newMagazine.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: newMagazine
    });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `Duplicate entry for: ${duplicateField}` });
    }
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const getAllMagazines = async () => {
  try {
    console.log("Fetching all magazines from DB...");
    const magazines = await Magazine.find(); 
 
    return {
      success: true,
      data: magazines,
    };
  } catch (error) {
    console.error("Error fetching magazines:", error);
    throw error;
  }
};



module.exports = { registerMagazine,getAllMagazines};