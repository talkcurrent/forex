import { CircularProgress, makeStyles } from "@material-ui/core";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState, useContext, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../store/context";
import db, { auth } from "../store/server.config";
import { AiFillWarning } from "react-icons/ai";

const blue = "#2566E2";
const primaryColor = "#F0B90B";
const primaryColorDark = "#393091";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const myStyles = makeStyles({
  main: {
    fontFamily: "Poppins, sans-serif",
  },
  top: {
    padding: "1.2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
    color: "#555",
    borderBottom: "1px #d1d1d1 solid",
    "& h3": {
      width: "93%",
      fontSize: "15px",
      fontWeight: "700",
      textAlign: "center",
    },
  },
  chartItems: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0 0rem 0 1rem",
    "& h5": {
      width: "85%",
      fontSize: "12px",
      fontWeight: "500",
      textAlign: "center",
      lineHeight: "13px",
      margin: "1rem auto 1rem auto",
      color: "#555",
    },
  },
  chartItem: {
    display: "flex",
    padding: "1rem 0 0 0",
    alignItems: "center",
    justifyContent: "space-between",
    // background:"blue"
  },
  chart: {
    width: "65%",
    aspectRatio: "1",
    position: "relative",
    color: "#555",
  },
  items: {
    display: "flex",
    flexDirection: "column",
  },
  item: {
    padding: ".8rem 1rem .8rem 1rem",
    display: "flex",
    flexDirection: "column",
    margin: ".5rem 0 0 0",
    background: "#EEF3F9",
    cursor: "pointer",
    "& p": {
      fontSize: "10px",
      fontWeight: "600",
      color: "#B4B9BF",
      lineHeight: "14px",
      textAlign: "left",
    },
  },
  itemTop: {
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
    "& p": {
      fontSize: "12px",
      fontWeight: "600",
      color: "#565B64",
      lineHeight: "14px",
    },
    "& i": {
      color: "#bbb",
    },
  },
});

