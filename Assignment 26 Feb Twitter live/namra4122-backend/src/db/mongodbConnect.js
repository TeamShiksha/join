import mongoose from 'mongoose';

const connectDB = async () =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

    }catch (error){
        console.error(`MongoDB connection FAILED: ${error}`);
        //Terminate all kind of process
        process.exit(1);
    }
}

export default connectDB;