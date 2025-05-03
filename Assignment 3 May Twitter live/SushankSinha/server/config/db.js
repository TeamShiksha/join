import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongo_uri = process.env.MONGO_URI

export function DB_Connection(){
    mongoose.connect(mongo_uri).then(()=>console.log("DB Connected")).catch((err)=>(console.log(err)))
};
