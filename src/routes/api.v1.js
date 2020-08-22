import express from "express";
import * as securityController from "../controllers/SecurityController";
import * as portfolioController from "../controllers/PortfolioController";
const router = express.Router();

/*
@Route /api/v1/
@METHOD GET
@DESC 
*/
router.get("/", (req, res) => {
  res.send("API Version 1");
});

/*
 ********* START OF SECURITY ROUTE **********
 */

/*
@Route /api/v1/security
@METHOD POST
@DESC Add a security
@BODY security, ticker_symbol, current_price
*/
router.post("/security", securityController.addSecurity);
/*
@Route /api/v1/security
@METHOD DELETE
@DESC delete a security
@BODY id
*/
router.delete("/security", securityController.deleteSecurity);
/*
@Route /api/v1/security
@METHOD PATCH
@DESC Update a security current price
@BODY id, updated_current_price
*/
router.patch("/security", securityController.updateSecurity);

/*
@Route /api/v1/security
@METHOD GET
@DESC Get all securities
@BODY ticker_symbol set (OPTIONAL)
*/
router.get("/security", securityController.getSecurity);

/*
 ********* END OF SECURITY ROUTE **********
 */

/*
 ********* START OF PORTFOLIO ROUTE **********
 */

/*
@Route /api/v1/portfolio
@METHOD GET
@DESC Get all portfolios
*/
router.get("/portfolio", portfolioController.getAllPortfolio);
/*
@Route /api/v1/portfolio/{portfolio_id}
@METHOD GET
@DESC Get portfolio details 
@PARAM  portfolio_id
*/
router.get("/portfolio/:portfolio_id", portfolioController.getPortfolioDetails);
/*
@Route /api/v1/portfolio
@METHOD POST
@DESC Add a portfolio
@BODY portfolio, ticker_symbol_id_set 
*/
router.post("/portfolio", portfolioController.addPortfolio);

/*
@Route /api/v1/portfolio
@METHOD POST
@DESC Add a trade to portfolio
@BODY portfolio_id, ticker_symbol
*/
router.post("/portfolio/trade", portfolioController.addTradeToPortfolio);

/*
@Route /api/v1/portfolio
@METHOD PATCH
@DESC Sell trade to portfolio
@BODY portfolio_id, ticker_symbol, number of shares
*/
router.patch("/portfolio/trade", portfolioController.sellTradeFromPortfolio);
/*
@Route /api/v1/portfolio
@METHOD DELETE
@DESC Remove a trade to portfolio
@BODY portfolio_id, ticker_symbol
*/
router.delete("/portfolio/trade", portfolioController.removeTradeFromPortfolio);
/*
@Route /api/v1/portfolio
@METHOD DELETE
@DESC Delete a portfolio
*/
router.delete("/portfolio", portfolioController.deletePortfolioById);

/*
@Route /api/v1/portfolio/returns
@METHOD DELETE
@DESC get returns of a portfolio
@BODY portfolio_id
*/
router.post("/portfolio/returns", portfolioController.getReturnsPortfolio);
/*
 ********* END OF PORTFOLIO ROUTE **********
 */

export default router;
