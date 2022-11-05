import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../store/context";
import { BiHomeCircle } from "react-icons/bi";
import { AiOutlineBarChart } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import logo from "../../assets/logo.png";

const primaryColor = "#F0B90B";
const primaryColorDark = "#333";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";
const borderFooter = "6px #F0B90B solid";

const useStyles = makeStyles({
  firstContainer: {
    background: "#111",
    width: "100%",
    padding: "5rem 0px",
  },
  container: {
    background: "",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    margin :"auto"
  },
  leftSide: {
    textAlign: "left",
    "& p": {
      color: "#f5f5f5",
      fontSize: "14px",
      fontWeight: "300"
    },
    "& span": {
      color: "#f5f5f5",
      fontSize: "10px",
      fontWeight: "300",
      lineHeight: "8px",
    }
  },
  rightSide: {
    display: "flex",
    "& p": {
      color: primaryColor,
      fontSize: "12px",
      fontWeight: "600",
      margin: "0 0 1rem 0"
    },
    "& a": {
      color: "#f5f5f5",
      fontSize: "12px",
      fontWeight: "300"
    }
  },
  logo: {
    width: "100px",
    color: primaryColor,
    fontWeight: "600",
    fontSize: "30px",
  },
  rightSideBox: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    margin: "0px 20px",
  },
  footerLink: {
    color: "#ccc",
    margin: "5px 0px",
  },
  mobileFooter: {
    position: "fixed",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
    bottom: 0,
    justifyContent: "space-evenly",
    width: "100%",
    background: "#fff",
    borderTop: "0.5px solid #ccc",
    padding: "20px 0 0 0px",
    transition: ".5s",
  },
});

const useDarkStyles = makeStyles({
  container: {
    background: "#F5F5F5",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "150px 100px",
    "& p": {
      fontSize: "12px",
    },
  },
  leftSide: {
    textAlign: "left",
  },
  rightSide: {
    display: "flex",
  },
  logo: {
    fontFamily: "Oleo Script Swash Caps",
    fontSize: 30,
    color: "#000",
    margin: "0px 20px",
    cursor: "pointer",
  },
  rightSideBox: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    margin: "0px 20px",
  },
  footerLink: {
    color: "#ccc",
    margin: "5px 0px",
  },
  mobileFooter: {
    position: "fixed",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
    bottom: 0,
    justifyContent: "space-evenly",
    width: "100%",
    background: "#333",
    borderTop: "0.5px solid #ccc",
    padding: "20px 0 0 0px",
    transition: ".5s",
  },
});

