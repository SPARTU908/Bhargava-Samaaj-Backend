const mongoose = require('mongoose');

const awardForm = new mongoose.Schema({
    code1:{
        type:String,
       required:true
    },
    code2:{
        type:String,
        
     },
    code3:{
        type:String,
       
     },
    name:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pin:{
        type:String,
        required:true
    },
    academicQualification:{
        type:String,
        required:true
    },
    occupation:{
        type:String,
       
    },
    father:{
        type:String,
        required:true
    },
    mother:{
        type:String,
        required:true
    },
    spouse:{
        type:String,
     },
     spousedob:{
         type:Date,
     },
     spouseOccupation:{
        type:String,
     },
    photo:{
        type:String,
        required:true
    },
    document1:{
        type:String,
       required:true
    },
    document2:{
        type:String,
       
    },
    proposerName:{
        type:String,
    },
    proposerEmail:{
        type:String,
    },
    proposerMobile:{
        type:String
    },
    proposerAddress:{
        type:String
    },

},{ timestamps: true });

module.exports = mongoose.model('AwardForm', awardForm);

