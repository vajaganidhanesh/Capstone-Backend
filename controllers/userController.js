const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

// @desc register a new user
// @route /user/signup
// @access Public
const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // find if user already exists
  const userExists = await userModel.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    mobile,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }
});

// Generating new token
const generateToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
};
