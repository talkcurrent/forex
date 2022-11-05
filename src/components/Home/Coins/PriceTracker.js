import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Coin from "./Coin";
import { GlobalContext } from "../../../store/context";

const PriceTracker = () => {
  const [coins, setCoins] = useState([]);
  const { darkTheme } = useContext(GlobalContext);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        )
        .then((res) => {
          setCoins(res.data);
          // console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, 3000);
  }, []);

  return (
    <div style={{ marginBottom: 85, background: darkTheme === false ? "#fff" : "#333" }}>
      {coins.length > 0 &&
        coins.map((coin) => (
          <div key={coin.id}>
            <Coin
              name={coin.name}
              symbol={coin.symbol}
              price={coin.current_price}
              image={coin.image}
              price_change_percentage={coin.price_change_percentage_24h}
            />
          </div>
        ))}
    </div>
  );
};

export default PriceTracker;
