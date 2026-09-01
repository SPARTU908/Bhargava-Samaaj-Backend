const mongoose = require("mongoose");

const conferenceMemberSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      default: "",
    },

    memberType: {
      type: String,
      enum: ["Primary", "Family"],
      required: true,
    },

    relation: {
      type: String,
      default: "",
    },

    LM_NO: {
      type: String,
      default: "",
    },

    Year: {
      type: String,
      default: "",
    },

    Title: {
      type: String,
      default: "",
    },

    Member_Name: {
      type: String,
      required: true,
    },

   

    S_O_D_O_W_O: {
      type: String,
      default: "",
    },

    Date_of_Birth: {
      type: String,
      default: "",
    },

    Address: {
      type: String,
      default: "",
    },

    City: {
      type: String,
      default: "",
    },

    Pin: {
      type: String,
      default: "",
    },

    Contact_No: {
      type: String,
      default: "",
    },

    Email: {
      type: String,
      default: "",
    },

    Gotra: {
      type: String,
      default: "",
    },

    Kuldevi: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },
        photo: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const conferenceRegistrationSchema = new mongoose.Schema(
  {
    primaryMemberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewLifeMember",
      required: true,
    },

    members: {
      type: [conferenceMemberSchema],
      required: true,
    },

    totalMembers: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    payment: {
      screenshot: {
        type: String,
        default: "",
      },

      transactionId: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: ["pending", "submitted", "verified", "rejected"],
        default: "pending",
      },

      submittedAt: {
        type: Date,
        default: null,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },

      remarks: {
        type: String,
        default: "",
      },
    },

    registrationStatus: {
      type: String,
      enum: [
        "payment_pending",
        "payment_submitted",
        "approved",
        "rejected",
      ],
      default: "payment_pending",
    },
    approval: {
  token: {
    type: String,
    default: "",
  },

  tokenExpiresAt: {
    type: Date,
    default: null,
  },

  actionAt: {
    type: Date,
    default: null,
  },

  actionBy: {
    type: String,
    default: "",
  },
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ConferenceRegistration",
  conferenceRegistrationSchema
);