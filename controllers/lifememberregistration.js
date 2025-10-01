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
      return res.status(404).json({ message: "Life member not found." });
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

   
    if ((!member.photo || member.photo === "") && photoUrl) {
      member.photo = photoUrl;
    }

    await member.save();

    res.status(200).json({
      message: "Fields updated successfully.",
      updatedData: member,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





module.exports = {
  searchLifeMember,
  updateEmptyFields,
 
};
