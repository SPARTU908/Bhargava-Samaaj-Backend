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

module.exports = { createMember };
