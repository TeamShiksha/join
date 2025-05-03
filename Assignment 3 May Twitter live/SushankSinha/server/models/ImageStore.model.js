import mongoose from 'mongoose';

const imageSubSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String },
    data: { type: Buffer, required: true },
    contentType: {type: String,
        default : 'image/png'
    },
    isConverted : {type: Boolean, default : false},
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const imageSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    images: [imageSubSchema]
});

const ImageStore = mongoose.model('ImageStore', imageSchema);

export default ImageStore;
