import userModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerController = async (req,res) => {

    try{
        const { name, email, password } = req.body;
        if ( !email || !password) {
            return res.status(400).json({ 
                error: "All fields are required" });
        };

        const user = await userModel.findOne({ email }); 
        if (user) {
            return res.status(400).json({ 
                error: "User already exists" });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);



        const newUser = await userModel({
            name,
            email,
            password : hashedPassword,
        }).save();

        // Save the user to the database
        // await newUser.save();

        return res.status(200).send({
            success: true,
            message: "User registered successfully",
            // user: newUser
        })

    }

    catch (error) {
        console.error("Error in registerController:", error);
       return res.status(500).send({ 
        success: false,
        message: "Problem in register API" ,
    });
    }

};

export const loginController = async (req, res) => {

    try{
        const { email, password } = req.body;
        if ( !email || !password) {
            return res.status(400).json({ 
                error: "All fields are required" });
        };

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                error: "Invalid user details" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                error: "Invalid credentials " });
        }


        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });



        return res.status(200).send({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                _id: user._id,
                name:user.name,
                email: user.email,
                role: user.role,
            }
        });


    } catch (error) {
        console.error("Error in loginController:", error);
        return res.status(500).send({ 
            success: false,
            message: "Problem in login API" ,
        });
      
    }  


    }; 