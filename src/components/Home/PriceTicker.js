import React, { useContext } from "react";
import { TickerTape } from "react-ts-tradingview-widgets";
import { GlobalContext } from "../../store/context";

const PriceTicker = () => {
  const { darkTheme } = useContext(GlobalContext);
  return  (
    <div className="price-cover">
      <div className="price-ticker">
        <TickerTape colorTheme={darkTheme === false ? "light" : "dark"}></TickerTape>
      </div>
    </div>
  );
};

export default PriceTicker;
