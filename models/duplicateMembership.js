const mongoose = require("mongoose");

const spouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    abbsLmNo: {
      type: String,
      default: "",
      trim: true,
    },

    relationName: {
      type: String,
      default: "",
    },

    dob: {
      type: Date,
      default: null,
    },

    occupation: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    aadharCard: {
      type: String,
      default: "",
    },

    signature: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const duplicateMembershipSchema = new mongoose.Schema(
  {
    // Main member

    name: {
      type: String,
      required: true,
      trim: true,
    },

    abbsLmNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    relationName: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
      required: true,
    },

    gotra: {
      type: String,
      required: true,
    },

    kuldevi: {
      type: String,
      required: true,
    },

    oldAddress: {
      type: String,
      required: true,
    },

    newAddress: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    newPincode: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      required: true,
    },

    aadharCard: {
      type: String,
      required: true,
    },

    signature: {
      type: String,
      required: true,
    },

    // spouse information
    spouse: {
      type: spouseSchema,
      default: null,
    },

    // Verification info
    memberVerified: {
      type: Boolean,
      default: false,
    },

    spouseVerified: {
      type: Boolean,
      default: false,
    },

    // payment
    totalMembers: {
      type: Number,
      default: 1,
    },

    feePerMember: {
      type: Number,
      default: 50,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "rejected"],
      default: "pending",
    },

    applicationStatus: {
      type: String,
      enum: [
        "pending_payment",
        "payment_submitted",
        "approved",
        "rejected",
        "dispatched",
      ],
      default: "pending_payment",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    dispatchedAt: {
      type: Date,
      default: null,
    },
    adminRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "DuplicateMembership",
  duplicateMembershipSchema,
);
