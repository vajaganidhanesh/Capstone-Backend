const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    itemDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'restaurantDetails'
    },
    quantity:{
        type:Number,
        required:true
    }


},{timestamps:true})

const cartModel = mongoose.model('cart',cartSchema)
module.exports = cartModel;