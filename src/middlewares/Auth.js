import jwt from 'jsonwebtoken';
import User from '../models/User';

//Product routes based on token

export const requireSignIn = async (req, res, next) => {
    try{
        const decode=jwt.verify(req.headers.authorization,
            process.env.JWT_SECRET );
        req.user=decode;
        next();
    }
      catch (error){
        console.log(error);
      }
    }; 

    //Admin Middleware
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(401).send( "Unauthorized" );
        }
        else {
            next();
        }
      
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Server error' });
    }
}