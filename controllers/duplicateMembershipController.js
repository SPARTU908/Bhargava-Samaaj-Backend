const LifeMemberMaster = require("../models/LifeMemberMaster");
const DuplicateMembership = require("../models/duplicateMembership");
// const searchMemberByLmNo = async (req, res) => {
//   try {
//     let { lmNo } = req.params;

//     if (!lmNo) {
//       return res.status(400).json({
//         success: false,
//         message: "LM Number is required",
//       });
//     }

//     lmNo = String(lmNo).trim();

//     const member = await LifeMemberMaster.findOne({
//       LM_NO: lmNo,
//     }).lean();

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "इस LM नंबर से कोई सदस्य नहीं मिला। कृपया LM नंबर जांचें।",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: member,
//     });
//   } catch (error) {
//     console.error("LM Search Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };



const searchMemberByLmNo = async (req, res) => {
  try {
    let { lmNo } = req.params;

    // console.log("REQ PARAM LM NO:", lmNo);
    // console.log("TYPE:", typeof lmNo);

    if (!lmNo) {
      return res.status(400).json({
        success: false,
        message: "LM Number is required",
      });
    }

    lmNo = String(lmNo).trim();


    const member = await LifeMemberMaster.findOne({
      LM_NO: lmNo,
    }).lean();

    // console.log("FOUND MEMBER:", member);

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "इस LM नंबर से कोई सदस्य नहीं मिला। कृपया LM नंबर जांचें।",
      });
    }

    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("LM Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


// const searchMemberByDetails = async (req, res) => {
//   try {
//     const {
//       name,
//       dob,
//       mobile,
//     } = req.body;
//     console.log("SEARCH BODY:", req.body);

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Name is required",
//       });
//     }

//     const query = {
//       Member_Name: {
//         $regex: `^${escapeRegex(name.trim())}$`,
//         $options: "i",
//       },
//     };

   
//     if (dob) {
//       query.Date_of_Birth = {
//         $regex: escapeRegex(dob.trim()),
//         $options: "i",
//       };
//     }

//     if (mobile) {
//       query.Contact_No = {
//         $regex: escapeRegex(
//           mobile.replace(/\D/g, "").slice(-10)
//         ),
//         $options: "i",
//       };
//     }

//     const members = await LifeMemberMaster.find(query)
//       .select(
//         "LM_NO Member_Name Date_of_Birth Contact_No S_O_D_O_W_O Address City Pin Email Gotra Kuldevi Occupation"
//       )
//       .limit(20)
//       .lean();

//     if (!members.length) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "दिए गए विवरण से कोई सदस्य नहीं मिला।",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       count: members.length,
//       data: members,
//     });
//   } catch (error) {
//     console.error(
//       "Member detail search error:",
//       error
//     );
//     console.log("FINAL QUERY:", JSON.stringify(query, null, 2));

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

const searchMemberByDetails = async (req, res) => {
  try {
    const {
      name,
      dob,
      mobile,
    } = req.body;

    console.log("SEARCH BODY:", req.body);

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const query = {
      Member_Name: {
        // partial name match
        $regex: escapeRegex(name.trim()),
        $options: "i",
      },
    };

    /*
      DOB/mobile optional hain because
      old Excel records me values missing ho sakti hain.
    */

    if (dob && dob.trim()) {
      query.Date_of_Birth = {
        $regex: escapeRegex(dob.trim()),
        $options: "i",
      };
    }

    if (mobile && mobile.trim()) {
      const cleanMobile = mobile
        .replace(/\D/g, "")
        .slice(-10);

      query.Contact_No = {
        $regex: cleanMobile,
        $options: "i",
      };
    }

    console.log(
      "FINAL QUERY:",
      JSON.stringify(query, null, 2)
    );

    const members =
      await LifeMemberMaster.find(query)
        .select(
          "LM_NO Member_Name Date_of_Birth Contact_No S_O_D_O_W_O Address CITY City Pin Email Gotra Kuldevi Occupation"
        )
        .limit(20)
        .lean();

    console.log(
      "MEMBERS FOUND:",
      members.length
    );

    if (!members.length) {
      return res.status(404).json({
        success: false,
        message:
          "दिए गए विवरण से कोई सदस्य नहीं मिला।",
      });
    }

    return res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });

  } catch (error) {
    console.error(
      "Member detail search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const createDuplicateMembership = async (
  req,
  res
) => {
  try {
    const {
      name,
      abbsLmNo,
      mobile,
      email,
      dob,
      relationName,
      occupation,

      spouseName,
      spouseLmNo,
      spouseRelationName,
      spouseDob,
      spouseOccupation,
      spouseMobile,
      spouseEmail,

      gotra,
      kuldevi,
      oldAddress,
      newAddress,
      pincode,
    } = req.body;

    // ----------------------------
    // Required validation
    // ----------------------------

    if (
      !name ||
      !abbsLmNo ||
      !mobile ||
      !email ||
      !dob ||
      !relationName ||
      !occupation ||
      !gotra ||
      !kuldevi ||
      !oldAddress ||
      !newAddress ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields.",
      });
    }

    // ----------------------------
    // Verify member LM no
    // ----------------------------

    const masterMember =
      await LifeMemberMaster.findOne({
        LM_NO: String(abbsLmNo).trim(),
      });

    if (!masterMember) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid ABBS LM Number.",
      });
    }

    // ----------------------------
    // Prevent member mismatch
    // ----------------------------

    const masterName =
      masterMember.Member_Name
        ?.trim()
        .toLowerCase();

    const submittedName = name
      .trim()
      .toLowerCase();

    if (
      masterName &&
      submittedName !== masterName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "LM number and member name do not match.",
      });
    }

    // ----------------------------
    // Main uploads
    // ----------------------------

    if (
      !req.files?.photo ||
      !req.files?.aadharCard ||
      !req.files?.signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Photo, Aadhaar card and signature are required.",
      });
    }

    const photo =
      req.files.photo[0].location;

    const aadharCard =
      req.files.aadharCard[0].location;

    const signature =
      req.files.signature[0].location;

    // ----------------------------
    // Spouse
    // ----------------------------

    let spouse = null;
    let spouseVerified = false;
    let totalMembers = 1;

    if (spouseName || spouseLmNo) {
      if (!spouseName || !spouseLmNo) {
        return res.status(400).json({
          success: false,
          message:
            "Spouse name and spouse LM number are required.",
        });
      }

      const spouseMaster =
        await LifeMemberMaster.findOne({
          LM_NO: String(
            spouseLmNo
          ).trim(),
        });

      if (!spouseMaster) {
        return res.status(400).json({
          success: false,
          message:
            "Spouse ABBS LM number is invalid.",
        });
      }

      const masterSpouseName =
        spouseMaster.Member_Name
          ?.trim()
          .toLowerCase();

      if (
        masterSpouseName &&
        spouseName
          .trim()
          .toLowerCase() !==
          masterSpouseName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Spouse LM number and name do not match.",
        });
      }

      if (
        !req.files?.spousePhoto ||
        !req.files?.spouseAadharCard ||
        !req.files?.spouseSignature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Spouse photo, Aadhaar card and signature are required.",
        });
      }

      spouse = {
        name: spouseName,

        abbsLmNo: spouseLmNo,

        relationName:
          spouseRelationName || "",

        dob: spouseDob || null,

        occupation:
          spouseOccupation || "",

        mobile:
          spouseMobile || "",

        email:
          spouseEmail || "",

        photo:
          req.files.spousePhoto[0]
            .location,

        aadharCard:
          req.files
            .spouseAadharCard[0]
            .location,

        signature:
          req.files
            .spouseSignature[0]
            .location,
      };

      spouseVerified = true;

      totalMembers = 2;
    }


    const feePerMember = 50;

    // const totalAmount =
    //   totalMembers * feePerMember;

    const totalAmount = 50;

    const application =
      await DuplicateMembership.create({
        name,
        abbsLmNo,
        mobile,
        email,
        dob,
        relationName,
        occupation,

        gotra,
        kuldevi,

        oldAddress,
        newAddress,
        pincode,

        photo,
        aadharCard,
        signature,

        spouse,

        memberVerified: true,
        spouseVerified,

        totalMembers,
        feePerMember,
        totalAmount,

        paymentStatus: "pending",
        applicationStatus:
          "pending_payment",
      });

    return res.status(201).json({
      success: true,

      message:
        "Duplicate card application created successfully.",

      data: {
        applicationId:
          application._id,

        totalMembers:
          application.totalMembers,

        feePerMember:
          application.feePerMember,

        totalAmount:
          application.totalAmount,

        paymentStatus:
          application.paymentStatus,
      },
    });
  } catch (error) {
    console.error(
      "Duplicate membership create error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
};

const getAllDuplicateApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await DuplicateMembership.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateDuplicateApplicationStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        status,
        remarks = "",
      } = req.body;

      if (
        ![
          "approved",
          "rejected",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status.",
        });
      }

      const application =
        await DuplicateMembership.findById(
          id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found.",
        });
      }

      if (status === "approved") {
        application.paymentStatus =
          "verified";

        application.applicationStatus =
          "approved";
      }

      if (status === "rejected") {
        application.paymentStatus =
          "rejected";

        application.applicationStatus =
          "rejected";
      }

      application.adminRemarks =
        remarks;

      await application.save();

      return res.status(200).json({
        success: true,
        message: `Application ${status} successfully.`,
        data: application,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  const submitDuplicatePayment = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { transactionId } =
      req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction ID is required.",
      });
    }

    if (
      !req.file &&
      !req.files?.paymentScreenshot
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment screenshot is required.",
      });
    }

    const application =
      await DuplicateMembership.findById(
        id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found.",
      });
    }

    let screenshotUrl;

    if (req.file) {
      screenshotUrl =
        req.file.location;
    } else {
      screenshotUrl =
        req.files
          .paymentScreenshot[0]
          .location;
    }

    application.transactionId =
      transactionId;

    application.paymentScreenshot =
      screenshotUrl;

    application.paymentStatus =
      "submitted";

    application.applicationStatus =
      "payment_submitted";

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment submitted successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Payment submit error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


  module.exports = {
  searchMemberByLmNo,
  searchMemberByDetails,
  createDuplicateMembership,
  submitDuplicatePayment,
  getAllDuplicateApplications,
  updateDuplicateApplicationStatus,
};