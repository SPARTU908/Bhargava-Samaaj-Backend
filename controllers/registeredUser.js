const RegisteredUser = require("../models/registeredUser");

// const register = async (req, res) => {
//   try {
//     const {
//       abbsMembershipNo,
//       name,
//       gender,
//       dob,
//       address,
//       city,
//       pincode,
//       mobileNo,
//       email,
//       category,
//     } = req.body;

   
//     const photo = req.files?.photo?.[0]?.location;

//     const newForm = new RegisteredUser({
//       abbsMembershipNo,
//       name,
//       gender,
//       dob,
//       address,
//       city,
//       pincode,
//       mobileNo,
//       email,
//       category,
     
//       photo,
//     });

//     await newForm.save();

   

//     res
//       .status(201)
//       .json({ message: "Form submitted successfully", form: newForm });
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     res.status(500).json({ error: "Server Error" });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const users = await RegisteredUser.find().sort({ createdAt: -1 });
//     res.status(200).json({ users });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };


const getUserByMembershipNo = async (req, res) => {
  try {
    const { lifemembershipNo } = req.params;
     console.log("Searching for:", lifemembershipNo);

    const user = await RegisteredUser.findOne({ lifemembershipNo });
    console.log("Found user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Update missing fields
const updateMissingFields = async (req, res) => {
  try {
    const { lifemembershipNo } = req.params;
    const updates = req.body;

    // Check if a new photo file is uploaded
    const photoFile = req.files?.photo?.[0];
    const photoUrl = photoFile ? photoFile.location : null; // DigitalOcean Spaces file URL

    const user = await RegisteredUser.findOne({ lifemembershipNo });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update only fields that are currently missing or empty
    for (let key in updates) {
      if (!user[key] || user[key] === "" || user[key] === null) {
        user[key] = updates[key];
      }
    }

    // If user.photo is missing and a photo file was uploaded, update it
    if ((!user.photo || user.photo === "") && photoUrl) {
      user.photo = photoUrl;
    }

    const updatedUser = await user.save();

    res.status(200).json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  getUserByMembershipNo,
  updateMissingFields,
};


