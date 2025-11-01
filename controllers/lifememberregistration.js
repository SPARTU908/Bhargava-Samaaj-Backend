const NewLifeMember = require("../models/lifememberregistration");
const sendEmail = require("../mailsend");

const createLifeMember = async (req, res) => {
  try {
    const {
      Year,
      Title,
      Member_Name,
      Card_Issued,
      S_O_D_O_W_O,
      Date_of_Birth,
      Address,
      City,
      Pin,
      Contact_No,
      Email,
      Gotra,
      Kuldevi,
      gender,
      category,
    } = req.body;

    const photoFile = req.files?.photo?.[0];
    const photo = photoFile ? photoFile.location : null;

    const newMember = new NewLifeMember({
      Year,
      Title,
      Member_Name,
      Card_Issued,
      S_O_D_O_W_O,
      Date_of_Birth,
      Address,
      City,
      Pin,
      Contact_No,
      Email,
      Gotra,
      Kuldevi,
      gender,
      category,
      photo,
    });

    await newMember.save();

    try {
      await sendEmail({
        to: Email,
        subject: "Registration Confirmation - ABBS Life Membership",
        html: `
          <p>Dear ${Member_Name},</p>
          <p>Thank you for registering for the 134th Annual Conference to be held at Ujjain on 20th, 21st, and 22nd December 2025.</p>
          <p>We have successfully received your registration details.</p>
          <p>Please keep this email for your reference.</p>
          
          <br/>
          <p>Best regards,<br/>ABBS Conference Team</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    return res.status(201).json({
      message: "Life member registered successfully",
      member: newMember,
    });
  } catch (error) {
    console.error("Error registering life member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const searchLifeMember = async (req, res) => {
  try {
    const { LM_NO } = req.params;
    const member = await NewLifeMember.findOne({ LM_NO });

    if (!member) {
      return res.status(404).json({ message: "Life member not found." });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLifeMember = async (req, res) => {
  const { LM_NO } = req.params;
  const updateData = { ...req.body };

  if (req.files && req.files.photo && req.files.photo[0]) {
    updateData.photo = req.files.photo[0].location;
  }

  try {
    const updatedMember = await NewLifeMember.findOneAndUpdate(
      { LM_NO: LM_NO },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Life member not found" });
    }
    try {
      await sendEmail({
        to: updatedMember.Email,
        subject: "Life Membership Update Confirmation - ABBS",
        html: `
          <p>Dear ${updatedMember.Member_Name},</p>
          <p>Thank you for registering for the 134th Annual Conference to be held at Ujjain on 20th, 21st, and 22nd December 2025.</p>
          <p>Your life membership details have been successfully updated.</p>
          <br/>
          <p>Best regards,<br/>ABBS Conference Team</p>
        `,
      });
    } catch (emailError) {
      console.error("Error sending update confirmation email:", emailError);
    }

    res.status(200).json({
      message: "Life member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    console.error("Error updating life member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllLifeMembers = async (req, res) => {
  try {
    const members = await NewLifeMember.find();
    res.status(200).json(members);
  } catch (error) {
    console.error("Fetch all error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUpdatedLifeMembers = async (req, res) => {
  try {
    const updatedMembers = await NewLifeMember.find({
      $expr: { $ne: ["$createdAt", "$updatedAt"] },
    });

    res.status(200).json(updatedMembers);
  } catch (error) {
    console.error("Error fetching updated life members:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getNewLifeMembers = async (req, res) => {
  try {
    const newMembers = await NewLifeMember.find({
      createdAt: { $exists: true },
      updatedAt: { $exists: true },
      $expr: { $eq: ["$createdAt", "$updatedAt"] },
    }).sort({ createdAt: -1 });

    res.status(200).json(newMembers);
  } catch (error) {
    console.error("Error fetching new life members:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const softDeleteLifeMember = async (req, res) => {
  try {
    const {id } = req.params;
    console.log("Soft delete requested for ID:", id);
    const member = await NewLifeMember.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: "Life member not found" });
    }

    res.status(200).json({
      message: "Life member deleted successfully",
      data: member,
    });
  } catch (error) {
    console.error("Error deleting life member:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createLifeMember,
  searchLifeMember,
  getAllLifeMembers,
  updateLifeMember,
  getUpdatedLifeMembers,
  getNewLifeMembers,
  softDeleteLifeMember,
};
