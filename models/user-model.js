const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is mandatory"]
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email Already Exist"]
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


const userModel = mongoose.model("users",userSchema);

module.exports = userModel;