import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//api handling limit
app.use(express.json({
    limit: `16kb`
}));

//url-encoder %20 wagera encode karne ke liye
app.use(express.urlencoded({
    extended:true,limit:`16kb`
}));

//Route declaration
app.get('/',(req,res)=>{
    res.send("<h1>WELCOME TO TEAM.SHIKSHA ASSIGNMENT</h1>")
});

import apiRoute from "./routes/apiRoute.js"

app.use('/api/',apiRoute);

export { app }