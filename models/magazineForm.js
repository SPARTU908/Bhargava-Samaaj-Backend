const mongoose = require("mongoose");

const magazineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  email:{
    type:String,
    required:true,
  },
  signature:{
    type:String,
    required:true,
  },
  transactionId:{
    type:String,
    required:true,
  }
});

module.exports = mongoose.model("Magazine", magazineSchema);
