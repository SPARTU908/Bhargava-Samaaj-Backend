const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  transaction: {
    type: String,
    required: true,
  },
  uploadForm:{
    type:String,
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
