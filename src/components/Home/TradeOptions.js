import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  updateDoc,
} from "firebase/firestore";
import Moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  MdOutlineTimer,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { BsFillInfoCircleFill, BsBackspace } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import pana from "../../assets/pana.png";
import { GlobalContext } from "../../store/context";
import db, { auth } from "../../store/server.config";
import "./tradeOptions.css";

import axios from "axios";
import Footer from "./Footer";
import FullDateTime from "../../sirB/reuseables/FullDateTime";
import RandomStr from "../../sirB/reuseables/RandomStr";
import CollectionRef from "../../sirB/reuseables/CollectionRef";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

const primaryColor = "#F0B90B";
const primaryColorDark = "#393091";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF";
const textInput = "#E4E2F1";
const textInputDark = "#3d3d3d";
const subTexts = "#D3CFE2";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "92%",
    height: "50px",
    fontFamily: "Poppins, sans-serif",
    lineHeight: "1.5rem",
    // background: primaryColor,
    margin: "2rem auto",
    padding: "0 0 5rem 0",
    "& button": {
      fontFamily: "Poppins, sans-serif",
    },
  },

  balance: {
    display: "flex",
    gap: "5px",
    color: "#666666",
  },

  balDiv: {
    background: "none",
    border: "1px #B4AAF9 solid",
    borderRadius: "10px",
    margin: "1rem auto",
    color: "#aaa",
    display: "flex",
    padding: "10px",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "500px",
    width: "100%",
  },

  balLeft: {
    width: "40%",
    display: "flex",
    gap: "5px",
    // background: "#Ff7200",
    // padding: "10px",
    alignItems: "start",
    fontSize: "16px",
  },
  balValue: {
    color: "#333",
  },

  balRight: {
    display: "flex",
    alignItems: "center",
    width: "60%",
    borderRadius: "6px",
    overflow: "hidden",
    justifyContent: "space-between",
    padding: "0 10px 0 0",
  },
  divBig: {
    height: "200px",
    // background: "#ff7200",
    paddingBottom: "6rem",
    overflow: "scroll",
  },

  cycleDiv: {
    textAlign: "left",
    width: "100%",
    maxWidth: "500px",
    margin: "auto",
  },
  buttons: {
    fontFamily: "Poppins, sans-serif",
    marginTop: ".5rem",
    display: "flex",
    justifyContent: "space-between",
  },
  cycleBtn: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    width: "30%",
    padding: "10px 10px",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    transition: ".2s ease all",
    // boxShadow: "3px 3px 15px rgba(0, 0, 0, 0.1)",
    "& h3": {
      fontSize: "16px",
      pointerEvents: "none",
    },
    "& p": {
      fontSize: "11px",
      pointerEvents: "none",
      fontWeight: "600",
    },
    "&:focus": {
      background: "#f0bb0b6d",
      color: "#333",
      "& h3": {
        color: "#333",
      },
      "& p": {
        color: "#333",
      },
    },
    fontFamily: "Work sans",
  },
  buySellDiv: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "Poppins, sans-serif",
    margin: "1rem auto 0 auto",
    marginBottom: 500,
    [theme.breakpoints.up("sm")]: {
      width: "500px",
    },
    "& button": {
      border: "none",
      fontSize: "20px",
      width: "48%",
      borderRadius: "5px",
      padding: "5px",
      fontFamily: "serif",
      color: "#fff",
    },
  },
  buy: {
    fontFamily: "Poppins, sanf-sexrif",
    background: "#088F8F",
    transition: ".1s ease all",
    "&:active": {
      background: "#077575",
    },
  },
  sell: {
    fontFamily: "Poppins, sanf-serif",
    background: "#FF5733",
    transition: ".1s ease all",
    "&:active": {
      background: "#D1472A",
    },
  },
  PSR: {
    color: "#999",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 0 0em 0",
    margin: "1rem 0",
    padding: "0",
    borderBottom: "1px #e7e7e7 solid",
    position: "relative",
    marginTop: 30,
  },
  PSRPee: {
    fontFamily: "sans-serif",
    border: "none",
    fontSize: "18px",
    color: "#666666",
    background: "none",
    // borderBottom: "1px #999 solid",
    fontFamily: "sans-serif",
    padding: " 0 0 .5rem 0",
    // position: "absolute",
    // width: "100%",
    "&:focus": {
      borderBottom: "1px #2A64E5 solid",
      width: "fit-content",
      color: "#2A64E5",
    },
  },
  PSRData: {
    color: "#666666",
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    // height: "200px",
    background: "#fff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    padding: "10px",
    "& h1": {
      textAlign: "center",
      width: "100%",
    },
    justifyContent: "center",
  },
  active: {
    color: "rgb(255,0,0",
    "&:active": {
      color: "rgba(255,0,0,1)",
    },
    flexDirection: "column",
    outline: "none",
  },
}));

