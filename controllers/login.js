const UserForm = require("../models/form");
const bcrypt = require("bcryptjs");

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await UserForm.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//    const isMatch = password === user.password;
//     if (!isMatch) {
//       return res.status(401).json({ error: "Incorrect password" });
//     }
//     res.status(200).json({ message: "Login successful", userId: user._id });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await UserForm.findOne({
      email: { $regex: `^${email}$`, $options: 'i' }
    });

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


const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required." });
    }

    const user = await UserForm.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const getUserByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }

//     const user = await UserForm.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching user by email:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await UserForm.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userObj = user.toObject();
  

    res.status(200).json(userObj);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  loginUser,
  resetPassword,
  getUserByEmail
};
