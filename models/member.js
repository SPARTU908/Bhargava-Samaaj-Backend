const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
        },
    spouse:{
        type:String,
    },
    dob:{
        type:Date,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    signature:{
        type:String,
        required:true
    },
    spouseSignature:{
        type:String,
        required:true,
    },
    fatherName:{
        type:String,
        validate: {
            validator: function (value) {
                return value || this.husbandName;
            },
            message: 'Either fatherName or husbandName is required.'
        }
        
    },
    husbandName:{
        type:String,
    },
    mobile:{
        type:String,
        required:true,
    },
    spouseMobile:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    spouseEmail:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    spousePhoto:{
        type:String,
    },
    gotra:{
        type:String,
        required:true,
    },
    kuldevi:{
        type:String,
        required:true,
    },
    occupation:{
        type:String,
        required:true,
    },

},{ timestamps: true });

module.exports = mongoose.model("Members",memberSchema);