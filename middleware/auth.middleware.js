
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const authorization = async (req,res,next)=>{
    
    try{
        let token;

         if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(400).json({
                success:false,
                message:"user is not authorized , no token"
            });
        }
        const decoded = jwt.verify(token,process.env.TOKEN_KEY);
        
        
        
        const user = await User.findById(decoded.userId).select("-password");
        
        if(!user){
            return res.status(401).json({
                success:false,
                message:'Not authorized, not verified user'
            });
        }
        
        req.user = user;
        
        next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message:'Not authorized, invalid token'
        });
    }
}

export default authorization;