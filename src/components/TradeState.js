import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { async } from "@firebase/util";
import { doc, updateDoc } from "firebase/firestore";
import db from "../store/server.config";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: "20px 10px",
    padding: "10px 30px",
    cursor: "pointer",
  },
}));

const TradeState = () => {
  const classes = useStyles();
  const [openLoading, setOpenLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const closeTradeState = async () => {
    setCloseLoading(true);
    const queryDoc = doc(db, "tradefunction", "trade_state");

    await updateDoc(queryDoc, {
      disabled: "disabled",
    }).then(() => {
      setCloseLoading(false);
    });
  };

  const openTradeState = async () => {
    setOpenLoading(true);
    const queryDoc = doc(db, "tradefunction", "trade_state");

    await updateDoc(queryDoc, {
      disabled: "active",
    }).then(() => {
      setOpenLoading(false);
    });
  };

  return (
    <div>
      <div>
        <button onClick={() => openTradeState()} className={classes.button}>
          {openLoading ? "Opening..." : "Open Trade"}
        </button>

        <button onClick={() => closeTradeState()} className={classes.button}>
          {closeLoading ? "Closing..." : "Close Trade"}
        </button>
      </div>
    </div>
  );
};

export default TradeState;
