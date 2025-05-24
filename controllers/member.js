const Member = require("../models/member.js");

const createMember = async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    console.log(member)
    res.status(201).json({ message: "Member created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating member" });
  }
};

module.exports = { createMember };
