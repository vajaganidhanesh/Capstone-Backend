const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    address:{
        type:String
    },
    itemsCount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'cart'
    }


},{timestamps:true})

const orderModel = mongoose.model('order',orderSchema)
module.exports = orderModel;