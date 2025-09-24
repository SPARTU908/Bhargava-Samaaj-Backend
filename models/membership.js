const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    spouse: {
      type: String,
      required: function() {
        return this.membership === "आजीवन सभासद - युगल-(पति-पत्नी) - 1000 रुपये";
      },
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
      required:true,
    },
    signature: {
      type: String,
      required:true,
    },
    spouseSignature: {
      type: String,
      required: function() {
        return this.membership === "आजीवन सभासद - युगल-(पति-पत्नी) - 1000 रुपये";
      },
    },
    uploadAadharUser: {
      type: String,
    },
    uploadAadharSpouse: {
      type: String,
      required: function() {
        return this.membership === "आजीवन सभासद - युगल-(पति-पत्नी) - 1000 रुपये";
      },
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
      required: function() {
        return this.membership === "आजीवन सभासद - युगल-(पति-पत्नी) - 1000 रुपये";
      },
    },
    email: {
      type: String,
      required: true,
    },
    spouseEmail: {
      type: String,
      required: function() {
        return this.membership === "आजीवन सभासद - युगल-(पति-पत्नी) - 1000 रुपये";
      },
    },
    address: {
      type: String,
      required: true,
    },
    spousePhoto: {
      type: String,
      required: function() {
        return this.membership === "आजीवन सभासद - युगल-(पति-पत्नी) - 1000 रुपये";
      },
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
    isDispatched: {
      type: Boolean,
      default: false,
    },
    dispatchedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Members", memberSchema);
