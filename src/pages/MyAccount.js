import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { GlobalContext } from "../store/context";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import Footer from "../components/Home/Footer";
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
import db from "../store/server.config";
import { IoMdSunny, IoMdNotifications } from "react-icons/io";
import { BsFillMoonFill } from "react-icons/bs";
import { BiChevronRight, BiChevronLeft, BiCreditCard } from "react-icons/bi";
import {
  MdVerified,
  MdLiveHelp,
  MdOutlineSupportAgent,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { RiVipFill } from "react-icons/ri";
import { HiUserAdd } from "react-icons/hi";
// import { GrSecure } from "react-icons/gr";
import {
  AiFillGift,
  AiFillDollarCircle,
  AiFillSecurityScan,
  AiTwotoneSetting,
} from "react-icons/ai";
import { GoUnverified } from "react-icons/go";
import { BiUserCheck } from "react-icons/bi";
import Sidebar from "../components/Home/Sidebar";
import user from "../assets/me.jpg";
import { Tooltip, IconButton } from "@material-ui/core";
import { TbCopy } from "react-icons/tb";

const firstname = localStorage.getItem("FirstName");

const primaryColor = "#F0B90B";
const primaryColorDark = "#333";
const icons = "#f0bb0b6d";
const iconsLight = "#f0bb0b6d";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";
const redTexts = " #BA0400";
const redBack = " #FFBAB8";
const greenTexts = " #136000";
const greenBack = " #B2FF9C";
const dark = "#333";

const useStyles = makeStyles((theme) => ({
  container: {
    fontFamily: "Poppins, sans-serif",
    padding: "0 0 0 0 ",
    transition: ".5s",
    "& p": {
      fontSize: "12px",
    },
  },
  header: {
    textAlign: "left",
    padding: 10,
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
    bottom: 0,
    justifyContent: "space-evenly",
    width: "100%",
    padding: "20px 0px",
    marginTop: 50,
  },
  iconContainerSmall: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
    bottom: 0,
    justifyContent: "space-evenly",
    width: "100%",
    padding: "20px 0px",
    marginTop: 0,
  },
  input: {
    outline: "none",
    fontSize: "18px",
    fontWeight: "600",
    color: primaryColorDark,
    background: iconsLight,
    padding: ".5rem 4rem",
    borderRadius: "100px",
    border: "none",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
  pageLoad: {
    display: "flex",
    alignItems: "flex-start",
    transition: ".2s ease all",
  },
  right: {
    flex: "4",
    // background: "blue",
    transition: ".3s ease all",
  },
  dMain: {
    width: "100%",
    margin: "auto",
    padding: "3rem 0",
  },
  dTop: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    border: "1px solid",
    borderColor: "#e1e1e1",
    width: "94%",
    margin: "auto",
    borderRadius: "10px",
    padding: "2rem 1rem",
    // boxShadow:"1px 2px 6px rgba(0, 0, 0, 0.2)",
  },
  userImage: {
    width: "8%",
    aspectRatio: "1",
    background: primaryColor,
    border: "2px #fff solid",
    borderRadius: "50%",
    overflow: "hidden",
    "& img": {
      width: "100%",
    },
  },
  userDetails: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  nameVerified: {
    display: "flex",
    gap: ".6rem",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  secondSection: {
    width: "94%",
    margin: "1rem auto 0 auto",

    borderRadius: "10px",
    // border: "1px solid",
    display: "flex",
    justifyContent: "space-between",
  },
  secondSectionCards: {
    background: "none",
    width: "32%",
    aspectRatio: "1.7",
    borderRadius: "10px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#e1e1e1",
    border: "1px solid",
    color: "#333",
    padding: "1rem 0",
    "& button": {
      cursor: "pointer",
    },
  },
  activitiesSection: {
    width: "94%",
    margin: "1rem auto 0 auto",

    borderRadius: "10px",
    border: "1px solid",
    borderColor: "#e1e1e1",
    display: "flex",
    justifyContent: "space-between",
  },
  trades: {
    width: "100%",
    height: "40vh",
  },
  verifBar: {
    width: "100%",
  },
  progBar: {
    width: "200px",
    height: "1rem",
    border: "1px solid",
    borderColor: "#e1e1e1",
    borderRadius: "10px",
    overflow: "hidden",
  },
  progress: {},
}));

const useDarkStyles = makeStyles({
  container: {
    fontFamily: "Poppins, sans-serif",
    padding: "0 0 0 0 ",
    background: "#333",
    transition: ".5s",
  },
  header: {
    textAlign: "left",
    padding: 10,
  },
  headerText: {
    color: "#fff",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
    bottom: 0,
    justifyContent: "space-evenly",
    width: "100%",
    padding: "20px 0px",
    marginTop: 50,
  },
  iconContainerSmall: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
    bottom: 0,
    justifyContent: "space-evenly",
    width: "100%",
    padding: "20px 0px",
    marginTop: 0,
  },
  input: {
    outline: "none",
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
    background: "#70622c94",
    padding: ".5rem 4rem",
    borderRadius: "100px",
    border: "none",
    fontFamily: "Poppins, sans-serif",
    width: "100%",
    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
});

const MyAccount = () => {
  const classes = useStyles();
  const darkClasses = useDarkStyles();
  const { darkTheme, setDarkTheme, setRoute, progressKYC } =
    useContext(GlobalContext);
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const [progress, setProgress] = useState('"' + progressKYC + '"');
  const [requests, setRequests] = useState();
  const [userData, setUserData] = useState();
  const [theme, setTheme] = useState("light");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
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

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  const makeVisible = () => {
    setVisible(true);
    alert("I am visible");
  };
  const makeInvisible = () => {
    setVisible(false);
    alert("I am invisible");
  };

  useEffect(() => {
    const progss = JSON.parse(localStorage.getItem("identityDetails"));
  }, []);

  console.log("progress" + progress);

  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(progress));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    //conole.log(windowDimenion);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      // const qry = doc(db, "users", phone_number);
      try {
        onSnapshot(doc(db, "users", email), (snapshot) => {
          setUserData(snapshot.data());
          if (snapshot.data().authenticated) {
            setVerified(true);
          }
          const q = query(
            collection(db, "requests"),
            where("trader_id", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          onSnapshot(q, (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
              list.push({ ...doc.data(), id: doc.id });
              setRequests(list);
            });
          });
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    const phone = localStorage.getItem("PhoneNumber");
    if (phone) {
      // const qry = doc(db, "users", phone_number);
      try {
        onSnapshot(doc(db, "users", phone), (snapshot) => {
          setUserData(snapshot.data());
          if (snapshot.data().authenticated) {
            setVerified(true);
          }
          const q = query(
            collection(db, "requests"),
            where("trader_id", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          onSnapshot(q, (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
              list.push({ ...doc.data(), id: doc.id });
              setRequests(list);
            });
          });
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  const navigateToScreen = (route) => {
    navigate(`/${route}`);
    setRoute(`/${route}`);
  };

  return (
    <div
      className={
        darkTheme === false ? classes.container : darkClasses.container
      }
      style={{ height: windowDimenion.winHeight }}
    >
      <div className="account-top">
        <BiChevronLeft
          fontSize={25}
          onClick={() => {
            navigate("/");
          }}
        />
        <p>My Account</p>
        <span></span>
      </div>
      {windowDimenion.winWidth < 768 ? (
        <div
          style={{
            height:
              windowDimenion.winHeight === 667 &&
              windowDimenion.winWidth === 375
                ? 750
                : 667,
          }}
        >
          <div
            style={{
              display: " flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "94%",
              margin: "0 auto 0 auto",
              gap: ".8rem",
              color: primaryColorDark,
              fontSize: "14px",
              fontWeight: "500",
              padding: "1rem 0rem 1rem 0",
            }}
          >
            <p
              className={
                darkTheme === false
                  ? classes.headerText
                  : darkClasses.headerText
              }
              style={{ fontSize: "12px", fontWeight: "500" }}
            >
              {darkTheme === false ? "Turn on dark mode" : "Turn off dark mode"}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: iconsLight,
                // padding: ".3rem .6rem",
                width: "3.5rem",
                height: "1.6rem",
                borderRadius: "50px",
                position: "relative",
                background: darkTheme === false ? dark : "#f5f5f5",
                color: darkTheme === false ? iconsLight : dark,
                transition: ".5s ease all",
                padding: "0 1px",
              }}
            >
              <div
                style={{
                  background: darkTheme === false ? "#ccc" : dark,
                  color: darkTheme === false ? dark : "#f5f5f5",
                  height: " 20px",
                  width: "20px",
                  borderRadius: "100%",
                  padding: "0px",
                  left: darkTheme === false ? "5%" : "60%",
                  transition: ".5s ease all",
                  position: " absolute",
                }}
              >
                {darkTheme === false ? (
                  <BsFillMoonFill
                    style={{
                      fontSize: 12,
                      // color: primaryColorDark,
                      lineHeight: "1px",
                    }}
                    onClick={() => {
                      setTheme("dark");
                      setDarkTheme(true);
                    }}
                  />
                ) : (
                  <IoMdSunny
                    style={{
                      fontSize: 12,
                      // color: primaryColorDark,
                      lineHeight: "1px",
                    }}
                    onClick={() => {
                      setTheme("light");
                      setDarkTheme(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              background: darkTheme === false ? "#484848" : "#484848",
              width: "100%",
              height: 0.5,
            }}
          />
          <div className={classes.header}>
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    color: darkTheme === false ? primaryColor : "#ffdf10",
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
                  Hi, {userData ? userData.firstname : firstname}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 5,
                    borderRadius: 5,
                    fontSize: "10px",
                  }}
                >
                  {verified ? (
                    <>
                      <MdVerified
                        style={{
                          fontSize: 14,
                          marginRight: 5,
                          color: greenTexts,
                        }}
                      />
                      <p style={{ color: greenTexts }}>Verified</p>
                    </>
                  ) : (
                    <>
                      <GoUnverified
                        style={{
                          fontSize: 14,
                          marginRight: 5,
                          color: redTexts,
                        }}
                      />
                      <p style={{ color: redTexts }}>Unverified</p>
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p
                  style={{
                    fontSize: 13,
                    color: darkTheme === false ? "#333" : "#fff",
                  }}
                >
                  ID: {userData && truncateString(userData.id, 6)}
                </p>
                <Tooltip title={copied ? "Copied to clipboard" : "copy"}>
                  <IconButton>
                    <TbCopy
                      style={{ cursor: "pointer" }}
                      onClick={() => copyToClipboard(userData && userData.id)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>

          <div
            style={{
              marginBottom: 0,
              background: darkTheme === false ? "#333" : "rgb(88, 88, 88)",
              width: "96%",
              margin: "auto",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                margin: "18px 0px",
                color: darkTheme === false ? primaryColor : "#ffdf10",
              }}
              onClick={() => navigateToScreen("reward_center")}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <AiFillGift style={{ fontSize: 25 }} />
                <p style={{ marginLeft: 10 }}>Reward Center</p>
              </div>

              <div></div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                margin: "18px 0px",
                color: darkTheme === false ? primaryColor : "#ffdf10",
              }}
              onClick={() => navigateToScreen("referral")}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <HiUserAdd style={{ fontSize: 25 }} />
                <p style={{ marginLeft: 10 }}>Referral</p>
              </div>

              <div></div>
            </div>
          </div>

          <div
            style={{
              background: darkTheme === false ? iconsLight : "#70622c94",
              width: "96%",
              margin: "auto",
              borderRadius: "10px",
              padding: ".1rem 0 .1rem 0",
              color: darkTheme === false ? primaryColorDark : "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 10px 10px 10px",
                margin: "18px 0px",
                // background: iconsLight,
              }}
              onClick={() => navigateToScreen("authentication")}
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => navigateToScreen("authentication")}
              >
                <BiCreditCard style={{ fontSize: 25 }} />
                <p style={{ marginLeft: 10 }}>Authentication</p>
              </div>

              <div></div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                margin: "18px 0px",
              }}
              onClick={() => navigateToScreen("security_center")}
            >
              <div
                onClick={() => navigateToScreen("security_center")}
                style={{ display: "flex", alignItems: "center" }}
              >
                <AiFillSecurityScan style={{ fontSize: 25 }} />
                <p style={{ marginLeft: 10 }}>Security Center</p>
              </div>

              <div></div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                margin: "18px 0px",
              }}
              onClick={() => {
                navigate("/account_settings");
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <AiTwotoneSetting style={{ fontSize: 25 }} />
                <p style={{ marginLeft: 10 }}>Settings</p>
              </div>

              <div></div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 10,
                margin: "18px 0px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => {
                  navigate("/transaction_details");
                }}
              >
                <MdLiveHelp style={{ fontSize: 25 }} />
                <p style={{ marginLeft: 10 }}>Transaction Details</p>
              </div>

              <div></div>
            </div>
          </div>

          <Footer />
        </div>
      ) : (
        <div>
          <div className={classes.dMain}>
            <div className={classes.dTop}>
              {/* <div className={classes.userImage}>
                  <img src={ user } alt="user.jpg"/>
                </div> */}
              <div className={classes.userDetails}>
                <div className={classes.nameVerified}>
                  <h1 style={{ color: primaryColor, textAlign: "left" }}>
                    Hi, {userData ? userData.firstname : firstname}{" "}
                  </h1>
                  {verified ? (
                    <>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <MdVerified
                          style={{
                            fontSize: 14,
                            marginRight: 5,
                            color: greenTexts,
                          }}
                        />
                        <p style={{ color: greenTexts }}>Verified</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <GoUnverified
                          style={{
                            fontSize: 14,
                            marginRight: 5,
                            color: redTexts,
                          }}
                        />
                        <p style={{ color: redTexts }}>Unverified</p>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>ID: {userData && userData.id}</p>
                  <Tooltip title={copied ? "Copied to clipboard" : "copy"}>
                    <IconButton>
                      <TbCopy
                        style={{ cursor: "pointer" }}
                        onClick={() => copyToClipboard(userData && userData.id)}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div style={{ margin: ".5rem 0 0 0 " }}>
                  {verified ? null : (
                    <>
                      <div className={classes.verifBar}>
                        <p style={{ color: "green", margin: "0 0 .2rem 0" }}>
                          Verification progress: {progressKYC}%
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: ".5rem",
                          }}
                        >
                          <div className={classes.progBar}>
                            <div
                              style={{
                                background: primaryColor,
                                height: "100%",
                                width: progressKYC * 2,
                              }}
                            >
                              {" "}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setRoute("/security_center");
                              navigate("/security_center");
                            }}
                            style={{
                              background: "#555",
                              border: "none",
                              padding: ".2rem .6rem",
                              fontSize: "10px",
                              borderRadius: "4px",
                              color: "#fff",
                              "&:hover": { background: "#444" },
                            }}
                          >
                            Complete verification
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* ============================================================== end of top div, start of second section */}
            <div className={classes.secondSection}>
              <div className={classes.secondSectionCards}>
                <div
                  style={{
                    width: "90%",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    padding: ".2rem .6rem",
                    justifyContent: "space-between",
                    margin: " 0 0 2rem 0",
                  }}
                >
                  {visible ? (
                    <MdOutlineVisibilityOff
                      onClick={() => {
                        setVisible(!visible);
                      }}
                      style={{ color: primaryColor, fontSize: "26px" }}
                    />
                  ) : (
                    <MdOutlineVisibility
                      onClick={() => {
                        setVisible(!visible);
                      }}
                      style={{ color: primaryColor, fontSize: "26px" }}
                    />
                  )}
                  <div style={{ flex: "1" }}>
                    <h3>My balance</h3>
                    <p>
                      {visible ? (
                        <p style={{ fontSize: "22px", fontWeight: "600" }}>
                          ${userData ? userData.balance.toFixed(4) : "0.00"}{" "}
                        </p>
                      ) : (
                        <p
                          style={{
                            fontSize: "22px",
                            fontWeight: "600",
                            color: primaryColor,
                          }}
                        >
                          * * * *
                        </p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className={classes.secondSectionCards}>
                <div
                  style={{
                    width: "90%",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    padding: ".2rem .6rem",
                    justifyContent: "flex-start",
                    margin: " 0 0 2rem 0",
                  }}
                >
                  {/* {
                      visible ? <MdOutlineVisibilityOff onClick={()=> {setVisible(!visible)}} style={{color:primaryColor, fontSize:"26px", }} /> : <MdOutlineVisibility onClick={()=> {setVisible(!visible)}} style={{color:primaryColor, fontSize:"26px", }} />
                    } */}
                  <div style={{ flex: "1" }}>
                    <h3>My bonus</h3>
                    <p>
                      {visible ? (
                        <p style={{ fontSize: "22px", fontWeight: "600" }}>
                          ${userData ? userData.bonus.toFixed(4) : "0.00"}{" "}
                        </p>
                      ) : (
                        <p
                          style={{
                            fontSize: "22px",
                            fontWeight: "600",
                            color: primaryColor,
                          }}
                        >
                          * * * *
                        </p>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  navigate("/records");
                  setRoute("/records");
                }}
                className={classes.secondSectionCards}
              >
                <h3>My Trades</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".4rem",
                    margin: "1rem 0 .6rem 0",
                    height: "50%",
                    overflow: "hidden",
                  }}
                >
                  {requests ? (
                    requests.map((request) => (
                      <div
                        style={{
                          width: "100%",
                          borderBottom: "1px #e1e1e1 solid",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "2rem",
                        }}
                      >
                        <p
                          style={{
                            color: request.outcome === "Win" ? "green" : "red",
                          }}
                        >
                          {request.outcome}
                        </p>
                        <p>{request.time}</p>
                        <p
                          style={{
                            color: request.outcome === "Win" ? "green" : "red",
                          }}
                        >
                          $ {request.addition}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p></p>
                  )}
                </div>
                <p
                  className="see-all"
                  onClick={() => {
                    navigate("/records");
                    setRoute("/records");
                  }}
                >
                  see all...
                </p>
              </div>
            </div>
            {/* ============================================================== end of second section, start of activities section */}
            {/* <div className={classes.activitiesSection}>
                <div className={classes.trades} ></div>
              </div> */}
          </div>
          {window.innerWidth < 768 ? <Footer /> : null}
        </div>
      )}
    </div>
  );
};

//  {
//                      visible ? <h3>Balance: ${userData ? userData.balance.toFixed(4) : "0.00"} </h3> : <h3>Balance: * * * *</h3>
//                     }

export default MyAccount;

// userData ? userData.firstname : firstname
//  ID: {userData && userData.id}
