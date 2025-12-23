import dotenv from "dotenv";
dotenv.config();
import express from "express";

import mongodb from "./db/configDB.js";
import errorhandler from "./middleware/error.middleware.js"
import authRouter from "./router/auth.router.js";
import contentRouter from "./router/content.router.js";
import userRouter from "./router/user.router.js";
const app = express();
app.use(express.json());

app.get('/',(req,res)=>{    
    res.send('hello motherfucker')
})
app.use('/api/auth',authRouter);
app.use('/api/content',contentRouter);
app.use('/api/user',userRouter);
app.use(errorhandler);
app.listen(process.env.PORT,async()=>{
    console.log(`server is listening at ${process.env.PORT}`);
    await mongodb();
})