const SecurityCenter = () => {
  const {
    progressKYC,
    setEmailState,
    setPhoneState,
    userData,
    setFundPassword,
    setWalletAddress,
    setRoute,
    setAuthState,
  } = useContext(GlobalContext);
  const [message, setMessage] = useState(null);

  const [isPhoneBinding, setIsPhoneBinding] = useState(
    userData && userData.phone_number
  );
  const [isEmailBinding, setIsEmailBinding] = useState(
    userData && userData.email
  );
  const [isAuthentication, setIsAuthentication] = useState(
    userData && userData.authenticated
  );
  const [isFundPassword, setIsFundPassword] = useState(
    userData && userData.widthdrawal_pin
  );
  const [isWallet, setIsWallet] = useState(
    userData && userData.withdrawal_address
  );
  const classes = myStyles();
  const navigate = useNavigate();

  const updateKYCStatusEmail = async () => {
      const email = localStorage.getItem("Email");
      if(email){
        const docToUpdate = doc(db, "users", email);
        const q = await getDoc(docToUpdate);
        if (q.data().authenticated) {
          setEmailState(20);
          setPhoneState(20);
          setFundPassword(20);
          setWalletAddress(20);
          setAuthState(20);
        }
      }
  };

  const updateKYCStatusPhone = async () => {
      const phone = localStorage.getItem("PhoneNumber");
      if(phone) {
        const docToUpdate = doc(db, "users", phone);
        const q = await getDoc(docToUpdate);
        if (q.data().authenticated) {
          setEmailState(20);
          setPhoneState(20);
          setFundPassword(20);
          setWalletAddress(20);
          setAuthState(20);
        }
      }
  };

  useEffect(() => {
    if (isEmailBinding) {
      setEmailState(20);
    }

    if (isPhoneBinding) {
      setPhoneState(20);
    }

    if (isFundPassword) {
      setFundPassword(20);
    }

    if (isWallet) {
      setWalletAddress(20);
    }

    if (isAuthentication) {
      setAuthState(20);
    }

    updateKYCStatusEmail();
    updateKYCStatusPhone();
  }, []);

  return (
    <div className={classes.main}>
      <div className="referrals-top container">
        <BiChevronLeft fontSize={25} />
        <p>Security Center</p>
        <span> </span>
      </div>
      <div className={classes.chartItems}>
        <h5>Complete the security settings, your funds are more secure</h5>
        <div className={classes.chartItem}>
          <div className={classes.chart}>
            <CircularProgressbar
              value={progressKYC}
              styles={buildStyles({
                backgroundColor: "#fafafa",
                trailColor: "#f5f5f5",
                pathColor: primaryColor,
              })}
            />
            <div
              style={{
                color: "#555",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <h1
                style={{
                  fontSize: "56px",
                  color: "#555",
                  margin: "0",
                  fontWeight: "600",
                  fontFamily: "Poppins, sans-serif",
                  letterSpacing: "-6px",
                  lineHeight: "40px",
                }}
              >
                {progressKYC}{" "}
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: "400",
                  }}
                >
                  %
                </span>
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  lineHeight: "12px",
                  fontWeight: "600",
                  color: "#bbb",
                }}
              >
                Completion rate
              </p>
            </div>
          </div>
          <div className={classes.items}>
            <div
              onClick={() => {
                setRoute("/account_settings");
                navigate("/account_settings");
              }}
              className={classes.item}
            >
              <div className={classes.itemTop}>
                {isPhoneBinding ? (
                  <i
                    class="fa fa-unlock-alt"
                    style={{ color: primaryColor }}
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i class="fa fa-lock" aria-hidden="true"></i>
                )}
                <p>1000000</p>
              </div>
              <p>Phone Binding</p>
            </div>
            <div
              onClick={() => {
                if (!isPhoneBinding) {
                  setMessage("Please complete your phone number verification.");
                  return;
                }
                setRoute("/account_settings");
                navigate("/account_settings");
              }}
              className={classes.item}
            >
              <div className={classes.itemTop}>
                {isEmailBinding ? (
                  <i
                    class="fa fa-unlock-alt"
                    style={{ color: primaryColor }}
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i class="fa fa-lock" aria-hidden="true"></i>
                )}
                <p>1000000</p>
              </div>
              <p>Email binding</p>
            </div>
            <div
              onClick={() => {
                if (!isPhoneBinding || !isEmailBinding) {
                  setMessage("Please complete your email and phone number verification.");
                  return;
                }
                setRoute("/account_settings");
                navigate("/account_settings");
              }}
              className={classes.item}
            >
              <div className={classes.itemTop}>
                {isFundPassword ? (
                  <i
                    class="fa fa-unlock-alt"
                    style={{ color: primaryColor }}
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i class="fa fa-lock" aria-hidden="true"></i>
                )}
                <p>1000000</p>
              </div>
              <p>Fund password</p>
            </div>
            <div
              onClick={() => {
                if (!isPhoneBinding || !isEmailBinding || !isFundPassword) {
                  setMessage("Please set your fund password first.");
                  return;
                }
                setRoute("/account_settings");
                navigate("/account_settings");
              }}
              className={classes.item}
            >
              <div className={classes.itemTop}>
                {isWallet ? (
                  <i
                    class="fa fa-unlock-alt"
                    style={{ color: primaryColor }}
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i class="fa fa-lock" aria-hidden="true"></i>
                )}
                <p>1000000</p>
              </div>
              <p>Binding Wallet address</p>
            </div>

            <div
              onClick={() => {
                if (
                  !isPhoneBinding ||
                  !isEmailBinding ||
                  !isFundPassword ||
                  !isWallet
                ) {
                  setMessage("Please set your withdrawal address first.");
                  return;
                }
                setRoute("/authentication");
                navigate("/authentication");
              }}
              className={classes.item}
            >
              <div className={classes.itemTop}>
                {isAuthentication ? (
                  <i
                    class="fa fa-unlock-alt"
                    style={{ color: primaryColor }}
                    aria-hidden="true"
                  ></i>
                ) : (
                  <i class="fa fa-lock" aria-hidden="true"></i>
                )}
                <p>1000000</p>
              </div>
              <p>Authentication</p>
            </div>
          </div>
        </div>

          {message && (
            <div style={{marginTop: 20}} >
              <AiFillWarning style={{fontSize: 30}}  />
              <p>{message}</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default SecurityCenter;
