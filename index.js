const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// customized components routing components
const restaurantRoutor = require('./routes/restaurant');
const userRouter = require('./routes/user')
const itemModel = require('./routes/items')

require('dotenv').config();

// creating connection between mongodb and api
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("connection successfull");
})

// creating APIs using express
const app = express();

// middleware packages
app.use(express.json());
app.use(cors())

// accessing server side files for client side use...
app.use('/pics',express.static('./foodposts'))

// routing setup
app.use('/restaurant',restaurantRoutor);
app.use('/user',userRouter);
app.use('/items',itemModel)

app.listen(process.env.PORT || 8000,()=>{
    console.log("server is running and up");
})