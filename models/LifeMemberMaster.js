const mongoose = require("mongoose");

const lifeMemberMasterSchema = new mongoose.Schema(
  {
    LM_NO: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
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
      index: true,
      trim: true,
    },

    Card_Issued: {
      type: String,
      default: "",
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
      index: true,
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

    Occupation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "lifemembermasters",
  }
);

module.exports = mongoose.model(
  "LifeMemberMaster",
  
  lifeMemberMasterSchema
);