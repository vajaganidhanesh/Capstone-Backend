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
  } else {
    res.status(401);
    throw new Error("Invalid user data");
  }
});

// @desc login user
// @route /user/login
// @access Public
const loginUser = AsyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await userModel.findOne({
    $or: [{ email: email }, { name: name }],
  });

  const compare = await bcrypt.compare(password, user.password);

  if (user && compare) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

// Generating new token
const generateToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: "3d",
  });
};

module.exports = {
  registerUser,
  loginUser,
};
