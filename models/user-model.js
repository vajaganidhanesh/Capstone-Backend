const mongoose = require("mongoose");

// moongose middle ware

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide details"],
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email Already Exist"],
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
