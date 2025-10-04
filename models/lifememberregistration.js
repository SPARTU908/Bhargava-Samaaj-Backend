const mongoose = require("mongoose");

const lifeMemberSchema = new mongoose.Schema(
  {
    lm_no: {
      type: String,
      required: true,
      unique:true,
      index:true
    },
    year: {
      type: String,
      required: true,
    },
    col_y: {
      type: String,
      required: true,
    },
    member_name: {
      type: String,
      required: true,
    },
    card_issue: {
      type: String,
      required: true,
    },
    add: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address_extra: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    email: {
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
    gender: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Delegate",
        "Parent of Marriageable Candidate",
        "Marriageable Candidate",
   
      ],
      required:true
    },
    photo: { 
        type: String,
        required:true
     },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LifeMember", lifeMemberSchema);
