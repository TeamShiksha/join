import dotenv from "dotenv";
import connectDB from "./db/mongodbConnect.js";
import { app } from "./app.js";

dotenv.config({
    path:"./.env",
})

const dbConnect = () =>{
    connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 4123, () =>{
            console.log(`Server listening`)
        })
    })
    .catch((err)=>{
        console.error(`MongoDB connection Failed. Retrying in 3 seconds...: ${err}`);
        setTimeout(dbConnect, 3000);
    })
}

dbConnect();