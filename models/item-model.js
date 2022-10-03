const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    quantity:{
        type:Number,
        required:true,
        default:1
    },

    price:{
        type:Number,
        required:true
    },

    description:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    picture:[String],
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"restaurantDetails"
    },
    fileType:{
        type:String,
        default:"IMAGE"
    }

},{timestamps:true});

const itemModel = mongoose.model('items',itemSchema);

module.exports = itemModel