const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    spouse: {
      type: String,
    },
    dob: {
      type: Date,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    spouseSignature: {
      type: String,
    },
    fatherName: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },
    spouseMobile: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    spouseEmail: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    spousePhoto: {
      type: String,
    },
    gotra: {
      type: String,
      required: true,
    },
    kuldevi: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    membership: {
      type: String,
      required: true,
      enum: [
        "साधारण सभासद-द्विवार्षिक सत्र के लिए - 300 रुपये",
        "आजीवन सभासद - एकल - 600 रुपये",
        "आजीवन सभासद - युगल-(पति-पत्नी) - 1000 रुपये",
        "डुप्लिकेट परिचय शुल्क - ₹50 रुपये",
      ],
    },
    uploadForm: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Members", memberSchema);
