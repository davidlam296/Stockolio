import React, { useState, useEffect, useContext } from 'react';
import { Purchase } from './Purchase';
import { formatTransactions } from '../../helper';
import AuthContext from '../context/AuthContext';
import '../styles/portfolio.css';

export const Portfolio = ({
  transactions,
  balance,
  updateTransactions,
  updateBalance,
}) => {
  // portData is the formatted data that would be displayed in the Portfolio component, based on transactions
  const [portData, setPortData] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  // update portfolio if transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      formatTransactions(transactions).then((portfolio) => {
        setPortData(portfolio);
      });
    }
  }, [transactions]);

  return (
    <div id="portfolio">
      <h1>Portfolio</h1>
      <div id="port-container">
        <div id="portfolio-stocks">
          {portData.stocks && !portData.error ? (
            portData.stocks.map((stock) => {
              return (
                <div
                  key={`${isLoggedIn.id}+${stock.symbol}`}
                  className="portfolio-stock"
                >
                  <p>{`${stock.symbol} - ${stock.quantity} shares`}</p>
                  <p>
                    <span
                      className={
                        stock.openValue === stock.currentValue
                          ? 'same-price'
                          : stock.openValue > stock.currentValue
                          ? 'lower-price'
                          : 'higher-price'
                      }
                    >
                      {`$${stock.currentValue}`}
                    </span>
                  </p>
                </div>
              );
            })
          ) : portData.stocks && portData.stocks.length < 1 ? (
            <p>{'No stocks found...'}</p>
          ) : (
            <p>{'Loading stocks...'}</p>
          )}
        </div>
        <Purchase
          balance={balance}
          updateTransactions={updateTransactions}
          updateBalance={updateBalance}
        />
      </div>
    </div>
  );
};
