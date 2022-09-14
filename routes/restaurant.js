const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require ('jsonwebtoken')

// schemas for routes
const restaurantModel = require('../models/restaurant-model')
const userModel = require('../models/user-model')

// for routing the components
const router = express.Router();

// endpoint for restaurants to get registeration into website

router.post('/signup',(req,res)=>{
    let restaurant = req.body;

    bcryptjs.genSalt(10,(err,salt)=>{

        if(err===null || err === undefined)
        {

            bcryptjs.hash(restaurant.password,salt,(err,encPass)=>{

                if(err===null || err === undefined)
                {

                    restaurant.password = encPass;

                    restaurantModel.create(restaurant)
                    .then((data)=>{

                        res.status(200).send({success:true,message:"restaurant resgistered successfully"})
                    })
                    .catch((err)=>{

                        if(err.code===11000){
                            res.status(409).send({success:false,message:"restaurant or Username already exits"})
                        }
                        else
                        {
                            res.status(400).send({success:false,message:err.errors.name.properties.message})
                        }
                    })

                }


            })
        }
    })
})