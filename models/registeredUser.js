const mongoose = require("mongoose");

const registeredUser = new mongoose.Schema(
  {
    lifemembershipNo: {
      type: String,
      required:true
 
    },
    year: {
      type: String,
      required:true
  
    },
    memberName: {
      type: String,
      required:true
    
    },
    cardIssue: {
      type: String,
      required:true
     
    },
    address: {
      type: String,
      required:true
     
    },
    dob: {
      type: Date,
      required:true
    
    },
    address1: {
      type: String,
      required:true
   
    },
    city: {
      type: String,
      required:true
    
    },
    pin: {
      type: Number,
      required:true
      
    },
    contactno: {
      type: String,
      required:true
    
    },
    email: {
      type: String,
      required:true
      
    },
    gotra: {
      type: String,
      required:true
     
    },
    kuldevi: {
      type: String,
      required:true
     
    },
    gender: {
      type: String,
       required:true
      
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
  { timestamps: true }
);

module.exports = mongoose.model("RegisteredUser", registeredUser);
