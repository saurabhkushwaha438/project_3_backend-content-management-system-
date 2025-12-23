import mongoose from "mongoose";


const mongodb = async ()=>{
    try{
        if(!process.env.DATABASE_URL){
    console.log("not getting db url from env");
     process.exit(1);
}
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("mongodb connected");
    }catch(err){
        console.log("mongodb connection failed");
        console.log(err);
        process.exit(1);
    }
}

export default mongodb;