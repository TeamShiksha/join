const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('../models/user');

const   imageSchema = new mongoose.Schema({

    creator: {
        type: Schema.Types.ObjectId,
        ref: User,
      },

      imageId:{
        type:String,
        required:true,
      },
      imageName:{
        type:String,
        required:true
      },

      image: {
        type: String,
        required: false,
      },
})

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;