const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// customized components routing components

const restaurantRoutor = require('./routes/restaurant');


// creating connection between mongodb and api
mongoose.connect("mongodb://localhost:27017/capstone")
.then(()=>{
    console.log("connection successfull");
})

// creating APIs using express
const app = express();

// middleware packages
app.use(express.json());
app.use(cors())

// routing setup
app.use('/restaurant',restaurantRoutor)

app.listen(8000,()=>{
    console.log("server is running and up");
})