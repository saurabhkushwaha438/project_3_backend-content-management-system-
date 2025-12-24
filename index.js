import "dotenv/config"; 
import express from "express";

import mongodb from "./db/configDB.js";
import errorhandler from "./middleware/error.middleware.js"
import authRouter from "./router/auth.router.js";
import contentRouter from "./router/content.router.js";
import userRouter from "./router/user.router.js";
const app = express();
app.use(express.json());

app.get('/',(req,res)=>{    
    res.send('You are here means everything is working right')
})
app.use('/api/auth',authRouter);
app.use('/api/content',contentRouter);
app.use('/api/user',userRouter);
app.use(errorhandler);
const PORT = process.env.PORT||3000;
app.listen(PORT,async()=>{
    console.log(`server is listening at ${PORT}`);
    await mongodb();
})