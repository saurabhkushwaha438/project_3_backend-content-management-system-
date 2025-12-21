const errorhandler = (error,req,res,next)=>{
      console.log(error.stack);
      res.status(error.statusCode||500).json({
        success:false,
        message:error.message || "Internal Server Error"
      })
      
}
export default errorhandler;