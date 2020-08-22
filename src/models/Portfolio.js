import { Schema, model } from "mongoose";

const ListSchema = new Schema({
  ticker_symbol_id: {
    type: Schema.ObjectId,
    ref: "Security",
  },
  average_buy: Number,
  number_of_shares: Number,
});
const PortfolioSchema = new Schema({
  portfolio: { type: String, required: true },
  security_list: [ListSchema],
});

export default model("Portfolio", PortfolioSchema);
