import React, { useState, useEffect } from 'react';
import { Purchase } from './Purchase';
import { formatTransactions } from '../../helper';

export const Portfolio = ({ transactions, userInfo }) => {
  // portData is the formatted data that would be displayed in the Portfolio component, based on transactions
  const [portData, setPortData] = useState([]);

  // update portfolio if transactions change
  useEffect(() => {
    if (transactions.length > 0) setPortData(formatTransactions(transactions));
  }, [transactions]);

  return (
    <div id="portfolio">
      <h1>Portfolio</h1>
      <div id="port-container">
        <div>
          {portData.stocks
            ? portData.stocks.map((stock) => {
                return (
                  <div key={`${userInfo.id}+${stock.symbol}`}>
                    <p>{`${stock.symbol} - ${stock.quantity}`}</p>
                    <p>
                      $
                      <span
                        className={
                          stock.openValue > stock.currentValue
                            ? 'lower-price'
                            : 'higher-price'
                        }
                      >
                        {stock.currentValue}
                      </span>
                    </p>
                  </div>
                );
              })
            : null}
        </div>
        <Purchase />
      </div>
    </div>
  );
};
