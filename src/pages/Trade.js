import TradingViewWidget, { Themes, BarStyles } from "react-tradingview-widget";
import Footer from "../components/Home/Footer";
import TradeOptions from "../components/Home/TradeOptions";
import { GlobalContext } from "../store/context";
import { useContext } from "react";

const Trade = () => {
  const { darkTheme } = useContext(GlobalContext);
  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        background: darkTheme === false ? "#fff" : "#333",
      }}
    >
      <div style={{ height: 500 }}>
        <TradingViewWidget
          symbol="BTCUSDT"
          theme={darkTheme === false ? Themes.LIGHT : Themes.DARK}
          locale="en"
          autosize
          style={BarStyles.LINE}
          disabled_features={["header_widget", "left_toolbar"]}
          overrides={{ "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)" }}
        />
      </div>

      <div style={{ height: 350 }}>
        <TradeOptions />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Trade;
