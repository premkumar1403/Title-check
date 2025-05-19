const bcrypt= require("bcrypt");
const userModel=require("../model/user.model")
const cookieParser = require("cookieparser")

const User = {
    Signup: async (req,res) => {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            
            await userModel.createUser(
              username,
              email,
              hashedPassword
            );
            const token = await userModel.generateJWT(email, hashedPassword);
            res.cookie("token", token, { maxAge: 3600000,httpOnly:true});
            res.status(201).json({ data: token, message: "user created successfully!" });
        } catch (error) {
           res.status(400).json({message:"Email already taken or user entered invalid credentials!"})
        }
    },
    Signin: async(req,res) => {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        try { 
            const response = await userModel.signinUser(email, hashedPassword);
            if (!response) {
                res.status(400).json({ message: "Error in user login" })
            }
            const token=await userModel.generateJWT(email, hashedPassword);
            res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
            res.status(200).json({ data:token,message: "user logged in successfully!" })
            
        } catch (error) {
            res.status(400).json({message:"Error while user trying to login"})
        }
    },
    Signout: (req,res) => {
        res.cookie("token", " ", { httpOnly: true ,maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    }
}

module.exports= User;