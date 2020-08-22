import Security from "../models/Security";
import Portfolio from "../models/Portfolio";

export const getTickerSymbolDetails = async (tickerSymbol) => {
  try {
    const result = await Security.find({ ticker_symbol: tickerSymbol });
    return result[0];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getTickerSymbolDetailsSet = async (ticker_symbol_id_set_only) => {
  try {
    const result = await Security.find({
      _id: { $in: ticker_symbol_id_set_only },
    });
    return result;
  } catch (error) {
    return error;
  }
};
export const getPortfolioDetails = async (portfolio_id) => {
  try {
    const result = await Portfolio.findById({ _id: portfolio_id });
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
