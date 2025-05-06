const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB  =require('./db/connect');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');


const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: "*",
    methods: "GET,POST",
  }));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/v1/auth", authRoutes);
app.use("/v1/api",imageRoutes);
app.use('/', (req,res)=> {
    res.send("Welcome to Upload photos");
})



const start = async()=> {

    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(port, ()=> {
            console.log(`server is listening on port ${port}` );
        })
    } catch (error) {
        console.log(error);
    }
}
  
start();
