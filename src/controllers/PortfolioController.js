import Portfolio from "../models/Portfolio";
import mongoose from "mongoose";
import * as Util from "../utils/index";
export const addPortfolio = async (req, res) => {
  const { portfolio } = req.body;
  const security_list = [];
  const result = await Portfolio.create({
    portfolio,
    security_list,
  });
  res.json(result);
};

export const addTradeToPortfolio = async (req, res) => {
  try {
    // console.log(req.body);
    //TODO price change
    const { portfolio_id, ticker_symbol, buy_number_of_shares } = req.body;
    if (portfolio_id && ticker_symbol && buy_number_of_shares) {
      const ticker_symbol_details = await Util.getTickerSymbolDetails(
        ticker_symbol
      );
      const ticker_symbol_id = ticker_symbol_details._id;
      const current_price = ticker_symbol_details.current_price;
      //   console.log(ticker_symbol_id);
      //if ticker_symbol_id is in security list, update the numberof shares and average buy
      //else add new security
      const { security_list } = await Util.getPortfolioDetails(portfolio_id);
      let isSecurityAlreadyPresent = false;
      //   console.log(security_list);
      let i,
        len = security_list.length;
      for (i = 0; i < len; i++) {
        let obj = security_list[i];
        if (obj.ticker_symbol_id.equals(ticker_symbol_id)) {
          isSecurityAlreadyPresent = true;
          console.log("Security is Found in security list");
          //update number of shares
          const old_number_of_shares = security_list[i].number_of_shares;
          security_list[i].number_of_shares += buy_number_of_shares;
          //update avg buy
          security_list[i].average_buy =
            (security_list[i].average_buy * old_number_of_shares +
              parseFloat(current_price) * parseInt(buy_number_of_shares)) /
            security_list[i].number_of_shares;

          //update portfolio
          const result = await Portfolio.findOneAndUpdate(
            { _id: portfolio_id },
            {
              security_list,
            },
            { returnOriginal: false }
          );
          return res.send(result);
        }
      }
      if (!isSecurityAlreadyPresent) {
        let newSecurity = {
          ticker_symbol_id: ticker_symbol_id,
          number_of_shares: buy_number_of_shares,
          average_buy: current_price,
        };
        security_list.push(newSecurity);
        console.log(security_list);
        const result = await Portfolio.findByIdAndUpdate(
          portfolio_id,
          { security_list },
          { returnOriginal: false }
        );
        return res.send(result);
      }
    } else {
      res
        .status(400)
        .send({ error: "portfolio_id or ticker_symbol not provided" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const removeTradeFromPortfolio = async (req, res) => {
  //   console.log(req.body);
  //TODO price change
  const { portfolio_id, ticker_symbol } = req.body;
  if (portfolio_id && ticker_symbol) {
    const ticker_symbol_details = await Util.getTickerSymbolDetails(
      ticker_symbol
    );
    const ticker_symbol_id = ticker_symbol_details._id;
    // console.log(ticker_symbol_id);

    //TODO check for portfolio_id
    const { security_list } = await Util.getPortfolioDetails(portfolio_id);
    let isSecurityPresent = false;
    // console.log(security_list);
    let i,
      len = security_list.length;

    for (i = 0; i < len; i++) {
      let obj = security_list[i];
      if (obj.ticker_symbol_id.equals(ticker_symbol_id)) {
        isSecurityPresent = true;
        // console.log("Security is Found in security list");
      }
    }

    if (!isSecurityPresent) {
      return res.send({ error: "security not found in the profolio" });
    }
    const new_security_list = security_list.filter(
      (ele) => !ele.ticker_symbol_id.equals(ticker_symbol_id)
    );
    console.log(security_list);
    //update portfolio
    const result = await Portfolio.findOneAndUpdate(
      {
        _id: portfolio_id,
      },
      {
        security_list: new_security_list,
      },
      {
        returnOriginal: false,
      }
    );
    return res.send(result);
  } else {
    res
      .status(400)
      .send({ error: "portfolio_id or ticker_symbol not provided" });
  }
};

export const sellTradeFromPortfolio = async (req, res) => {
  try {
    // console.log(req.body);
    //TODO price change
    const { portfolio_id, ticker_symbol, sell_number_of_shares } = req.body;
    if (portfolio_id && ticker_symbol) {
      const ticker_symbol_details = await Util.getTickerSymbolDetails(
        ticker_symbol
      );
      const ticker_symbol_id = ticker_symbol_details._id;
      //   console.log(ticker_symbol_id);

      //TODO check for portfolio_id
      const { security_list } = await Util.getPortfolioDetails(portfolio_id);
      let isSecurityPresent = false;
      //   console.log(security_list);
      let i,
        len = security_list.length;

      for (i = 0; i < len; i++) {
        let obj = security_list[i];
        if (obj.ticker_symbol_id.equals(ticker_symbol_id)) {
          isSecurityPresent = true;
          // console.log("Security is Found in security list");
          const new_sell_number_of_shares = parseInt(sell_number_of_shares);
          const old_number_of_shares = security_list[i].number_of_shares;

          //@TODO if equal remove security
          if (old_number_of_shares > new_sell_number_of_shares) {
            //update number of shares
            security_list[i].number_of_shares -= new_sell_number_of_shares;
            //update avg buy will not be updated

            //update portfolio
            const result = await Portfolio.findOneAndUpdate(
              { _id: portfolio_id },
              {
                security_list,
              },
              { returnOriginal: false }
            );
            return res.send(result);
          }
          if (old_number_of_shares == new_sell_number_of_shares) {
            //remove the security
            const new_security_list = security_list.filter(
              (ele) => !ele.ticker_symbol_id.equals(ticker_symbol_id)
            );
            console.log(security_list);
            //update portfolio
            const result = await Portfolio.findOneAndUpdate(
              {
                _id: portfolio_id,
              },
              {
                security_list: new_security_list,
              },
              {
                returnOriginal: false,
              }
            );
            return res.send(result);
          } else {
            return res.status(400).send({
              error:
                "number of  sell_number_of_shares should be greater or equal",
            });
          }
        }
      }
      if (!isSecurityPresent) {
        return res.send({
          error: "security not found in the profolio",
        });
      }
    } else {
      return res
        .status(400)
        .send({ error: "portfolio_id or ticker_symbol not provided" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const getAllPortfolio = async (req, res) => {
  try {
    const result = await Portfolio.find({});
    res.json(result);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
export const getPortfolioDetails = async (req, res) => {
  try {
    const portfolio_id = req.params.portfolio_id;
    console.log(portfolio_id);
    const result = await Portfolio.find({ _id: portfolio_id });
    res.json(result);
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
export const deletePortfolioById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) res.status(400).send({ error: "Id is not provided" });
    else {
      const result = await Portfolio.findByIdAndDelete({ _id: id });
      res.json(result);
    }
  } catch (error) {
    res.send(error);
  }
};

export const getReturnsPortfolio = async (req, res) => {
  const { portfolio_id } = req.body;
  //TODO check for portfolio id
  try {
    if (portfolio_id) {
      const { security_list } = await Util.getPortfolioDetails(portfolio_id);
      let returns = 0,
        i;
      //TODO:  GET current price of security
      const current_price = 100; // given in assignment
      for (i = 0; i < security_list.length; i++) {
        const average_buy = security_list[i].average_buy;
        const number_of_shares = security_list[i].number_of_shares;
        returns += (current_price - average_buy) * number_of_shares;
      }

      res.send({ returns: returns });
    } else {
      res.status(400).send({ error: "portfolio_id is not given" });
    }
  } catch (error) {
    res.send({ error: error });
  }
};
