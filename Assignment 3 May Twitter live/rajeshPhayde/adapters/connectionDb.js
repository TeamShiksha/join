import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DEV_MONGOURL)
  .then(() => {
    console.log("Mongodb Connected SuccessFully");
  })
  .catch((err) => {
    console.log(err);
  });
