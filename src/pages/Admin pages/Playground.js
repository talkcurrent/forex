import React, { useEffect, useState, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import {
  onSnapshot,
  collection,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import db from "../../store/server.config";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import Notifications from "../../components/Home/Notifications";
import TradeState from "../../components/TradeState";

const primaryColor = "#F0B90B";

const useStyles = makeStyles({
  buttons: {
    background: "#ffffff",
    fontFamily: "Poppins, sans-serif",
    marginTop: ".5rem",
    display: "flex",
    justifyContent: "space-between",
    "& h3": {
      color: primaryColor,
    },
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
      color: "#333",
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
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
  },
});

const Playground = () => {
  const classes = useStyles();
  const [requests, setRequests] = useState();
  const [entryPrice, setEntryPrice] = useState("");
  const [settlePrice, setSettlePrice] = useState("");

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
        setRequests(list);
      });
    });
  }, []);

  const helperFunction = (amount_traded, percentage) => {
    const percentOfAmount = (amount_traded / 100) * percentage;
    // //conole.log("Percentage of amount traded>>>", percentOfAmount);
    return percentOfAmount;
  };

  const winGame = async (
    amount_traded,
    percentage,
    id,
    name,
    position,
    docId,
    phone_number,
    email,
    balance,
    duration,
    tradeNo,
    bonus,
    docID
  ) => {
    const percentOfAmount = helperFunction(amount_traded, percentage);
    const updateRef = doc(db, "requests", docId);
    await updateDoc(updateRef, {
      status: "done",
      addition: percentOfAmount,
      settleTime: moment().format("MMM Do, YY hh:mm A"),
      outcome: "Win",
      entryPrice: entryPrice,
      settlePrice: settlePrice,
    });
    const userDocId = phone_number !== null ? phone_number : email;
    const q = doc(db, "users", docID);

    if (balance === 0) {
      await updateDoc(q, {
        bonus: 5,
      }).then(async () => {
        await updateDoc(q, {
          balance: balance + percentOfAmount,
        });
      });
    } else {
      await updateDoc(q, {
        balance: balance + percentOfAmount,
      });
    }
  };

  const looseGame = async (
    amount_traded,
    percentage,
    id,
    name,
    position,
    docId,
    phone_number,
    email,
    balance,
    duration,
    tradeNo,
    bonus,
    docID
  ) => {
    const percentOfAmount = helperFunction(amount_traded, percentage);
    const updateRef = doc(db, "requests", docId);
    const parsedAmount = parseFloat(amount_traded);
    await updateDoc(updateRef, {
      status: "done",
      addition: parsedAmount,
      settleTime: moment().format("MMM Do, YY hh:mm A"),
      outcome: "Lost",
      entryPrice: entryPrice,
      settlePrice: settlePrice,
    });
    const userDocId = phone_number !== null ? phone_number : email;
    const q = doc(db, "users", docID);

    if (balance === 0) {
      await updateDoc(q, {
        bonus: bonus - parsedAmount,
      }).then(async () => {
        await updateDoc(q, {
          balance: 0,
        });
      });
    } else {
      if (balance > bonus) {
        await updateDoc(q, {
          balance: balance - parsedAmount,
        });
      } else {
        await updateDoc(q, {
          bonus: bonus - parsedAmount,
        });
      }
    }
  };

  //Buy Win Updates
  const multiple180BuyWinUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 180) &&
        where("status", "==", "180BuyPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          updateDoc(q, {
            status: "done",
            addition: percentOfAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Win",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance + percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(que, {
                bonus: 5,
              }).then(async () => {
                await updateDoc(que, {
                  balance: document.data().trader_balance + percentOfAmount,
                });
              });
            } else {
              await updateDoc(que, {
                balance: document.data().trader_balance + percentOfAmount,
              });
            }
          });
        });
      }
    });
  };

  const multiple300BuyWinUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 300) &&
        where("status", "==", "300BuyPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          updateDoc(q, {
            status: "done",
            addition: percentOfAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Win",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance + percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(que, {
                bonus: 5,
              }).then(async () => {
                await updateDoc(que, {
                  balance: document.data().trader_balance + percentOfAmount,
                });
              });
            } else {
              await updateDoc(que, {
                balance: document.data().trader_balance + percentOfAmount,
              });
            }
          });
        });
      }
    });
  };

  const multiple600BuyWinUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 600) &&
        where("status", "==", "600BuyPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          updateDoc(q, {
            status: "done",
            addition: percentOfAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Win",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance + percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(que, {
                bonus: 5,
              }).then(async () => {
                await updateDoc(que, {
                  balance: document.data().trader_balance + percentOfAmount,
                });
              });
            } else {
              await updateDoc(que, {
                balance: document.data().trader_balance + percentOfAmount,
              });
            }
          });
        });
      }
    });
  };

  //Buy Loose Updates
  const multiple180BuyLooseUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 180) &&
        where("status", "==", "180BuyPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          const parsedAmount = parseFloat(document.data().amount_traded);

          updateDoc(q, {
            status: "done",
            addition: parsedAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Lost",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance - percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(q, {
                bonus: document.data().trader_bonus - parsedAmount,
              }).then(async () => {
                await updateDoc(q, {
                  balance: 0,
                });
              });
            } else {
              if (
                document.data().trader_balance > document.data().trader_bonus
              ) {
                await updateDoc(q, {
                  balance: document.data().trader_balance - parsedAmount,
                });
              } else {
                await updateDoc(q, {
                  bonus: document.data().trader_bonus - parsedAmount,
                });
              }
            }
          });
        });
      }
    });
  };

  const multiple300BuyLooseUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 300) &&
        where("status", "==", "300BuyPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          const parsedAmount = parseFloat(document.data().amount_traded);

          updateDoc(q, {
            status: "done",
            addition: parsedAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Lost",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance - percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(q, {
                bonus: document.data().trader_bonus - parsedAmount,
              }).then(async () => {
                await updateDoc(q, {
                  balance: 0,
                });
              });
            } else {
              if (
                document.data().trader_balance > document.data().trader_bonus
              ) {
                await updateDoc(q, {
                  balance: document.data().trader_balance - parsedAmount,
                });
              } else {
                await updateDoc(q, {
                  bonus: document.data().trader_bonus - parsedAmount,
                });
              }
            }
          });
        });
      }
    });
  };

  const multiple600BuyLooseUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 600) &&
        where("status", "==", "600BuyPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          const parsedAmount = parseFloat(document.data().amount_traded);

          updateDoc(q, {
            status: "done",
            addition: parsedAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Lost",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance - percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(q, {
                bonus: document.data().trader_bonus - parsedAmount,
              }).then(async () => {
                await updateDoc(q, {
                  balance: 0,
                });
              });
            } else {
              if (
                document.data().trader_balance > document.data().trader_bonus
              ) {
                await updateDoc(q, {
                  balance: document.data().trader_balance - parsedAmount,
                });
              } else {
                await updateDoc(q, {
                  bonus: document.data().trader_bonus - parsedAmount,
                });
              }
            }
          });
        });
      }
    });
  };

  //Sell Win Updates
  const multiple180SellWinUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 180) &&
        where("status", "==", "180SellPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          updateDoc(q, {
            status: "done",
            addition: percentOfAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Win",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance + percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(que, {
                bonus: 5,
              }).then(async () => {
                await updateDoc(que, {
                  balance: document.data().trader_balance + percentOfAmount,
                });
              });
            } else {
              await updateDoc(que, {
                balance: document.data().trader_balance + percentOfAmount,
              });
            }
          });
        });
      }
    });
  };

  const multiple300SellWinUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 300) &&
        where("status", "==", "300SellPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          updateDoc(q, {
            status: "done",
            addition: percentOfAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Win",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance + percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(que, {
                bonus: 5,
              }).then(async () => {
                await updateDoc(que, {
                  balance: document.data().trader_balance + percentOfAmount,
                });
              });
            } else {
              await updateDoc(que, {
                balance: document.data().trader_balance + percentOfAmount,
              });
            }
          });
        });
      }
    });
  };

  const multiple600SellWinUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 600) &&
        where("status", "==", "600SellPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          updateDoc(q, {
            status: "done",
            addition: percentOfAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Win",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance + percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(que, {
                bonus: 5,
              }).then(async () => {
                await updateDoc(que, {
                  balance: document.data().trader_balance + percentOfAmount,
                });
              });
            } else {
              await updateDoc(que, {
                balance: document.data().trader_balance + percentOfAmount,
              });
            }
          });
        });
      }
    });
  };

  //Sell Loose Updates
  const multiple180SellLooseUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 180) &&
        where("status", "==", "180SellPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          const parsedAmount = parseFloat(document.data().amount_traded);

          updateDoc(q, {
            status: "done",
            addition: parsedAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Lost",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance - percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(q, {
                bonus: document.data().trader_bonus - parsedAmount,
              }).then(async () => {
                await updateDoc(q, {
                  balance: 0,
                });
              });
            } else {
              if (
                document.data().trader_balance > document.data().trader_bonus
              ) {
                await updateDoc(q, {
                  balance: document.data().trader_balance - parsedAmount,
                });
              } else {
                await updateDoc(q, {
                  bonus: document.data().trader_bonus - parsedAmount,
                });
              }
            }
          });
        });
      }
    });
  };

  const multiple300SellLooseUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 300) &&
        where("status", "==", "300SellPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          const parsedAmount = parseFloat(document.data().amount_traded);

          updateDoc(q, {
            status: "done",
            addition: parsedAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Lost",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance - percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(q, {
                bonus: document.data().trader_bonus - parsedAmount,
              }).then(async () => {
                await updateDoc(q, {
                  balance: 0,
                });
              });
            } else {
              if (
                document.data().trader_balance > document.data().trader_bonus
              ) {
                await updateDoc(q, {
                  balance: document.data().trader_balance - parsedAmount,
                });
              } else {
                await updateDoc(q, {
                  bonus: document.data().trader_bonus - parsedAmount,
                });
              }
            }
          });
        });
      }
    });
  };

  const multiple600SellLooseUpdate = async () => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 600) &&
        where("status", "==", "600SellPending")
    );

    getDocs(q).then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((document) => {
          const q = doc(db, "requests", document.id);

          const percentOfAmount = helperFunction(
            document.data().amount_traded,
            document.data().percent
          );

          const parsedAmount = parseFloat(document.data().amount_traded);

          updateDoc(q, {
            status: "done",
            addition: parsedAmount,
            settleTime: moment().format("MMM Do, YY hh:mm A"),
            outcome: "Lost",
            entryPrice: entryPrice,
            settlePrice: settlePrice,
          }).then(async () => {
            const userDocId =
              document.data().phone_number !== null
                ? document.data().phone_number
                : document.data().email;
            const que = doc(db, "users", document.data().docID);

            // updateDoc(que, {
            //   balance: document.data().trader_balance - percentOfAmount,
            // });
            if (document.data().trader_balance === 0) {
              await updateDoc(q, {
                bonus: document.data().trader_bonus - parsedAmount,
              }).then(async () => {
                await updateDoc(q, {
                  balance: 0,
                });
              });
            } else {
              if (
                document.data().trader_balance > document.data().trader_bonus
              ) {
                await updateDoc(q, {
                  balance: document.data().trader_balance - parsedAmount,
                });
              } else {
                await updateDoc(q, {
                  bonus: document.data().trader_bonus - parsedAmount,
                });
              }
            }
          });
        });
      }
    });
  };

  const [oneEightyBuys, setOneEightyBuys] = useState(0);
  const [threeHundredBuys, setThreeHundredBuys] = useState(0);
  const [sixHundredBuys, setSixHundredBuys] = useState(0);
  const [oneEightySells, setOneEightySells] = useState(0);
  const [threeHundredSells, setThreeHundredSells] = useState(0);
  const [sixHundredSells, setSixHundredSells] = useState(0);

  const [tradeState, setTradeState] = useState();

  useEffect(() => {
    const q = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 180) &&
        where("status", "==", "180BuyPending")
    );
    onSnapshot(q, (snapshot) => {
      setOneEightyBuys(snapshot.size);
    });

    const threeHundred = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 300) &&
        where("status", "==", "300BuyPending")
    );
    onSnapshot(threeHundred, (snapshot) => {
      setThreeHundredBuys(snapshot.size);
    });

    const sixHundred = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 600) &&
        where("status", "==", "600BuyPending")
    );
    onSnapshot(sixHundred, (snapshot) => {
      setSixHundredBuys(snapshot.size);
    });

    const sq = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 180) &&
        where("status", "==", "180SellPending")
    );
    onSnapshot(sq, (snapshot) => {
      setOneEightySells(snapshot.size);
    });

    const threeHundredSellsQ = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 300) &&
        where("status", "==", "300SellPending")
    );
    onSnapshot(threeHundredSellsQ, (snapshot) => {
      setThreeHundredSells(snapshot.size);
    });

    const sixHundredSellsQ = query(
      collection(db, "requests"),
      where("secondsPicked", "==", 600) &&
        where("status", "==", "600SellPending")
    );
    onSnapshot(sixHundredSellsQ, (snapshot) => {
      setSixHundredSells(snapshot.size);
    });
  }, []);

  const [selectedTimeInterval, setSelectedTimeInterval] = useState(180);
  const [timeLeft, setTimeLeft] = useState();
  const [time, setTime] = useState(0);
  const [percent, setPercent] = useState(0);
  const [timerCountdown, setTimerCountdown] = useState();

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

    setSelectedTimeInterval(num);
  };

  const getTradeState = async () => {
    onSnapshot(doc(db, "tradefunction", "trade_state"), (snapshot) => {
      setTradeState(snapshot.data().disabled);
    });
  };

  useEffect(() => {
    getTradeState();
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <div>
        <p>Time Left : {timerCountdown}</p>
      </div>

      <Notifications />
      {tradeState && (
        <div>
          {tradeState === "disabled" ? (
            <div>
              <p>Trade Session is Closed</p>
            </div>
          ) : (
            <div>
              <p>Trade Session is Active</p>
            </div>
          )}
        </div>
      )}
      <TradeState />
      <div className={classes.buttons}>
        <button
          className={classes.cycleBtn}
          style={
            selectedTimeInterval === 180
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

      <div>
        <TextField
          id="outlined-name"
          label="Entry Price"
          className={classes.textField}
          value={entryPrice}
          onChange={(e) => {
            setEntryPrice(e.target.value);
            //conole.log(e.target.value);
          }}
          margin="normal"
          variant="outlined"
          fullWidth
        />

        <TextField
          id="outlined-name"
          label="Settle Price"
          className={classes.textField}
          value={settlePrice}
          onChange={(e) => {
            setSettlePrice(e.target.value);
            //conole.log(e.target.value);
          }}
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-sexrif",
                background: "#088F8F",
                color: "#fff",
              }}
              onClick={() => multiple180BuyWinUpdate()}
            >
              <p>{oneEightyBuys}</p>
              <p style={{ marginLeft: 8 }}>Win Buys 180s</p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-sexrif",
                background: "#088F8F",
                color: "#fff",
              }}
              onClick={() => multiple300BuyWinUpdate()}
            >
              <p>{threeHundredBuys}</p>
              <p style={{ marginLeft: 8 }}>Win Buys 300s</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-sexrif",
                background: "#088F8F",
                color: "#fff",
              }}
              onClick={() => multiple600BuyWinUpdate()}
            >
              <p>{sixHundredBuys}</p>
              <p style={{ marginLeft: 8 }}>Win Buys 600s</p>
            </div>
          </div>

          <div style={{ margin: "0px 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-serif",
                background: "#FF5733",
                color: "#fff",
              }}
              onClick={() => multiple180BuyLooseUpdate()}
            >
              <p>{oneEightyBuys}</p>
              <p style={{ marginLeft: 8 }}>Loose Buys 180s</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-serif",
                background: "#FF5733",
                color: "#fff",
              }}
              onClick={() => multiple300BuyLooseUpdate()}
            >
              <p>{threeHundredBuys}</p>
              <p style={{ marginLeft: 8 }}>Loose Buys 300s</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-serif",
                background: "#FF5733",
                color: "#fff",
              }}
              onClick={() => multiple600BuyLooseUpdate()}
            >
              <p>{sixHundredBuys}</p>
              <p style={{ marginLeft: 8 }}>Loose Buys 600s</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-sexrif",
                background: "#088F8F",
                color: "#fff",
              }}
              onClick={() => multiple180SellWinUpdate()}
            >
              <p>{oneEightySells}</p>
              <p style={{ marginLeft: 8 }}>Win Sells 180s</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-sexrif",
                background: "#088F8F",
                color: "#fff",
              }}
              onClick={() => multiple300SellWinUpdate()}
            >
              <p>{threeHundredSells}</p>
              <p style={{ marginLeft: 8 }}>Win Sells 300s</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-sexrif",
                background: "#088F8F",
                color: "#fff",
              }}
              onClick={() => multiple600SellWinUpdate()}
            >
              <p>{sixHundredSells}</p>
              <p style={{ marginLeft: 8 }}>Win Sells 600s</p>
            </div>
          </div>

          <div style={{ margin: "0px 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-serif",
                background: "#FF5733",
                color: "#fff",
              }}
              onClick={() => multiple180SellLooseUpdate()}
            >
              <p>{oneEightySells}</p>
              <p style={{ marginLeft: 8 }}>Loose Sells 180s</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-serif",
                background: "#FF5733",
                color: "#fff",
              }}
              onClick={() => multiple300SellLooseUpdate()}
            >
              <p>{threeHundredSells}</p>
              <p style={{ marginLeft: 8 }}>Loose Sells 300s</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 5,
                margin: "10px 0px",
                fontFamily: "Poppins, sanf-serif",
                background: "#FF5733",
                color: "#fff",
              }}
              onClick={() => multiple600SellLooseUpdate()}
            >
              <p>{sixHundredSells}</p>
              <p style={{ marginLeft: 8 }}>Loose Sells 600s</p>
            </div>
          </div>
        </div>
      </div>

      {requests &&
        requests.map((request) => (
          <div
            key={request.id}
            style={{ margin: "10px 0", border: "1px solid #ccc", padding: 10 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: request.status !== "done" ? "#ccc" : "#00ff00",
                  width: 80,
                  padding: 5,
                }}
              >
                <p
                  style={{
                    textAlign: "left",

                    width: 100,
                  }}
                >
                  {request.status !== "done" ? "Pending" : "Done"}
                </p>
              </div>

              <p style={{ marginRight: 13, fontWeight: "bolder" }}>
                {request.secondsPicked}s
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 13px",
              }}
            >
              <p>- {request.trader}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ margin: "0px 10px" }}>Position - </p>
                <p
                  style={{
                    background:
                      request.position === "Buy" ? "#51BD8E" : "#F04E67",
                    padding: 10,
                  }}
                >
                  {request.position === "Buy" ? "Buy" : "Sell"}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <p>Balance - ${request.trader_balance.toFixed(2)}</p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <p
                  style={{
                    background: "#51BD8E",
                    padding: 10,
                    margin: "0px 10px",
                    display: request.status !== "done" ? "block" : "none",
                  }}
                  onClick={() => {
                    winGame(
                      request.amount_traded,
                      request.percent,
                      request.trader_id,
                      request.trader,
                      request.position,
                      request.id,
                      request.phone_number,
                      request.email,
                      request.trader_balance,
                      request.duration,
                      request.tradeNo,
                      request.trader_bonus,
                      request.docID
                    );
                  }}
                >
                  Win
                </p>
                <p
                  style={{
                    background: "#F04E67",
                    padding: 10,
                    display: request.status !== "done" ? "block" : "none",
                  }}
                  onClick={() =>
                    looseGame(
                      request.amount_traded,
                      request.percent,
                      request.trader_id,
                      request.trader,
                      request.position,
                      request.id,
                      request.phone_number,
                      request.email,
                      request.trader_balance,
                      request.duration,
                      request.tradeNo,
                      request.trader_bonus,
                      request.docID
                    )
                  }
                >
                  Loose
                </p>
              </div>
            </div>
            <div>
              <p>Amount Traded - ${request.amount_traded}</p>
              <p>Time Traded - {request.time}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Playground;
