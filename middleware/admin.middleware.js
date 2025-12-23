const adminOnly = (req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(403).json({
            success:false,
            message:"admin are allowed only"
        })
    }
    next();
}

export default adminOnly;