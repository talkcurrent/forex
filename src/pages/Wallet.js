import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import noTransaction from "../assets/amico.png";
import { Link } from "react-router-dom";
import Footer from "../components/Home/Footer";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../store/context";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {
  onSnapshot,
  doc,
  query,
  collection,
  where,
  getDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import db from "../store/server.config";
import CurrencyFormat from "react-currency-format";

const primaryColor = "#F0B90B";
// const icons = "#B4AAF9";
// const textInput = " #E4E2F1";
// const subTexts = " #D3CFE2";

const myStyles = makeStyles({
  main: {
    fontFamily: "Poppins, sans-serif",
    transition: ".5s",
    height: "100vh",
  },
  container: {
    width: "90%",
    margin: "auto",
  },
  top: {
    background: "#f5f5f5",
  },
  blueTop: {
    display: "flex",
    padding: ".8rem 0 .8rem 0",
    alignItems: "center",
    // background: "#f5f5f5",
  },
  coinIcon: {
    height: "5rem",
    aspectRatio: "1",
    background: primaryColor,
    margin: "5rem auto 0 auto",
    position: " relative",
    fontSize: "50px",
    transform: "rotateZ(15deg)",
    borderRadius: "50%",
    "& i": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#fff",
    },
  },
  sendReceive: {
    display: "flex",
    width: "50%",
    margin: "auto",
    justifyContent: "space-between",
    marginTop: "2rem",
  },
  popDiv: {
    height: "4rem",
    aspectRatio: "1",
    background: primaryColor,
    position: "relative",
    borderRadius: "50%",
    transition: ".2s ease all",
    "& i": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#fff",
      fontSize: "20px",
    },
    top: {
      background: "#f1f1f1",
    },
  },
  transactions: {
    padding: 10,
    margin: "0 0 3rem 0",
    "& p": {
      fontSize: "20px",
    },
  },
  noTrans: {
    width: "80%",
    margin: "3rem auto 1rem auto ",
    "& img": {
      width: "100%",
    },
  },
  dMain: {
    width: "100%",
    margin: "auto",
    padding: "3rem 0",
  },
  dWallet: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "flex-start",
    border: "1px solid",
    borderColor: "#e1e1e1",
    width: "94%",
    margin: "auto",
    borderRadius: "10px",
    padding: "2rem 1rem",
    // boxShadow:"1px 2px 6px rgba(0, 0, 0, 0.2)",
  },
  dMoneyValues: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    color: "#333",
    gap: "1rem",
    padding: "1rem 2rem",
    border: "1px #e1e1e1 solid",
    borderRadius: "6px",
  },
  dBalance: {
    textAlign: "left",
  },
  dButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    gap: "1rem",
    padding: "1rem 2rem",
    // border: "1px #e1e1e1 solid",
    borderRadius: "6px",
    width: "20%",
    background: primaryColor,
    cursor: "pointer",
  },
  dTabs: {
    display: "flex",
    gap: "1rem",
    width: "100%",
    height: "",
  },
});

