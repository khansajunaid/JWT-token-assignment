const mongoose = require("mongoose")

//Schema
const sch = {
    Name:String,
    Email:{ 
        type: String, 
        required: true, 
        unique: true
    },    
    MobileNo:Number,
    ID:Number,
    password:{
        type:String, required:true
    }
}

module.exports = mongoose.model("Users", sch);