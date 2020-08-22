import { Schema, model } from "mongoose";

const SecuritySchema = new Schema({
  ticker_symbol: { type: String, required: true, unique: true },
  security: { type: String, required: true },
  current_price: { type: Number, required: true },
});

export default model("Security", SecuritySchema);
