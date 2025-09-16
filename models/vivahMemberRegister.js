const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
name:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true,
},
phone:{
    type:String,
    required:true,
},
membershipno:{
    type:String,
    required:true
},
gender:{
    type:String,
    required:true,
},
city:{
    type:String,
    required:true,
},
gotra:{
    type:String,
    required:true,
},
kuldevi:{
    type:String,
    required:true,

},
password:{
    type:String,
    required:true,
},
confirmpassword:{
    type:String,
    required:true,
},


},{ timestamps: true });

module.exports = mongoose.model("VivahMember", registerSchema);