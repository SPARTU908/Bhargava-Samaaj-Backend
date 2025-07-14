const Member = require("../models/membership.js");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../utils/cloudinary");

const createMember = async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();

    res.status(201).json({
      message: "Member created successfully",
      memberId: member._id, // So frontend can use this to upload file later
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};

const loginMember = async (req, res) => {
  try {
    const { name, membership } = req.body;
    if (!name || !membership) {
      return res.status(400).json({ message: "Name and membership are required" });
    }
    const member = await Member.findOne({ name, membership });

    if (!member) {
      return res.status(404).json({ message: "Member not found or invalid credentials" });
    }
  const token = jwt.sign({ memberId: member._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", 
    });

    res.status(200).json({
      message: "Login successful",
      token,
      memberId: member._id,
      membership: member.membership,
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};


const uploadFormFile = async (req, res) => {
  try {
    const memberId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileType = path.extname(req.file.originalname).toLowerCase();
    const resourceType = fileType === ".pdf" ? "raw" : "image";

    // ✅ Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      folder: "uploads/forms", // Optional Cloudinary folder
      resource_type: resourceType,
    });

    // ✅ Delete local file
    fs.unlinkSync(filePath);

    // ✅ Save Cloudinary URL in MongoDB
    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      { uploadForm: cloudinaryResponse.secure_url },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
};



const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMemberCount = async (req, res) => {
  try {
    const count = await Member.countDocuments();
      res.status(200).json({ count }); 
  } catch (error) {
    console.log("Error fetching pending form count:", error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};


module.exports = { createMember , getAllMembers, getMemberCount ,uploadFormFile,loginMember};
