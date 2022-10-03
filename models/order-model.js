const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    item:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"items",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }


},{timestamps:true})

const orderModel = mongoose.model('orders',orderSchema)
module.exports = orderModel;