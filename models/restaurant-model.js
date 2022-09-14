const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
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
    },
    address:{
        type:String,
        required:true
    },
    opening_time:{
        type:Number,
        reuired:true
    },
    closing_time:{
        type:String,
        required:true
    }

},{timestamps:true})

const restaurantModel = mongoose.model("restaurantDetails",restaurantSchema);

module.exports=restaurantModel;