const Wallet = () => {
  const [userData, setUserData] = useState();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const goBack = () => {
    navigate("/");
  };
  const { darkTheme, setRoute } = useContext(GlobalContext);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), async (snapshot) => {
          setUserData(snapshot.data());
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    const phone = localStorage.getItem("PhoneNumber");
    if (phone) {
      try {
        onSnapshot(doc(db, "users", phone), async (snapshot) => {
          setUserData(snapshot.data());
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const classes = myStyles();

  const handleVisibility = () => {
    setVisible((prevState) => !prevState);
  };

  // ------------------------------------------------- responsiveness

  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  return (
    <div>
      {windowDimenion.winWidth < 768 ? (
        <div
          className={classes.main}
          style={{ background: darkTheme === false ? "#f5f5f5" : "#333" }}
        >
          <div style={{ background: darkTheme === false ? "#f5f5f5" : "#333" }}>
            <div
              className={classes.top}
              style={{
                background: darkTheme === false ? "#F0F0F0" : "#333",
              }}
            >
              <div className={classes.container}>
                <div className={classes.blueTop}>
                  <div style={{}} onClick={() => goBack()}>
                    <i
                      style={{
                        color: darkTheme === false ? "#555" : "#ffdf10",
                      }}
                      class="fa fa-chevron-left"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <h3
                    style={{
                      flex: "1",
                      color: darkTheme === false ? "#555" : "#ffdf10",
                      fontSize: "20px",
                      marginRight: "1rem",
                    }}
                  >
                    Wallet
                  </h3>
                </div>
              </div>
            </div>
            <div
              style={{
                margin: "0",
                display: "flex",
                flexDirection: "column",
                background: darkTheme === false ? "#fefefe" : "#333",
                textAlign: "left",
                borderBottom: "1px #eee solid",
              }}
            >
              <div
                style={{
                  background: darkTheme === false ? "#fcfcfc" : "#333",
                  padding: "2rem 1rem",
                }}
              >
                <div
                  style={{
                    color: darkTheme === false ? "#555" : "#ffdf10",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "500",
                    gap: "1rem",
                  }}
                >
                  <p style={{ fontSize: "14px" }}>Total Balance (USDT)</p>
                  {visible ? (
                    <AiFillEyeInvisible
                      onClick={handleVisibility}
                      fontSize={20}
                      fontWeight="bold"
                    />
                  ) : (
                    <AiFillEye
                      onClick={handleVisibility}
                      fontSize={20}
                      fontWeight="bold"
                    />
                  )}
                </div>

                {visible ? (
                  <CurrencyFormat
                    value={userData && userData.balance.toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    k
                    renderText={(value) => (
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: "18px",
                          color: darkTheme === false ? "#555" : "#fff",
                        }}
                      >
                        {value}
                      </p>
                    )}
                  />
                ) : (
                  <p
                    style={{
                      fontWeight: "700",
                      fontSize: "18px",
                      color: darkTheme === false ? "#555" : "#fff",
                    }}
                  >
                    ****
                  </p>
                )}
                {visible ? (
                  <CurrencyFormat
                    value={userData && userData.balance.toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    renderText={(value) => (
                      <p
                        style={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: darkTheme === false ? "#555" : "#fff",
                        }}
                      >
                        {" "}
                        ≈ {value}
                      </p>
                    )}
                  />
                ) : (
                  <p
                    style={{
                      fontWeight: "400",
                      fontSize: "14px",
                      color: darkTheme === false ? "#555" : "#fff",
                    }}
                  >
                    ****
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    margin: "1rem auto 0 auto",
                    width: "100%",
                  }}
                >
                  <button
                    style={{
                      border: "none",
                      padding: ".5rem 3rem",
                      borderRadius: "4px",
                      color: "#000",
                      fontSize: "12px",
                      background:
                        darkTheme === false ? primaryColor : "#ffdf10",
                    }}
                    onClick={() => {
                      navigate("/deposit");
                      setRoute("/deposit");
                    }}
                  >
                    Deposit
                  </button>
                  <button
                    style={{
                      border: "none",
                      padding: ".5rem 3rem",
                      borderRadius: "4px",
                      color: "#000",
                      fontSize: "12px",
                      background: "",
                    }}
                    onClick={() => {
                      navigate("/withdraw_funds");
                      setRoute("/withdraw_funds");
                    }}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div>
          <div className={classes.dMain}>
            <div className={classes.dWallet}>
              <div
                style={{
                  borderBottom: "1px #e1e1e1 solid",
                  padding: "0 0 .4rem 0",
                }}
              >
                <h1 style={{ color: primaryColor, fontSize: "32px" }}>
                  My Wallet
                </h1>
              </div>
              <div className={classes.dTabs}>
                <div className={classes.dMoneyValues}>
                  <div>
                    {visible ? (
                      <AiFillEyeInvisible
                        onClick={handleVisibility}
                        fontWeight="bold"
                        style={{
                          color: primaryColor,
                          fontSize: "30px",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <AiFillEye
                        onClick={handleVisibility}
                        fontWeight="bold"
                        style={{
                          color: primaryColor,
                          fontSize: "30px",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </div>
                  <div className={classes.dBalance}>
                    <h3>Total Balance</h3>
                    <p>
                      {visible ? (
                        <CurrencyFormat
                          value={userData && userData.balance.toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                          k
                          renderText={(value) => (
                            <p
                              style={{
                                fontWeight: "600",
                                fontSize: "18px",
                                color: darkTheme === false ? "#555" : "#fff",
                              }}
                            >
                              {value}
                            </p>
                          )}
                        />
                      ) : (
                        "*****"
                      )}
                    </p>
                    <span>
                      {" "}
                      {visible ? (
                        <CurrencyFormat
                          value={userData && userData.balance.toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                          k
                          renderText={(value) => (
                            <p
                              style={{
                                fontWeight: "300",
                                fontSize: "14px",
                                color: darkTheme === false ? "#555" : "#fff",
                              }}
                            >
                              {" "}
                              ≈{value}
                            </p>
                          )}
                        />
                      ) : (
                        "*****"
                      )}
                    </span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    navigate("/deposit");
                    setRoute("/deposit");
                  }}
                  style={{ background: primaryColor }}
                  className={classes.dButtons}
                >
                  <h3>Deposit</h3>
                </div>
                <div
                  onClick={() => {
                    navigate("/withdraw_funds");
                    setRoute("/withdraw_funds");
                  }}
                  style={{ background: "#e1e1e1" }}
                  className={classes.dButtons}
                >
                  <h3>Withdraw</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
