const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    cartItems:[
        {
            item:{ 
                type:mongoose.Schema.Types.ObjectId,
                ref:"restaurantDetails",
                required:true
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true
            }
        }
    ]
    


},{timestamps:true})

const cartModel = mongoose.model('cart',cartSchema)
module.exports = cartModel;