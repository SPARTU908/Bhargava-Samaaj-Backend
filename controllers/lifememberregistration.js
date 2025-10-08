const LifeMember = require("../models/lifememberregistration");

const createLifeMember = async (req, res) => {
  if (req.files && req.files.photo && req.files.photo[0]) {
    console.log("Photo upload file object:", req.files.photo[0]);
  } else {
    console.log("No photo file uploaded");
  }

  try {
    const {
      lm_no,
      year,
      col_y,
      member_name,
      card_issue,
      add,
      dob,
      contact_no,
      email,
      address1,
      address_extra,
      city,
      pin,
      gotra,
      kuldevi,
      gender,
      category,
    } = req.body;

    if (
      !lm_no ||
      !year ||
      !col_y ||
      !card_issue ||
      !add ||
      !dob ||
      !member_name ||
      !contact_no ||
      !email ||
      !address1 ||
      !address_extra ||
      !city ||
      !pin ||
      !gotra ||
      !kuldevi ||
      !gender ||
      !category
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const existingMember = await LifeMember.findOne({ lm_no });
    if (existingMember) {
      return res
        .status(409)
        .json({ message: "Life member with this LM No already exists." });
    }

    let photoUrl = "";
    if (req.files && req.files.photo && req.files.photo[0]) {
      photoUrl = req.files.photo[0].location;
    } else {
      console.log("❌ Photo not uploaded");
      return res.status(400).json({ message: "Photo is required." });
    }

    const newMember = new LifeMember({
      lm_no,
      year,
      col_y,
      member_name,
      card_issue,
      add,
      dob,
      contact_no,
      email,
      address1,
      address_extra,
      city,
      pin,
      gotra,
      kuldevi,
      gender,
      category,
      photo: photoUrl,
    });

    await newMember.save();

    res
      .status(201)
      .json({ message: "Life member created successfully", data: newMember });
  } catch (error) {
    console.error("Create error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

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

const updateLifeMember = async (req, res) => {
  const { lm_no } = req.params;
  const updateData = { ...req.body };

  if (req.files && req.files.photo && req.files.photo[0]) {
    updateData.photo = req.files.photo[0].location;
  }

  try {
    const updatedMember = await LifeMember.findOneAndUpdate(
      { lm_no: lm_no },
      updateData,
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

// const getUpdatedLifeMembers = async (req, res) => {
//   try {
//     const updatedMembers = await LifeMember.find({
//      lm_no: { $nin: [null, ""] },
//       year: { $nin: [null, ""] },
//       col_y: { $nin: [null, ""] },
//       member_name: { $nin: [null, ""] },
//       card_issue: { $nin: [null, ""] },
//       add: { $nin: [null, ""] },
//       dob: { $nin: [null, ""] },
//       address1: { $nin: [null, ""] },
//       address_extra: { $nin: [null, ""] },
//       city: { $nin: [null, ""] },
//       pin: { $nin: [null, ""] },
//       contact_no: { $nin: [null, ""] },
//       email: { $nin: [null, ""] },
//       gotra: { $nin: [null, ""] },
//       kuldevi: { $nin: [null, ""] },
//       gender: { $nin: [null, ""] },
//       category: { $nin: [null, ""] },
//       photo: { $nin: [null, ""] },
//     });

//     res.status(200).json(updatedMembers);
//   } catch (error) {
//     console.error("Error fetching updated life members:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };
const getUpdatedLifeMembers = async (req, res) => {
  try {
    const updatedMembers = await LifeMember.find({
      $expr: { $ne: ["$createdAt", "$updatedAt"] } 
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
module.exports = {
  createLifeMember,
  searchLifeMember,
  getAllLifeMembers,
  updateLifeMember,
  getUpdatedLifeMembers,
};
