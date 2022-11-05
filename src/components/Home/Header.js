import React, { useState, useRef, useEffect, useContext } from "react";
import {
  AppBar,
  makeStyles,
  Toolbar,
  Drawer,
  List,
  ListItem,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../store/context";
import { Modal } from "@material-ui/core";
import { auth } from "../../store/server.config";
import logo from "../../assets/logo.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import Announcements from "./Announcements";
import { BiCreditCard, BiTransfer, BiMenu } from "react-icons/bi";
import {
  AiFillGift,
  AiFillSecurityScan,
  AiFillHome,
  AiOutlineLogin,
} from "react-icons/ai";
import { SiGnuprivacyguard } from "react-icons/si";

const primaryColor = "#F0B90B";
const primaryColorDark = "#333";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const useStyles = makeStyles((theme) => ({
  header: {
    transition: ".5s",
    boxShadow: "none",
    // height: 70,
    background: "#f5f5f5",
  },
  headerScroll: {
    background: "#f5f5f5",
    transition: ".5s",
    "& h1": {
      fontSize: "12px",
      transition: ".5s",
    },
    "& MenuIcon": {
      // marginTop: "40px",
    },
  },
  toolbar: {
    // paddingBottom: "10px",
    width: "90%",
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolbarSmall: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  logo: {
    fontFamily: "Oleo Script Swash Caps",
    fontSize: 30,
    color: primaryColor,
    margin: "0px 20px",
    cursor: "pointer",
  },
  logoSmall: {
    fontFamily: "Oleo Script Swash Caps",
    fontSize: 20,
    color: primaryColor,
    margin: "0px 10px",
    cursor: "pointer",
  },
  headerLeft: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeftLinks: {
    display: "flex",
    alignItems: "center",
  },
  LeftLinks: {
    color: "#000",
    margin: "0px 20px",
    fontSize: 14,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
  },
  register: {
    background: primaryColor,
    padding: ".5rem 1.2rem",
    borderRadius: "4px",
    fontWeight: "400",
    color: "#000",
    transition: ".2s",
    "&:hover": {
      color: "#fff",
      transition: ".2s",
    },
  },
  rightLinks: {
    margin: "0px 20px",
    cursor: "pointer",
    "& p": {
      fontSize: "12px",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const [navBackground, setNavBackground] = useState("header");
  const navRef = useRef();
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const [open, setOpen] = useState(false);
  const { user, userData, setUserData, darkTheme, setRoute } =
    useContext(GlobalContext);
  const [modalOpen, setModalOpen] = useState(false);

  const firstname = localStorage.getItem("FirstName");
  const navigate = useNavigate();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

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

  navRef.current = navBackground;
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 50;
      if (show) {
        setNavBackground("headerScroll");
      } else {
        setNavBackground("header");
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const route = (route) => {
    navigate(route);
    setRoute(route);
  };

  return (
    <>
      {windowDimenion.winWidth < 768 ? (
        <AppBar
          position="fixed"
          className={classes[navRef.current]}
          style={{ background: darkTheme === false ? "#fff" : "#333" }}
        >
          <Toolbar className={classes.toolbarSmall}>
            <div className={classes.headerLeft}>
              <Link to="/">
                <img src="logo.png" style={{ width: 60, height: "auto" }} />
              </Link>
            </div>

            <div className={classes.headerRight}>
              <HiOutlineMenuAlt3
                style={{
                  fontSize: 35,
                  color: darkTheme === false ? primaryColor : "#ffdf10",
                }}
                onClick={() => openDrawer()}
              />
              <Drawer open={open} anchor="right" onClose={() => closeDrawer()}>
                {!user ? (
                  <List>
                    <ListItem button style={{ padding: "20px 10px" }}>
                      <Link
                        to="/trade"
                        style={{
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <AiFillSecurityScan style={{ fontSize: 18 }} />
                        <p style={{ marginLeft: 10 }}>Trade</p>
                      </Link>
                    </ListItem>
                    <ListItem button style={{ padding: "20px 10px" }}>
                      <Link
                        to="/my_account"
                        style={{
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <BiCreditCard style={{ fontSize: 18 }} />
                        <p style={{ marginLeft: 10 }}>My Account</p>
                      </Link>
                    </ListItem>
                    <ListItem button style={{ padding: "20px 10px" }}>
                      <Link
                        to="/login"
                        style={{
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <AiOutlineLogin style={{ fontSize: 18 }} />
                        <p style={{ marginLeft: 10 }}>Login</p>
                      </Link>
                    </ListItem>
                    <ListItem button style={{ padding: "20px 10px" }}>
                      <Link
                        to="/signup"
                        style={{
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <SiGnuprivacyguard style={{ fontSize: 18 }} />
                        <p style={{ marginLeft: 10 }}>Sign up</p>
                      </Link>
                    </ListItem>
                  </List>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        // padding: "20px 40px",
                      }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      ></div>
                      <p
                        style={{ color: "#000", marginLeft: 10, marginTop: 20 }}
                      >
                        Hi, {userData ? userData.firstname : firstname}
                      </p>
                    </div>
                    <List>
                      <ListItem button style={{ padding: "20px 10px" }}>
                        <Link
                          to="/trade"
                          style={{
                            color: "black",
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <AiFillSecurityScan style={{ fontSize: 18 }} />
                          <p style={{ marginLeft: 10 }}>Trade</p>
                        </Link>
                      </ListItem>
                      <ListItem button style={{ padding: "20px 10px" }}>
                        <Link
                          to="/my_account"
                          style={{
                            color: "black",
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <BiCreditCard style={{ fontSize: 18 }} />
                          <p style={{ marginLeft: 10 }}>My Account</p>
                        </Link>
                      </ListItem>
                      <ListItem
                        onClick={() => {
                          auth.signOut().then(() => {
                            localStorage.clear();
                            setUserData(null);
                          });
                        }}
                        button
                        style={{ padding: "20px 10px" }}
                      >
                        <div
                          style={{
                            color: "black",
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <BiTransfer style={{ fontSize: 18 }} />
                          <p style={{ color: "black", marginLeft: 10 }}>
                            Log Out
                          </p>
                        </div>
                      </ListItem>
                    </List>
                  </>
                )}
              </Drawer>
            </div>
          </Toolbar>
        </AppBar>
      ) : (
        <AppBar position="fixed" className={classes[navRef.current]}>
          <Announcements />
          <Toolbar className={classes.toolbar}>
            <div className={classes.headerLeft}>
              <Link to="/">
                <img src="logo.png" style={{ width: 60, height: 60 }} />
              </Link>
            </div>

            <div className={classes.headerRight}>
              {!user ? (
                <div className={classes.headerLeftLinks}>
                  <div
                    onClick={() => route("/trade")}
                    className={classes.LeftLinks}
                  >
                    <p style={{ cursor: "pointer" }}>Trade</p>
                  </div>
                  <div
                    onClick={() => route("/my_account")}
                    className={classes.LeftLinks}
                  >
                    <p style={{ cursor: "pointer" }}>My Account</p>
                  </div>
                </div>
              ) : null}
              {!user ? (
                <>
                  <Link to="/login" className={classes.rightLinks}>
                    <p className="btn btn-line">Login</p>
                  </Link>

                  <Link to="/signup" className={classes.rightLinks}>
                    <p className="btn btn-full">Register</p>
                  </Link>
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 100,
                  }}
                >
                  <p style={{ color: "#000", marginLeft: 10 }}>
                    Hi, {userData ? userData.firstname : firstname}
                  </p>

                  <div style={{ marginTop: 5, cursor: "pointer" }}>
                    <Modal open={modalOpen} onClose={closeModal}>
                      <List
                        style={{
                          background: "white",
                          width: 400,
                          position: "absolute",
                          right: 30,
                          top: 100,
                          textAlign: "center",
                        }}
                      >
                        <Link to="/trade" style={{ color: "#000" }}>
                          <ListItem
                            button
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p>Trade</p>
                          </ListItem>
                        </Link>
                        <Link to="/my_account" style={{ color: "#000" }}>
                          <ListItem
                            button
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p>My Account</p>
                          </ListItem>
                        </Link>
                        <ListItem
                          button
                          style={{ display: "flex", justifyContent: "center" }}
                          onClick={() => {
                            auth.signOut().then(() => {
                              localStorage.clear();
                              setUserData(null);
                            });
                          }}
                        >
                          <p>Log Out</p>
                        </ListItem>
                      </List>
                    </Modal>
                  </div>
                </div>
              )}
            </div>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Header;
