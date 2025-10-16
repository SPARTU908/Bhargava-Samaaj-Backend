const VivahMember = require("../models/vivahMemberRegister");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailsend.js");

const registerMember = async (req, res) => {
  
  try {
    const {
      name,
      email,
      phone,
      membershipno,
      gender,
      city,
      gotra,
      kuldevi,
      password,
      confirmpassword,
    } = req.body;

    const existingUser = await VivahMember.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newUser = new VivahMember({
      name,
      email,
      phone,
      membershipno,
      gender,
      city,
      gotra,
      kuldevi,
      password,
      confirmpassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await VivahMember.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
       
      },
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};


const getPendingMembers = async (req, res) => {
  try {
    const pendingMembers = await VivahMember.find({ status: "pending" });

    res.status(200).json({
      success: true,
      count: pendingMembers.length,
      members: pendingMembers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending members",
      error: error.message,
    });
  }
};

const reviewVivahMember = async (req, res) => {
  try {
    const { memberId, action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const user = await VivahMember.findById(memberId);
    if (!user) {
      return res.status(404).json({ error: "Member not found" });
    }

 
    let newStatus = "pending";
    if (action === "approve") {
      newStatus = user.status === "approved" ? "pending" : "approved";
    } else if (action === "reject") {
      newStatus = user.status === "rejected" ? "pending" : "rejected";
    }

    user.status = newStatus;
    await user.save();

   
    if (newStatus === "approved") {
      await sendEmail({
        to: user.email,
        subject: "Form Approved",
        text: `Hello ${user.name},`,
        html: `
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your login request has been <b>approved</b>. Please click the button below to login and explore biodatas.</p>
          <p>
            <a href="https://bhargavasamajglobal.org/vivahmemberlogin" style="
              display: inline-block;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            ">
              Login
            </a>
          </p>
          <p>Thank you,<br>Bhargava Samaaj Global</p>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Member status updated to ${newStatus}`,
      member: user,
    });
  } catch (err) {
    console.error("Error reviewing Vivah member:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    console.log("Reset request:", { email });

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required." });
    }

    const user = await VivahMember.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword;
    user.confirmpassword = newPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




module.exports = {
  registerMember,
  loginMember,
  getPendingMembers,
  reviewVivahMember,
  resetPassword ,
};