const TradeOptions = () => {
  const [time, setTime] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState();
  const [visible, setVisible] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const [amount, setAmount] = useState("");
  const [percent, setPercent] = useState(0);
  const [buy, setBuy] = useState(false);
  const [sell, setSell] = useState(false);
  const classes = useStyles();
  const [tradeResults, setTradeResults] = useState(null);
  const [buyData, setBuyData] = useState(null);
  const [sellData, setSellData] = useState(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [details, setDetails] = useState(null);
  const [errors, setErrors] = useState(null);
  const { user, darkTheme, setRoute} = useContext(GlobalContext);
  const [cycle, setCycle] = useState(30);
  
  const navigate = useNavigate();

  const [selectedTimeInterval, setSelectedTimeInterval] = useState(0);
  const [timeLeft, setTimeLeft] = useState();
  const [timerCountdown, setTimerCountdown] = useState();
  const [pause, setPause] = useState(true);
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const [tradeState, setTradeState] = useState()

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  const timeInterval = useRef();

  useEffect(() => {
    if (selectedTimeInterval) {
      clearInterval(timeInterval.current);
      timeInterval.current = setInterval(() => {
        setTimeLeft(
          selectedTimeInterval -
            (Math.floor((Date.now() - 1657623439452) / 1000) %
              selectedTimeInterval)
        );
      }, 1000);
    }

    return () => {
      clearInterval(timeInterval.current);
    };
  }, [selectedTimeInterval]);

  useEffect(() => {
    if (timeLeft) {
      var timer = timeLeft,
        minutes,
        countdown,
        seconds;

      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setTimerCountdown(minutes + ":" + seconds);
    }

    if (timeLeft <= 20) {
      setPause(true);
    } else {
      setPause(false);
    }
  }, [timeLeft]);

  const handleTarget = (e) => {
    let target = e.target.innerText;
    let num = parseInt(target);

    // target.style.background = "#2A64E5";
    if (num) setTime(num);
    // //conole.log("time>>>", time);
    // //conole.log("Target Num>>>", num);
    if (num === 180) {
      setPercent(87);
    } else if (num === 300) {
      setPercent(90);
    } else if (num === 600) {
      setPercent(92);
    }

    handleTimerSeconds(e);
    setSelectedTimeInterval(num);
  };

  const fetchTradeResults = async () => {
    const userId = userData.id;
    const q = query(
      collection(db, "results"),
      where("id", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    let trade_results = [];
    querySnapshot.forEach((doc) => {
      trade_results.push({ ...doc.data(), id: doc.id });
      setTradeResults(trade_results);
      // //conole.log(doc.id, " => ", doc.data());
    });
  };

  function randomStr(len, arr) {
    var ans = "";
    for (var i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }

  const handleBuyTimerCountDown = async () => {
    const tradeNo = randomStr(15, "12345abcde")

     //if there is any undecided outcome of same trade  
      //and of opposite position update union field true for both
      const colRef = CollectionRef("requests")
      const q = query( 
        colRef, 
        where("outcome", "==", ""),
        where("trader_id", "==", userData.id),
        where("duration", "==", time),
        where("position", "==", "Sell"),
        where("unionID", "==", ""),
      );

      const unionTrade = await getDocs(q);
      const unionID = RandomStr(10);

      if(unionTrade.size){
        // sell trade was initiated on same position within current timer
        unionTrade.forEach((trade) => {
          const docRef = doc(db, "requests", trade.id);
          updateDoc(docRef, {
            union: true,
            unionID: unionID
          });
        });
      }

    if (user === null) {
      navigate("/login");
    } else if (amount === "" || amount === 0 || time === 0) {
      setErrors("Please set an amount/time to place trade with.");
    } else if (
      (userData.balance === 0 && amount > userData.bonus) ||
      (userData.balance < userData.bonus && amount > userData.bonus)
    ) {
      setErrors("Insufficient Balance.");
    } else if (userData.balance > userData.bonus && amount > userData.balance) {
      setErrors("Insufficient Balance.");
    } else {
      let currentBtcPrice;
      await axios
        .get("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then((res) => {
          const parsedPrice = parseFloat(
            res.data.bpi.USD.rate.match(/\d|\.|\-/g).join("")
          );
          currentBtcPrice = parsedPrice.toFixed(2);
        })
        .catch((err) => {
          console.error(err);
        });
      const buyData = {
        trader: userData.firstname + " " + userData.lastname,
        trader_id: userData.id,
        trader_balance: userData.balance,
        amount_traded: amount,
        percent: percent,
        position: "Buy",
        createdAt: serverTimestamp(),
        status: `${selectedTimeInterval}BuyPending`,
        phone_number: userData.phone_number ? userData.phone_number : null,
        email: userData.email ? userData.email : null,
        tradeNo: tradeNo,
        time: FullDateTime(), //easily used for calculating date difference in date obj
        // time: Moment().format("MMM Do YY, hh:mm A"),
        duration: time,
        outcome: "",
        union: unionTrade.size? true : false,
        unionID: unionTrade.size? unionID : "",
        timeLeft: timeLeft,
        currentBtcPrice,
        secondsPicked: selectedTimeInterval,
        trader_bonus: userData.bonus,
        docID: userData.docID,
      };

      setBuyData(buyData);
      addDoc(collection(db, "requests"), buyData);

      const userDocId = userData.phone_number
        ? userData.phone_number
        : userData.email;
      const que = doc(db, "users", userData.docID);

      if (userData.balance === 0 || userData.balance < userData.bonus) {
        updateDoc(que, {
          bonus: userData.bonus - amount,
        });
      } else {
        updateDoc(que, {
          balance: userData.balance - amount,
        });
      }

      navigate("/records");
      setRoute("/records");
    }
  };

  const handleSellTimerCountDown = async () => {
    const tradeNo = randomStr(15, "12345abcde")
    //if there is any undecided outcome of same trade  
      //and of opposite position update union field true for both
      const colRef = CollectionRef("requests")
      const q = query( 
        colRef, 
        where("outcome", "==", ""),
        where("trader_id", "==", userData.id),
        where("duration", "==", time),
        where("position", "==", "Buy"),
        where("unionID", "==", ""),
      );

      const unionTrade = await getDocs(q);
      const unionID = RandomStr(10)
      if(unionTrade.size){
        // sell trade was initiated on same position within current timer
        unionTrade.forEach((trade) => {
          const docRef = doc(db, "requests", trade.id);
          updateDoc(docRef, {
            union: true,
            unionID: unionID
          });
        });
      }

    if (user === null) {
      navigate("/login");
    } else if (amount === "" || amount === 0 || time === 0) {
      setErrors("Please set an amount/time to place trade with.");
    } else if (
      (userData.balance === 0 && amount > userData.bonus) ||
      (userData.balance < userData.bonus && amount > userData.bonus)
    ) {
      setErrors("Insufficient Balance.");
    } else if (userData.balance > userData.bonus && amount > userData.balance) {
      setErrors("Insufficient Balance.");
    } else {
      let currentBtcPrice;
      await axios
        .get("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then((res) => {
          const parsedPrice = parseFloat(
            res.data.bpi.USD.rate.match(/\d|\.|\-/g).join("")
          );
          currentBtcPrice = parsedPrice.toFixed(2);
        })
        .catch((err) => {
          console.error(err);
        });
      const sellData = {
        trader: userData.firstname + " " + userData.lastname,
        trader_id: userData.id,
        trader_balance: userData.balance,
        amount_traded: amount,
        percent: percent,
        position: "Sell",
        createdAt: serverTimestamp(),
        status: `${selectedTimeInterval}SellPending`,
        phone_number: userData.phone_number ? userData.phone_number : null,
        email: userData.email ? userData.email : null,
        tradeNo: tradeNo,
        time: FullDateTime(), //easily used for calculating date difference in date obj
        // time: Moment().format("MMM Do YY, hh:mm A"),
        duration: time,
        outcome: "",
        union: unionTrade.size? true : false,
        unionID: unionTrade.size? unionID : "",
        timeLeft: timeLeft,
        currentBtcPrice,
        secondsPicked: selectedTimeInterval,
        trader_bonus: userData.bonus,
        docID: userData.docID,
      };

      setSellData(sellData);
      addDoc(collection(db, "requests"), sellData);

      const userDocId = userData.phone_number
        ? userData.phone_number
        : userData.email;
      const que = doc(db, "users", userData.docID);

      if (userData.balance === 0 || userData.balance < userData.bonus) {
        updateDoc(que, {
          bonus: userData.bonus - amount,
        });
      } else {
        updateDoc(que, {
          balance: userData.balance - amount,
        });
      }

      navigate("/records");
      setRoute("/records");
    }
  };

  const closeModal = () => {
    if (time === 0) {
      setOpenModal(false);
    }
    // //conole.log(time);
  };

  const handleTimerSeconds = (e) => {
    // const timer = document.getElementById("timer");
    // timer.style.display = "flex";
    let target = e.target;
    let targetContent = target.firstChild.textContent;
    let targetNum = parseInt(targetContent);

    setTimerTime(targetNum * 1000);
    // //conole.log(targetNum * 1000);
  };

  // //conole.log("time>>>", time);

  const getPhoneUser = async () => {
    const phoneNo = localStorage.getItem("PhoneNumber");
    if (phoneNo) {
      try {
        onSnapshot(doc(db, "users", phoneNo), async (snapshot) => {
          //conole.log(snapshot.data());
          setUserData(snapshot.data());
          const q = query(
            collection(db, "results"),
            where("id", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          let trade_results = [];
          querySnapshot.forEach((doc) => {
            trade_results.push({ ...doc.data(), id: doc.id });
            setTradeResults(trade_results);
            // //conole.log(doc.id, " => ", doc.data());
          });
        });
      } catch (error) {
        //conole.log(error);
      }
    }
  };

  const getEmailUser = async () => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), async (snapshot) => {
          // //conole.log(snapshot.data());
          setUserData(snapshot.data());
          const q = query(
            collection(db, "results"),
            where("id", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          let trade_results = [];
          querySnapshot.forEach((doc) => {
            trade_results.push({ ...doc.data(), id: doc.id });
            setTradeResults(trade_results);
            // //conole.log(doc.id, " => ", doc.data());
          });
        });
      } catch (error) {
        //conole.log(error);
      }
    }
  };

  const getTradeState = async () => {
    onSnapshot(doc(db, "tradefunction", "trade_state"), (snapshot) => {
      setTradeState(snapshot.data().disabled);
    });
  };

  useEffect(() => {
    getPhoneUser();
    getEmailUser();
    getTradeState();
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), (snapshot) => {
          // //conole.log(snapshot.data());
          setUserData(snapshot.data());
        });
      } catch (error) {
        //conole.log(error);
      }
    }
  }, []);

  const clear = () => {
    // const amount = document.getElementById('amount')
    // //conole.log(amount.value)
    // amount.value = "";
    setAmount("");
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const closeDetailsModal = () => {
    setDetailsModal(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.balDiv}>
        <div className={classes.balLeft}>
          <div className={classes.balance} style={{ fontFamily: "Work sans" }}>
            {visible ? (
              <MdOutlineVisibilityOff
                id="closed"
                style={{ color: primaryColor, width: "20px", fontSize: 20 }}
                onClick={toggleVisibility}
              />
            ) : (
              <MdOutlineVisibility
                id="open"
                style={{
                  color: darkTheme === false ? primaryColor : "#ffdf10",
                  width: "20px",
                  fontSize: 20,
                }}
                onClick={toggleVisibility}
              />
            )}
          </div>
          <div>
            <h3
              style={{ color: darkTheme === false ? primaryColor : "#ffdf10" }}
            >
              Balance
            </h3>
            {visible ? (
              <p
                id="balance"
                className={classes.balValue}
                style={{ color: darkTheme === false ? "#333" : "#fff" }}
              >
                {" "}
                ${userData ? userData.balance.toFixed(2) : "--"}{" "}
              </p>
            ) : (
              <p
                id="hidden-balance"
                style={{ color: darkTheme === false ? "#333" : "#fff" }}
              >
                ****
              </p>
            )}
          </div>
        </div>
        <div
          className={classes.balRight}
          style={{
            background: darkTheme === false ? "#f5f5f5" : textInputDark,
          }}
        >
          <input
            style={{
              border: "none",
              width: "74%",
              height: "40px",
              background: darkTheme === false ? textInput : textInputDark,
              fontSize: "15px",
              fontFamily: "Poppins, sans-serif",
              textAlign: "center",
              outline: "none",
              color: darkTheme === false ? "#333" : "#fff",
            }}
            type="number"
            placeholder="Amount"
            id="amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              //conole.log(amount);
              setErrors(null);
            }}
          />
          <BsBackspace
            className={classes.active}
            style={{
              fontSize: "30px",
              color: darkTheme === false ? "#555" : "#ffdf10",
              fontSize: 20,
            }}
            onClick={clear}
          />
        </div>
      </div>
      <div
        className={classes.cycleDiv}
        style={{ color: darkTheme === false ? "#777" : "#fff" }}
      >
        <div
          className={classes.flexBetween}
          style={{ fontFamily: "Work sans" }}
        >
          <h3>Cycle</h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            {selectedTimeInterval === 0 ? (
              <></>
            ) : (
              <p style={{ margin: "0px 5px" }} id="timer">
                Timer: {timerCountdown}
              </p>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/records");
                setRoute("/records");
              }}
            >
              <p style={{ fontSize: "12px" }}>records</p>
              <BsFillInfoCircleFill style={{ margin: "0px 5px" }} />
            </div>
          </div>
        </div>
        <div
          className={classes.buttons}
          style={{ background: darkTheme === false ? "#ffffff" : "#3d3d3d" }}
        >
          <button
            className={classes.cycleBtn}
            style={
              selectedTimeInterval === 180
                ? {
                    background: "#f0bb0b6d",
                    "& h3": {
                      color: darkTheme === false ? "#333" : "#fff",
                    },
                    "& p": {
                      color: darkTheme === false ? "#333" : "#fff",
                    },
                  }
                : {}
            }
            onClick={handleTarget}
          >
            <div className={classes.flexCenter}>
              <h3>180</h3>
              <h3>s</h3>
            </div>
            <p>(Profit: 87%)</p>
          </button>
          <button
            className={classes.cycleBtn}
            style={
              selectedTimeInterval === 300
                ? {
                    background: "#f0bb0b6d",
                    color: "#333",
                    "& h3": {
                      color: "#333",
                    },
                    "& p": {
                      color: "#333",
                    },
                  }
                : {}
            }
            onClick={handleTarget}
          >
            <div className={classes.flexCenter}>
              <h3>300</h3>
              <h3>s</h3>
            </div>
            <p>(Profit: 90%)</p>
          </button>
          <button
            className={classes.cycleBtn}
            style={
              selectedTimeInterval === 600
                ? {
                    background: "#f0bb0b6d",
                    color: "#333",
                    "& h3": {
                      color: "#333",
                    },
                    "& p": {
                      color: "#333",
                    },
                  }
                : {}
            }
            onClick={handleTarget}
          >
            <div className={classes.flexCenter}>
              <h3>600</h3>
              <h3>s</h3>
            </div>
            <p>(Profit: 92%)</p>
          </button>
        </div>
      </div>

      {errors && (
        <div style={{ marginTop: 20 }}>
          <p
            style={{
              textAlign: "center",
              color: "red",
              fontSize: 13,
              fontFamily: "Work Sans",
            }}
          >
            {errors}
          </p>
        </div>
      )}

      <div>
        {tradeState === "disabled" ? (
          <>
            <p
              style={{
                marginTop: 20,
                color: darkTheme === false ? "#333" : "#fff",
              }}
            >
              You can't trade right now.
            </p>
          </>
        ) : (
          <>
            {pause ? (
              <p
                style={{
                  marginTop: 20,
                  color: darkTheme === false ? "#333" : "#fff",
                }}
              >
                You can't trade right now.
              </p>
            ) : (
              <div className={classes.buySellDiv}>
                <button
                  className={classes.buy}
                  onClick={() => {
                    handleBuyTimerCountDown();
                  }}
                  style={{ fontFamily: "Work sans" }}
                >
                  Buy
                </button>
                <button
                  className={classes.sell}
                  onClick={() => {
                    handleSellTimerCountDown();
                  }}
                  style={{ fontFamily: "Work sans" }}
                >
                  Sell
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {windowDimenion.winWidth < 768 ? <Footer /> : null}
    </div>
  );
};

export default TradeOptions;
