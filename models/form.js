const mongoose = require("mongoose");

const userFormSchema = new mongoose.Schema({
  number: Number,
  name: String,
  email: String,
  mobile: Number,
  gender: String,
  birthTime: String,
  birthPlace: String,
  height: Number,
  weight: Number,
  dob: Date,
  bloodGroup: String,
  manglik: String,
  gotra: String,
  kuldevi: String,
  complexion: String,
  education: String,
  professionQualification:String,
  profession: String,
  company: String,
  designation: String,
  income: String,
  hobbies: String,
  otherQualification: String,
  guardianName: String,
  fatherName: String,
  fatherProfession: String,
  fatherIncome: Number,
  // fatherOccupation: String,
  fatherDesignation: String,
  motherName: String,
  // motherDB: String,
  nativePlace: String,
  address: String,
  city: String,
  pin: Number,
  whatsapp: Number,
  // residence: String,
  nri: String,
  remarks: String,
  password: String,
  photo: String,
  bioData: String,

status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("UserForm", userFormSchema);
