const UserForm = require("../models/form");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await UserForm.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
};
