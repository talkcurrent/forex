import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { GlobalContext } from "../../../store/context";

const useStyles = makeStyles({
  coinContainer: {
    display: "flex",
    justifyContent: "center",
    width: "70%",
    margin: "0px auto",
    padding: 10,
  },
  coinContainerSmall: {
    display: "flex",
    justifyContent: "center",
    margin: "0px auto",
    padding: "10px 1rem ",
  },
  coinRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  coin: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "1rem", 
    flex: "1",
  },
  coinData: {
    flex: "1",
    justifyContent: "flex-end",
    display:"flex",
  },

  symbol: {
    textTransform: "uppercase",
    marginTop: -20,
    textAlign: "left",
  },
  coinPrice: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight:"400",
  },
  coinPriceMob: {
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "300",
  },
  absoCover: {
    width: "100%;",
    height: "20px",
    position: "absolute",
    background: "#fff",
    top: "20rem",
    zIndex: 100,
  },
});

const Coin = ({ image, name, symbol, price, price_change_percentage }) => {
  const classes = useStyles();
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const { darkTheme } = useContext(GlobalContext);

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    //conole.log(windowDimenion);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  return (
    <>
      {windowDimenion.winWidth < 768 ? (
        <>
          <div className={classes.coinContainerSmall}>
            {/* <div className={classes.absoCover}></div> */}
            <div className={classes.coinRow}>
              <div className={classes.coin}>
                <img
                  src={image}
                  alt={name}
                  style={{ width: 30, height: 30}}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "8rem",
                    gap:".8rem",
                  }}
                >
                  <h3 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                    {name}
                  </h3>
                  <p
                    className={classes.symbol}
                    style={{
                      fontSize: 10,
                      color: darkTheme === false ? "#A1A1A1" : "#fff",
                    }}
                  >
                    {symbol}/usdt
                  </p>
                </div>
              </div>

              <div
                style={{
                  width: "5rem",
                  display: "flex",
                  flex: "1",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  marginRight: "1rem",
                }}
              >
                <p
                  className={classes.coinPriceMob}
                  style={{ color: darkTheme === false ? "#555" : "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  ${price}
                </p>
              </div>

              <div className={classes.coinData}>
                <p
                  style={{
                    background:
                      price_change_percentage.toString().charAt(0) === "-"
                        ? "#DC0B0B"
                        : "#32E038",
                    color: "white",
                    padding: "5px",
                    borderRadius: 4,
                    maxWidth: "2rem",
                    minWidth: "3rem",
                    fontSize:"12px"
                  }}
                >
                  {price_change_percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          {/* <hr style={{ marginTop: " .5rem" }} /> */}
        
        </>
      ) : (
        <>
          <div className={classes.coinContainer}>
            <div className={classes.coinRow}>
              <div className={classes.coin}>
                <img src={image} alt={name} style={{ width: 50, height: 50}} />
                <div style={{ display:"flex", flexDirection:"column", textAlign:"left", alignItems:"flex-start", }}>
                  <h1 style={{fontSize:"22px", marginBottom:"-.2rem"}}>{name}</h1>
                  <p style={{ fontSize: "14px", color:"#A1A1A1" }}>{symbol.toString().toUpperCase()}/usdt</p>
                </div>
              </div>

              <div style={{flex:"1", display:"flex", justifyContent:"center"}}>
                <p className={classes.coinPrice}>${price}</p>
              </div>

              <div className={classes.coinData}>
                <p
                  style={{
                    background:
                      price_change_percentage.toString().charAt(0) === "-"
                        ? "#DC0B0B"
                        : "#32E038",
                    color: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    width: "64px",
                    height:"38px",
                  }}
                >
                  {price_change_percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* <div
            style={{
              width: "70%",
              height: "1px",
              background: "#ddd",
              margin: "0px auto",
            }}
          /> */}
        </>
      )}
    </>
  );
};

export default Coin;
