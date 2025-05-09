// server/models/image_store.js
import mongoose from 'mongoose';

const image_Sequence = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    seq : {
        type : Number,
        unique : true,
        default : 0
    }
});

const Sequence = mongoose.model('image_sequence', image_Sequence);

export default Sequence
