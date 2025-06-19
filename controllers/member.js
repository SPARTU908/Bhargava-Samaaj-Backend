const Member = require("../models/member.js");

const createMember = async (req, res) => {
 
  try {
    const member = new Member(req.body);
    await member.save();
    
    res.status(201).json({ message: "Member created successfully" });
  } catch (error) {
    res.status(500).json({ message:error.message });
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


module.exports = { createMember , getAllMembers, getMemberCount};
