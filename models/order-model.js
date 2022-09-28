const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    orderItems:[
        {
            item:{ 
                type:mongoose.Schema.Types.ObjectId,
                ref:"items",
                required:true
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true
            },
            restaurant:{ 
                type:mongoose.Schema.Types.ObjectId,
                ref:"restaurantDetails",
                required:true
            },
        }
    ]


},{timestamps:true})

const orderModel = mongoose.model('order',orderSchema)
module.exports = orderModel;