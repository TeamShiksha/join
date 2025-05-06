const mongoose = require('mongoose');

const connectDB = (url)=> {
    return mongoose.connect(url, {
        dbName: 'Photoupload'
    })
}

module.exports =  connectDB;