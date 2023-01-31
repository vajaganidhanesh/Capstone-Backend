const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerUser } = require("../controllers/userController");
const userModel = require("../models/user-model");

//for routing setup
const router = express.Router();

// endpoint to users for registeration
// router.post("/signup",(req,res)=>{
//     let user = req.body;

//     bcryptjs.genSalt(10,(err,salt)=>{

//         if(err===null || err ===undefined)
//         {
//             bcryptjs.hash(user.password,salt,(err,encPass)=>{
//                 if(err===null || err ===undefined)
//                 {
//                     user.password=encPass;

//                     userModel.create(user)
//                     .then((data)=>{
//                         res.status(200).send({success:true,message:"user registered successfully"})
//                     })
//                     .catch((err)=>{
//                         if(err.code===11000){
//                             res.status(409).send({success:false,message:"user or Username already exits"})
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
router.post("/");

router.post("/login", (req, res) => {
  let userCred = req.body;
  console.log(userCred);

  userModel
    .findOne({ $or: [{ email: userCred.email }, { name: userCred.name }] })
    .then((user) => {
      if (user !== null) {
        bcryptjs.compare(userCred.password, user.password, (err, result) => {
          if (err === null || err === undefined) {
            if (result === true) {
              jwt.sign(
                userCred,
                "secretkey",
                { expiresIn: "1d" },
                (err, token) => {
                  if (err === null || err === undefined) {
                    res
                      .status(200)
                      .send({
                        success: true,
                        token: token,
                        usermail: user.email,
                        userid: user._id,
                        username: user.name,
                        profile_pic: user.profile_pic,
                      });
                  }
                }
              );
            } else {
              res
                .status(403)
                .send({ message: "Incorrect password", success: false });
            }
          }
        });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(503)
        .send({ success: false, message: "Someproblem while login in user" });
    });
});

module.exports = router;
