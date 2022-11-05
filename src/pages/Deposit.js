import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core";
import Code from "../assets/qrcode.jpg";
import { useNavigate } from "react-router-dom";
import { onSnapshot, doc } from "firebase/firestore";
import db from "../store/server.config";
import { GlobalContext } from "../store/context";
import axios from "axios";
import { Tooltip, IconButton } from "@material-ui/core";

const primaryColor = "#F0B90B";
const primaryColorDark = "#393091";
const icons = "#f0bb0b6d";
const iconsLight = "#f0bb0b6d";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const myStyles = makeStyles((theme) => ({
  container: {
    // width: "90%",
    // height: "70vh",
    margin: "auto",
    padding: "3rem 20px",
    [theme.breakpoints.up("sm")]: {
      width: "500px",
      padding: "4rem 0 0 0",
    },
  },
  container2: {
    maxWidth: "90%",
    minWidth: "90%",
    margin: "auto",
  },
  head: {
    color: "#212121",
    marginBottom: "2rem",
    color: primaryColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    gap: "1rem",
    "& i": {
      fontSize: "20px",
      padding: "8px 3px 0 0",
      height: "35px",
      width: "35px",
      borderRadius: "50%",
      "&:active": {
        background: "#888",
      },
    },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  button: {
    display: "flex",
    border: "none",
    background: " none ",
    borderBottom: ".5px #4439AC solid",
    minWidth: "100%",
    padding: "1.5rem 0",
    alignItems: "center",
    gap: "1rem",
    "&:active": {
      background: "#eee",
    },
  },
  iconsDiv: {
    height: "45px",
    width: "45px",
    borderRadius: "50%",
    background: "#eee",
    position: "relative",
    "& i": {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -60%)",
      color: "#F0B90B",
      fontSize: "16px",
    },
  },
  peeDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: ".4rem",
  },
  textDiv: {
    display: "flex",
    justifyContent: "space-between",
    flex: "1",
  },
  qrCode: {
    // height: "10rem",
    width: "60%",
    aspectRatio: "1",
    // background: "#ccc",
    margin: "auto",
  },
  details: {
    width: "85%",
    margin: " 2.5rem auto ",
    "& h4": {
      textAlign: "left",
      fontSize: "14px",
      color: "#333",
    },
    "& p": {
      fontWeight: "300",
      textOverflow: "ellipsis",
      width: "70%",
      overflow: "hidden",
      textAlign: "left",
      margin: ".3rem 0 0 0",
      color: "#888",
    },
    "& i": {
      fontSize: "20px",
      color: primaryColor,

      // margin: "0 0 .3rem 0"
    },
  },
  depositInfo: {
    width: "100%",
    // background: "rgba(240, 185, 11, 0.4)",
    background: iconsLight,
    padding: "1rem 1rem",
    borderRadius: "5px",
    color: "#333",
    "& h5": {
      fontWeight: "normal",
      fontSize: "14px",
    },
    "& p": {
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
  buttonDiv: {
    margin: "2.5rem 0 0 0",
    display: "flex",
    gap: "1rem",
    padding: "0 0 2rem 0",
  },
  darkButton: {
    fontFamily: "Poppins,sans-serif",
    fontWeight: "500",
    border: "none",
    padding: "1rem ",
    width: "100%",
    color: "#333",
    borderRadius: "5px",
    transition: ".2s ease all",
    "&:active": {
      background: icons,
    },
  },
  lightButton: {
    fontFamily: "Poppins,sans-serif",
    border: "none",
    padding: "1rem ",
    width: "100%",
    borderRadius: "5px",
    transition: ".2s ease all",
    "&:active": {
      background: "#111",
    },
  },
  dMain: {
    width: "94%",
    margin: "3rem auto 0 auto",
    border: "1px  #e1e1e1 solid",
    padding: "2rem 1rem",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  dMain2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "90%",
    margin: "auto",
  },
  dContainer: {
    width: "50%",
    aspectRatio: "1",
    border: "1px solid",
    borderColor: primaryColor,
    padding: ".2rem",
    borderRadius: "6px",
  },
  dBarcode: {
    // background: "blue",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: "1",
  },
  dDetails: {
    width: "60%",
    flex: "1.5",
  },
}));

const Deposit = () => {
  const [userData, setUserData] = useState();
  const { darkTheme } = useContext(GlobalContext);
  const [qrCodeData, setQrCodeData] = useState();
  const [errors, setErrors] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error(err);
      setCopied(false);
    }
  };

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/wallet");
  };

  const getEmailDetails = async () => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), async (snapshot) => {
          setUserData(snapshot.data());
          await axios
            .get(
              `https://api.cryptapi.io/trc20/usdt/qrcode/?address=${
                snapshot.data().cryptoWalletAddress
              }`
            )
            .then((res) => {
              if (res.data.payment_uri === "undefined") {
                setErrors(
                  "No QR Code available, please contact customer support."
                );
              }
              setQrCodeData(res.data);
              console.log(res.data);
            });
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getEmailDetails();
  }, []);

  const getPhonDetails = async () => {
    const phone = localStorage.getItem("PhoneNumber");
    if (phone) {
      try {
        onSnapshot(doc(db, "users", phone), async (snapshot) => {
          setUserData(snapshot.data());
          await axios
            .get(
              `https://api.cryptapi.io/trc20/usdt/qrcode/?address=${
                snapshot.data().cryptoWalletAddress
              }`
            )
            .then((res) => {
              setQrCodeData(res.data);
            });
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getPhonDetails();
  }, []);

  const classes = myStyles();

  const theme = useTheme();

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
          className={classes.container}
          style={{
            background: darkTheme === false ? "#fff" : "#333",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <div className={classes.head}>
            <i
              class="fa fa-chevron-left"
              onClick={() => goBack()}
              aria-hidden="true"
              style={{
                color: darkTheme === false ? primaryColor : "#ffdf10",
                background: darkTheme === false ? "#333" : "#777",
              }}
            ></i>
            <h2
              style={{ color: darkTheme === false ? primaryColor : "#ffdf10" }}
            >
              Deposit USDT
            </h2>
          </div>
          <div
            style={{
              width: "100%",
              borderBottom: ".5px #F0B90B solid",
              padding: "0 0 2.5rem 0",
            }}
          >
            <div className={classes.container2}>
              <div className={classes.qrCode}>
                {errors ? (
                  <p>{errors}</p>
                ) : (
                  <img
                    style={{ width: "100%" }}
                    src={`data:image/png;base64,${
                      qrCodeData && qrCodeData.qr_code
                    }`}
                    alt="qrcode"
                  />
                )}
              </div>
            </div>
            <p style={{ fontSize: "12px", marginTop: "1rem", color: subTexts }}>
              Send only USDT to this deposit address
            </p>
          </div>
          <div className={classes.details}>
            <h4 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
              Network
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>TRC 20</p>
              <i
                class="fa fa-exchange"
                aria-hidden="true"
                style={{
                  color: darkTheme === false ? primaryColor : "#ffdf10",
                }}
              ></i>
            </div>
          </div>
          <div className={classes.details}>
            <h4 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
              USDT Deposit Address
            </h4>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>{userData && userData.cryptoWalletAddress}</p>
              <Tooltip title={copied ? "Copied to clipboard" : "copy"}>
                <IconButton>
                  <i
                    class="fa fa-clone"
                    aria-hidden="true"
                    style={{
                      color: darkTheme === false ? primaryColor : "#ffdf10",
                    }}
                    onClick={() =>
                      copyToClipboard(userData && userData.cryptoWalletAddress)
                    }
                  ></i>
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className={classes.details}>
            <div
              style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
            >
              <h4 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                Selected Wallet{" "}
              </h4>
              <i
                class="fa fa-exclamation-circle"
                aria-hidden="true"
                style={{
                  color: darkTheme === false ? primaryColor : "#ffdf10",
                }}
              ></i>
            </div>
            <div
              style={{
                display: "flex",
                flex: "1",
                justifyContent: "space-between",
              }}
            >
              <p>Main Wallet</p>
            </div>
          </div>
          <div className={classes.depositInfo}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h5 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                Minimum deposit
              </h5>
              <p style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                10 USDT
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.dMain}>
          <div
            style={{
              borderBottom: "1px #e1e1e1 solid",
              padding: "0 0 0.4rem 0",
              width: "fit-content",
            }}
          >
            <h1
              style={{
                color: primaryColor,
                fontSize: "32px",
                textAlign: "left",
              }}
            >
              Deposit
            </h1>
          </div>
          <div className={classes.dMain2}>
            <div className={classes.dBarcode}>
              <div className={classes.dContainer}>
                {errors ? (
                  <p>{errors}</p>
                ) : (
                  <img
                    style={{ width: "100%" }}
                    src={`data:image/png;base64,${
                      qrCodeData && qrCodeData.qr_code
                    }`}
                    alt="qrcode"
                  />
                )}
              </div>
              <p
                style={{
                  fontSize: "12px",
                  marginTop: "1rem",
                  color: primaryColor,
                }}
              >
                Send only USDT to this deposit address
              </p>
            </div>
            <div className={classes.dDetails}>
              <div className={classes.details}>
                <h4 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                  Network
                </h4>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>TRC 20</p>
                  <i
                    class="fa fa-exchange"
                    aria-hidden="true"
                    style={{
                      color: darkTheme === false ? primaryColor : "#ffdf10",
                    }}
                  ></i>
                </div>
              </div>
              <div className={classes.details}>
                <h4 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                  USDT Deposit Address
                </h4>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>{userData && userData.cryptoWalletAddress}</p>
                  <Tooltip title={copied ? "Copied to clipboard" : "copy"}>
                    <IconButton>
                      <i
                        class="fa fa-clone"
                        aria-hidden="true"
                        style={{
                          color: darkTheme === false ? primaryColor : "#ffdf10",
                        }}
                        onClick={() =>
                          copyToClipboard(
                            userData && userData.cryptoWalletAddress
                          )
                        }
                      ></i>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className={classes.details}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <h4 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                    Selected Wallet{" "}
                  </h4>
                  <i
                    class="fa fa-exclamation-circle"
                    aria-hidden="true"
                    style={{
                      color: darkTheme === false ? primaryColor : "#ffdf10",
                    }}
                  ></i>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: "1",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Main Wallet</p>
                </div>
              </div>
              <div className={classes.depositInfo}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <h5 style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                    Minimum deposit
                  </h5>
                  <p style={{ color: darkTheme === false ? "#333" : "#fff" }}>
                    10 USDT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;
