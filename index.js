import express from "express";
import errorhandler from "./middleware/error.middleware.js"
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

app.get('/',(req,res)=>{    
    res.send('hello motherfucker')
})
app.use(errorhandler);
app.listen(process.env.PORT,()=>{
    console.log(`server is listening at ${process.env.PORT}`);
    
})