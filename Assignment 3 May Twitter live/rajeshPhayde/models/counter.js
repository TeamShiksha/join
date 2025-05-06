import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
