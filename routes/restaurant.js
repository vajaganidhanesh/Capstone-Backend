const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require ('jsonwebtoken')

// schemas for routes
const restaurantModel = require('../models/restaurant-model')
const userModel = require('../models/user-model')

// for routing the components
const router = express.Router();