const Footer = () => {
  const classes = useStyles();
  const darkClasses = useDarkStyles();
  const navigate = useNavigate();
  const { user, darkTheme, setRoute } = useContext(GlobalContext);
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const name = localStorage.getItem("FirstName");

  const location = window.location.pathname;

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

  const authRoute = (param) => {
    if (name === null) {
      navigate("/login");
    } else {
      navigate(`/${param}`);
      setRoute(`/${param}`);
    }
  };

  return (
    <>
      {windowDimenion.winWidth < 768 ? (
        <>
          <div
            className={
              darkTheme === false
                ? classes.mobileFooter
                : darkClasses.mobileFooter
            }
          >
            <div
              style={{ display: "flex", flexDirection: "column" }}
              onClick={() => authRoute("")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0 0 1rem 0",
                  borderBottom:
                    location === "/"
                      ? `4px ${
                          darkTheme === false ? "#F0B90B" : "#ffdf10"
                        } solid `
                      : icons,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BiHomeCircle
                  style={{
                    color:
                      darkTheme === false && location === "/"
                        ? primaryColor
                        : darkTheme !== false && location === "/"
                        ? "#ffdf10"
                        : location !== "/" && darkTheme === false
                        ? primaryColorDark
                        : location !== "/" && darkTheme !== false
                        ? "fff"
                        : primaryColorDark,
                    fontSize: 20,
                  }}
                />
                <span
                  style={{
                    fontSize: 15,
                    color: darkTheme === false ? "#000" : "#fff",
                  }}
                >
                  <p style={{ fontSize: "12px" }}>Home</p>
                </span>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column" }}
              onClick={() => authRoute("trade")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0 0 1rem 0",
                  borderBottom:
                    location === "/trade"
                      ? `4px ${
                          darkTheme === false ? "#F0B90B" : "#ffdf10"
                        } solid `
                      : icons,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AiOutlineBarChart
                  style={{
                    color:
                      darkTheme === false && location === "/trade"
                        ? primaryColor
                        : darkTheme !== false && location === "/trade"
                        ? "#ffdf10"
                        : location !== "/trade" && darkTheme === false
                        ? primaryColorDark
                        : location !== "/trade" && darkTheme !== false
                        ? "fff"
                        : primaryColorDark,
                    fontSize: 20,
                  }}
                />
                <span
                  style={{
                    fontSize: 15,
                    color: darkTheme === false ? "#000" : "#fff",
                  }}
                >
                  <p style={{ fontSize: "12px" }}>Trade</p>
                </span>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column" }}
              onClick={() => authRoute("wallet")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0 0 1rem 0",
                  borderBottom:
                    location === "/wallet"
                      ? `4px ${
                          darkTheme === false ? "#F0B90B" : "#ffdf10"
                        } solid `
                      : icons,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BsWallet2
                  style={{
                    color:
                      darkTheme === false && location === "/wallet"
                        ? primaryColor
                        : darkTheme !== false && location === "/wallet"
                        ? "#ffdf10"
                        : location !== "/wallet" && darkTheme === false
                        ? primaryColorDark
                        : location !== "/wallet" && darkTheme !== false
                        ? "fff"
                        : primaryColorDark,

                    fontSize: 20,
                  }}
                />
                <span
                  style={{
                    color: darkTheme === false ? "#000" : "#fff",
                  }}
                >
                  <p style={{ fontSize: "12px" }}>Wallet</p>
                </span>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column" }}
              onClick={() => authRoute("my_account")}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0 0 1rem 0",
                  borderBottom:
                    location === "/my_account"
                      ? `4px ${
                          darkTheme === false ? "#F0B90B" : "#ffdf10"
                        } solid `
                      : icons,
                  transition: ".3s ease all",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <VscAccount
                  style={{
                    color:
                      darkTheme === false && location === "/my_account"
                        ? primaryColor
                        : darkTheme !== false && location === "/my_account"
                        ? "#ffdf10"
                        : location !== "/my_account" && darkTheme === false
                        ? primaryColorDark
                        : location !== "/my_account" && darkTheme !== false
                        ? "fff"
                        : primaryColorDark,
                    fontSize: 20,
                  }}
                />
                <span
                  style={{
                    color: darkTheme === false ? "#000" : "#fff",
                  }}
                >
                  <p style={{ fontSize: "12px" }}>Mine</p>
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={classes.firstContainer}>
          <div className={classes.container}>
            <div className={classes.leftSide}>
              <h3 className={classes.logo}>BiVestCoin</h3>
              <p>Exchange The Best Cryptocurrency</p>
              <span>Copyright © 2022 - All rights reserved. v3.2.0</span>
            </div>

            <div className={classes.rightSide}>
              {/*<div className={classes.rightSideBox}>
                 <p>Profile</p>
                 <Link to="/" className={classes.footerLink}>
                   About Us
                 </Link>
                 <Link to="/" className={classes.footerLink}>
                   Announcement
                 </Link>
               </div>

               <div className={classes.rightSideBox}>
                 <p>Help</p>
                 <Link to="/" className={classes.footerLink}>
                   FAQs
                 </Link>
                 <Link to="/" className={classes.footerLink}>
                   Trade Guide
                 </Link>
                 <Link to="/" className={classes.footerLink}>
                   Coins Information
                 </Link>
               </div> */}

              <div className={classes.rightSideBox}>
                <p>Terms</p>
                <Link to="/terms_and_conditions" className={classes.footerLink}>
                  Disclaimer
                </Link>
                <Link to="/terms_and_conditions" className={classes.footerLink}>
                  Privacy Policy
                </Link>
                <Link to="/terms_and_conditions" className={classes.footerLink}>
                  Service Policy
                </Link>
                <Link to="/terms_and_conditions" className={classes.footerLink}>
                  Transaction Fee
                </Link>
              </div>

              {/* <div className={classes.rightSideBox}>
                 <p>Contact Us</p>
                 <Link to="/" className={classes.footerLink}>
                   Service Mailbox
                 </Link>
                 <Link to="/" className={classes.footerLink}>
                   Coorperation
                 </Link>
                 <Link to="/" className={classes.footerLink}>
                   Market Application
                 </Link>
                 <Link to="/" className={classes.footerLink}>
                   Report
                 </Link>
               </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
