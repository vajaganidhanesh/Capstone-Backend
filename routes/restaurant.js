const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  restaurantList,
} = require("../controllers/restaurantController");

// for routing the components
const router = express.Router();

// endpoint for restaurants to get registeration into website
router
  .post("/signup", registerAdmin)
  .post("/login", loginAdmin)
  .get("/allrestaurant", restaurantList);
// router.post('/signup',(req,res)=>{

//     let restaurant = req.body;
//     bcryptjs.genSalt(10,(err,salt)=>{

//         if(err===null || err === undefined)
//         {

//             bcryptjs.hash(restaurant.password,salt,(err,encPass)=>{

//                 if(err===null || err === undefined)
//                 {

//                     restaurant.password = encPass;
//             // async await need
//                     restaurantModel.create(restaurant)
//                     .then((data)=>{

//                         res.status(200).send({success:true,message:"restaurant resgistered successfully",data})
//                     })
//                     .catch((err)=>{

//                         if(err.code===11000){
//                             res.status(409).send({success:false,message:"restaurant or Username already exits"})
//                         }
//                         else
//                         {
//                             res.status(400).send({success:false,message:err.errors.name.properties.message})
//                         }
//                     })

//                 }
//             })
//         }
//     })
// })

// router.post("/login",(req,res)=>{

//     let restaurantCred = req.body;

//     restaurantModel.findOne({$or:[{email:restaurantCred.email},{name:restaurantCred.name}]})
//     .then((user)=>{

//         if(user!==null)
//         {
//             bcryptjs.compare(restaurantCred.password,user.password,(err,result)=>{
//                 if(err===null || err===undefined)
//                 {
//                     if(result===true)
//                     {
//                         jwt.sign(restaurantCred,"secretkey",{expiresIn:"1d"},(err,token)=>{

//                             if(err===null || err===undefined)
//                             {
//                                 res.status(200).send({success:true,token:token,usermail:user.email,userid:user._id,username:user.name,profile_pic:user.profile_pic,useraddress:user.address,timingam:user.opening_time,timingpm:user.closing_time})
//                             }
//                         })
//                     }
//                     else
//                     {
//                         res.status(403).send({message:"Incorrect password",success:false})
//                     }
//                 }

//             })
//         }
//         else
//         {
//             res.status(404).send({message:"User not found"})
//         }

//     })
//     .catch((err)=>{
//         console.log(err);
//         res.status(503).send({success:false,message:"Someproblem while login in user"})
//     })

// })

// user body(restaurants) should be in limit and sorted manner

// router.get("/allrestaurant",(req,res)=>{
//     restaurantModel.find()
//     .exec((err,data)=>{
//         if(err)
//         {
//           res.send({message:"unable to get"})
//         }

//         if(data)
//         {
//             res.send({success:true,data})
//         }
//     })
// })

module.exports = router;
