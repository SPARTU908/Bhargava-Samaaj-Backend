const RegisteredUser = require("../models/registeredUser");

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

const updateMissingFields = async (req, res) => {
  try {
    const { lifemembershipNo } = req.params;
    const updates = req.body;

    const photoFile = req.files?.photo?.[0];
    const photoUrl = photoFile ? photoFile.location : null;

    const user = await RegisteredUser.findOne({ lifemembershipNo });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    for (let key in updates) {
      if (!user[key] || user[key] === "" || user[key] === null) {
        user[key] = updates[key];
      }
    }

    if ((!user.photo || user.photo === "") && photoUrl) {
      user.photo = photoUrl;
    }
    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserByMembershipNo,
  updateMissingFields,
};
