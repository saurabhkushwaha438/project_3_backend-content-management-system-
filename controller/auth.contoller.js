import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next)=>{
    try{
        const {name,email,password,role}=req.body;
        const isPresent = await User.findOne({email});
        if(isPresent){
            const error = new Error("User already exists");
            error.statusCode = 400;
            throw error;
        }
        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const user = await User.create({name,email,password:hashedPassword,role});
        console.log(user);
        

        const token = jwt.sign({userId:user._id},process.env.TOKEN_KEY,{expiresIn:'1d'});

        const datawithoutpassword = {
              _id: user._id,
    name: user.name,
    email: user.email,
    date: user.date,
    role: user.role
        }
       
        res.status(201).json({
            success:true,
            message:"user registered successfully",
            data:{
                token,
                userdata:datawithoutpassword
            }
        })
    }catch(err){
        next(err);
    }
}

export const signin = async (req,res)=>{
    try{
        const{email,password}=req.body;
        const user = await User.findOne({email});
        if(!user){
            console.error("user didnt exits");
            error.statusCode(404);
            throw new Error("wrong credentials");
        }
        const isValidPassword =await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            error.statusCode(404);
            throw new Error("Invalid password");
        }
        const token = jwt.sign({userId:user._id},process.env.TOKEN_KEY,{expiresIn:"1d"});
         const datawithoutpassword = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role:user.role,
                date: user.date
        }
       
        res.status(201).json({
            success:true,
            message:"user signin successfully",
            data:{
                token,
                userdata:datawithoutpassword
            }
        })
    }catch(err){
        console.log(err);
    }
}