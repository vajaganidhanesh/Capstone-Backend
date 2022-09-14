const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    quality:{
        type:Number,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    picture:{
        type:String,
        default:"IMAGE",
        required:true
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"restaurantDetails"
    }

},{timestamps:true});

const itemModel = mongoose.model('items',itemSchema);

module.exports = itemModel