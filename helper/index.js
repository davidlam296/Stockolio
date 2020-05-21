import axios from 'axios';

// Reference for transaction types -- only buying required currently
const TYPES_OF_TRANS = ['BUY'];

// Get current stock data from IEX API and return promise.
const updatePrices = (portfolio) => {
  const stocksToSearch = [...portfolio.stocks.keys()];
  return axios
    .get('/api/prices', { params: { stocks: stocksToSearch } })
    .then((result) => {
      const stocks = [];
      for (const stock of result.data) {
        const stockData = portfolio.stocks.get(stock.symbol);

        // Using previous close price; free, sandbox API doesn't provide open price for all stocks
        stockData.openValue = (
          stock.previousClose * stockData.quantity
        ).toFixed(2);
        stockData.currentValue = (
          stock.latestPrice * stockData.quantity
        ).toFixed(2);

        stocks.push(stockData);

        portfolio.total = (
          Number(portfolio.total) + Number(stockData.currentValue)
        ).toFixed(2);
      }
      portfolio.stocks = stocks;
    })
    .catch((err) => {
      portfolio.error = true;
    })
    .then(() => portfolio);
};

// Format transaction data and get total number of stocks user owns before getting stock data.

/*  Required Info:
      Total Value of Stocks, 
      [{ Ticker Symbol, # of Shares, Current Value, Open Price Value }, ...]  */
export const formatTransactions = (transactions) => {
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
