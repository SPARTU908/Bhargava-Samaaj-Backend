const mongoose = require("mongoose");

const lifeMemberSchema = new mongoose.Schema(
  {
    LM_NO: {
      type: String,
      required: true,
      unique:true,
      index:true
    },
    Year: {
      type: String,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Member_Name: {
      type: String,
      required: true,
    },
    Card_Issued: {
      type: String,
      required: true,
    },
    S_O_D_O_W_O: {
      type: String,
      required: true,
    },
    Date_of_Birth: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required:true,
    },
    
    Pin: {
      type: String,
      required: true,
    },
    
    Contact_No: {
      type: String,
      required: true,
    },
    
    Email: {
      type: String,
      required: true,
    },
    Gotra: {
      type: String,
      required: true,
    },
    
    Kuldevi: {
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

module.exports = mongoose.model("NewLifeMember", lifeMemberSchema);
