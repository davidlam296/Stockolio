import { P } from '../database/dummy_data';

// Reference for transaction types -- only buying required currently
const TYPES_OF_TRANS = ['BUY', 'SELL'];

// Get current prices of stocks from API
const updatePrices = (portfolio) => {
  const stocks = [];

  // Access API to get stock information
  // const stocksToSearch = [];

  // for (const stock of portfolio.stocks.keys()) {
  //   stocksToSearch.push(stock);
  // }

  // Dummy data prices

  for (const stock of P) {
    const stockData = portfolio.stocks.get(stock.symbol);

    stockData.openValue = (stock.open * stockData.quantity).toFixed(2);
    stockData.currentValue = (stock.latest * stockData.quantity).toFixed(2);

    stocks.push(stockData);

    portfolio.total = (
      Number(portfolio.total) + Number(stockData.currentValue)
    ).toFixed(2);
  }

  portfolio.stocks = stocks;

  return portfolio;
};

export const formatTransactions = (transactions) => {
  /*
  Required Info:
  Total Value
  Ticker - # of Shares - Value of Stock
  */
  const portfolio = { total: 0, stocks: new Map() };

  for (const trans of transactions) {
    const symbol = trans.ticker_symbol;
    if (portfolio.stocks.has(symbol)) {
      portfolio.stocks.get(symbol).quantity +=
        trans.type === 0 ? trans.quantity : trans.quantity * -1;
    } else {
      portfolio.stocks.set(symbol, {
        symbol,
        quantity: trans.type === 0 ? trans.quantity : trans.quantity * -1,
      });
    }
  }

  portfolio.stocks.forEach((data, sym, stocks) => {
    if (data.quantity <= 0) stocks.delete(sym);
  });

  return updatePrices(portfolio);
};
