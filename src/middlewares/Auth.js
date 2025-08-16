import JWT from 'jsonwebtoken';
import User from '../models/User.js';

// //Product routes based on token

// export const requireSignIn = async (req, res, next) => {
//     try{
//         const decode=jwt.verify(req.headers.authorization,
//             process.env.JWT_SECRET );
//         req.user=decode;
//         next();
//     }
//       catch (error){
//         console.log(error);
//       }
//     }; 
  export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
   // console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      return res
        .status(401)
        .send({ success: false, message: "Authorization header is missing" });
    }

    // Support for both "Bearer <token>" and token without "Bearer" prefix
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    if (!token) {
      return res
        .status(401)
        .send({ success: false, message: "No token provided" });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    // JWT OR jwt 
    // console.log("Decoded Token Object:", decode);

    if (!decode._id && !decode.id) {
      return res
        .status(401)
        .send({ success: false, message: "Token does not contain user ID" });
    }

    req.user = decode;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

    //Admin Middleware
export const isAdmin = async (req, res, next) => {
    try {
        const userId= req.user.id || req.user.id;
        // console.log("user id from token : " , userId);
        if (!userId){
            return res.status(401)
            .send({success:false, message:"No user if found in token"});
        }
     
         const user=await User.findById(userId);
         if(!user){
            return res.status(404)
            .send({success:false, message:"User not found in databse"});

         }
        //  console.log("user from db:" , user);

        if (user?.role !== 'admin') {
            return res.status(401).send( {
                success:false,
                message:"unauthorized access",
            });
        }
        // else {
            next();
        // }
      
    } catch (error) {
        console.error("Error in admin middleware: " , error);
        res.status(401).send({
            success:false,
            message:"Error in admin middleware",
        });
        // res.status(500).json({ message: 'Server error' });
    }
}