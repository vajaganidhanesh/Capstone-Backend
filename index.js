const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

app.listen(8000,()=>{
    console.log("server is running and up");
})