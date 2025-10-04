const LifeMember = require("../models/lifememberregistration");

const searchLifeMember = async (req, res) => {
  try {
    const { lm_no } = req.params;

    const member = await LifeMember.findOne({ lm_no });

    if (!member) {
      return res.status(404).json({ message: "Life member not found." });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateEmptyFields = async (req, res) => {
  try {
    const { lm_no } = req.params;
    const updates = req.body;
    const photoFile = req.files?.photo?.[0];
    const photoUrl = photoFile ? photoFile.location : null;

    const member = await LifeMember.findOne({ lm_no });

    if (!member) {
      return res.status(404).json({ message: " ABBS life member not found." });
    }

    Object.keys(updates).forEach((key) => {
      const currentValue = member[key];
      if (
        currentValue === "" ||
        currentValue === null ||
        currentValue === undefined
      ) {
        member[key] = updates[key];
      }
    });

    // if ((!member.photo || member.photo === "") && photoUrl) {
    //   member.photo = photoUrl;
    // }
    if (photoUrl) {
      member.photo = photoUrl;
    }
    await member.save();

    res.status(200).json({
      message: "Fields updated successfully.",
      updatedData: member,
    });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


const updateLifeMember = async (req, res) => {
  const { lm_no } = req.params;

  try {
    const updatedMember = await LifeMember.findOneAndUpdate(
      { lm_no: lm_no },      
      req.body,               
      { new: true, runValidators: true }  
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Life member not found" });
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
    const members = await LifeMember.find();
    res.status(200).json(members);
  } catch (error) {
    console.error("Fetch all error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  searchLifeMember,
  updateEmptyFields,
  getAllLifeMembers,
  updateLifeMember
};
