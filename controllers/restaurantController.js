const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const restaurantModel = require("../models/restaurant-model");
const { generateToken } = require("./userController");

// @desc register a new admin
// @route /admin/signup
// @access Public
const registerAdmin = AsyncHandler(async (req, res) => {
  const { name, email, password, mobile, opentime, closetime, address } =
    req.body;
  if (
    !name ||
    !email ||
    !password ||
    !mobile ||
    !opentime ||
    !closetime ||
    !address
  ) {
    res.status(400);
  }

  //   find if admin already exists
  const adminExists = await restaurantModel.findOne({ email: email });
  if (adminExists) {
    res.status(400);
    throw new Error("admin already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //   create admin
  const admin = await restaurantModel.create({
    name,
    email,
    password: hashedPassword,
    mobile,
    address,
    opening_time: opentime,
    close_time: closetime,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid admin data");
  }
});

// @desc login admin
// @route /user/signup
// @access Public
const loginAdmin = AsyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const admin = await restaurantModel.findOne({
    $or: [{ email: email }, { name: name }],
  });

  const compare = await bcrypt.compare(password, admin.password);

  if (admin && compare) {
    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

module.exports = {
  registerAdmin,
  loginAdmin,
};
