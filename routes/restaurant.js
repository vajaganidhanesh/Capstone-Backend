const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require ('jsonwebtoken')

// schemas for routes
const restaurantModel = require('../models/restaurant-model')
const userModel = require('../models/user-model');

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

                        res.status(200).send({success:true,message:"restaurant resgistered successfully",data})
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

router.post("/login",(req,res)=>{

    let userCred = req.body;

    restaurantModel.findOne({$or:[{email:userCred.email_user},{username:userCred.email_user}]})
    .then((user)=>{

        if(user!==null)
        {
            bcryptjs.compare(userCred.password,user.password,(err,result)=>{
                if(err===null || err===undefined)
                {
                    if(result===true)
                    {
                        jwt.sign(userCred,"secretkey",{expiresIn:"1d"},(err,token)=>{
 
                            if(err===null || err===undefined)
                            {
                                res.status(200).send({success:true,token:token,usermail:user.email,userid:user._id,username:user.username,profile_pic:user.profile_pic})
                            }
                        })
                    }
                    else
                    {
                        res.status(403).send({message:"Incorrect password",success:false})
                    }
                }

            })
        }
        else
        {
            res.status(404).send({message:"User not found"})
        }

    })
    .catch((err)=>{
        // console.log(err);
        res.status(503).send({success:false,message:"Someproblem while login in user"})
    })

})

module.exports=router;