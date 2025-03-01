
const express = require('express');
const router = require('./routes/book');
const app = express();

app.use(express.json());

app.use('/book', router)

app.listen(3000, ()=>{
    console.log("Server listen at port no. 3000")
})
