const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema( {

    email :{
        type:String,
        required:true,
        unique:false,
        trim:true,
        minlength:3
    },
    password:{
        type:String,
        required:true,
        minlength:4,
  

    },

})

const User = mongoose.model('User', UserSchema);

module.exports = User;
