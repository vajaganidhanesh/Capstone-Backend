const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("./models/user-model");

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, "secret");

      // Get user from token
      req.user = await userModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized");
  }
});

module.exports = {
  verifyToken,
};
// module.exports =function verifyToken(req,res,next){

//     if(req.headers.authorization!==undefined)
//     {

//         let token = req.headers.authorization.split(" ")[1];

//         jwt.verify(token,"secretkey",(err,data)=>{
//             console.log(data);

//             if(err===null)
//             {
//                 next();
//             }
//             else
//             {
//                 res.send({message:"invalid token please login again"});
//             }
//         })
//     }
//     else
//     {

//         res.send({message:"please provide headers token"});

//     }

// }
