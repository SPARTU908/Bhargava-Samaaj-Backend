
const mongoose = require('mongoose');

const registeredUser = new mongoose.Schema({
  abbsMembershipNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Delegate', 'Parent of Marriageable Candidate', 'Marriageable Candidate'],
    required: true
  },
  photo:{
    type:String,
    required:true
  },
  paymentSlip: {
    type: String, 
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('RegisteredUser', registeredUser);
