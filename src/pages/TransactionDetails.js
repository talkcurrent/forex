import React, { useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { BiChevronLeft } from "react-icons/bi";
import {
  onSnapshot,
  doc,
  collection,
  where,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import db from "../store/server.config";
import { MdCallReceived } from "react-icons/md";
import { VscDebugBreakpointLogUnverified } from "react-icons/vsc";
import moment from "moment";
import { GlobalContext } from "../store/context";
import { Navigate, useNavigate } from "react-router-dom";
import { makeStyles, Modal } from "@material-ui/core";
import Footer from "../components/Home/Footer";
import { BsFillInfoCircleFill } from "react-icons/bs";

const primaryColor = "#F0B90B";
const primaryColorDark = "#333";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const useStyles = makeStyles({
  input: {
    fontFamily: "Poppins, sans-serif",
    border: "none",
    outline: "none",
    borderRadius: 5,
    width: 245,
    background: "none",
    height: 45,
  },
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: primaryColor,
      color: "#333",
    },
  },
});

const TransactionDetails = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { darkTheme, setRoute } = useContext(GlobalContext);
  const [history, setHistory] = useState();
  const [withdrawals, setWithdrawals] = useState();
  const [value, setValue] = useState(0);
  const handleChange = (event, value) => {
    setValue(value);
  };
  const [openModal, setOpenModal] = useState(false);

  const revealModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), async (snapshot) => {
          const q = query(
            collection(db, "transactions"),
            where("userID", "==", snapshot.data().id),
            orderBy("dateTime", "desc")
          );
          const snapshots = await getDocs(q);
          console.log(snapshots.docs.map((doc) => doc.data()));
          setHistory(snapshots.docs.map((doc) => doc.data()));
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
          const q = query(
            collection(db, "transactions"),
            where("userID", "==", snapshot.data().id),
            orderBy("dateTime", "desc")
          );
          const snapshots = await getDocs(q);
          console.log(snapshots.docs.map((doc) => doc.data()));
          setHistory(snapshots.docs.map((doc) => doc.data()));
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), async (snapshot) => {
          const q = query(
            collection(db, "withdrawal_requests"),
            where("userID", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          const snapshots = await getDocs(q);
          console.log(
            "Withdrawal Requests>>>",
            snapshots.docs.map((doc) => doc.data())
          );
          setWithdrawals(snapshots.docs.map((doc) => doc.data()));
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  useEffect(() => {
    const phone = localStorage.getItem("PhoneNumber");
    if (phone) {
      try {
        onSnapshot(doc(db, "users", phone), async (snapshot) => {
          const q = query(
            collection(db, "withdrawal_requests"),
            where("userID", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          const snapshots = await getDocs(q);
          console.log(
            "Withdrawal Requests>>>",
            snapshots.docs.map((doc) => doc.data())
          );
          setWithdrawals(snapshots.docs.map((doc) => doc.data()));
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

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
        <div>
          <div className="trd-top">
            <BiChevronLeft
              fontSize={25}
              onClick={() => {
                navigate("/my_account");
              }}
            />
            <p>Transaction Details</p>
            <span></span>
          </div>
          <Paper
            style={{
              width: "95%",
              boxShadow: "none",
              margin: "auto",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              className={classes.tabs}
            >
              <Tab
                style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
                label="Deposit"
              />
              <Tab
                style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
                label="Withdrawal"
              />
            </Tabs>
            {value === 0 && (
              <div className="deposits">
                {history ? (
                  <>
                    {history.map((data) => (
                      <div className="trans-deposit" key={data.transactionID}>
                        <div className="td-top">
                          <div className="td-top-child">
                            <p>USDT</p>
                            <span>
                              {moment(data.dateTime).format(
                                "MMM Do YY, hh:mm A"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="td-tom">
                          <p>+ ${data.tokenAmount / 1000000}</p>
                          <div className="td-status">
                            <h4 style={{ color: "green" }}>•</h4>
                            <span>Completed</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p
                    style={{
                      fontSize: "12px",
                      color: darkTheme === false ? "#333" : "#fff",
                    }}
                  >
                    oops! nothing to see here
                  </p>
                )}
              </div>
            )}

            {value === 1 && (
              <div className="deposits">
                {history ? (
                  <>
                    {withdrawals.map((data) => (
                      <div className="trans-deposit" key={data.transactionID}>
                        <div className="td-top">
                          <div className="td-top-child">
                            <p>USDT</p>
                            <span>{data.createdAt}</span>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              marginLeft: 15,
                              marginTop: 7,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <p style={{ fontSize: 14, color: "red" }}>
                              - ${data.amount}
                            </p>
                          </div>
                          <div className="td-status">
                            {data.status === "Pending" ? (
                              <>
                                <h4 style={{ color: "red" }}>•</h4>
                                <span>Processing...</span>
                              </>
                            ) : data.status === "Declined" ? (
                              <>
                                <h4 style={{ color: "green" }}>•</h4>
                                <span>Declined</span>
                                <BsFillInfoCircleFill
                                  style={{
                                    margin: "0px 5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    revealModal();
                                  }}
                                />
                                <Modal
                                  open={openModal}
                                  onClose={closeModal}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>
                                    <div
                                      style={{
                                        background: "#fff",
                                        padding: 20,
                                        borderRadius: 5,
                                        maxWidth: 300,
                                      }}
                                    >
                                      <p>{data.reason}</p>
                                    </div>
                                  </div>
                                </Modal>
                              </>
                            ) : (
                              <>
                                <h4 style={{ color: "green" }}>•</h4>
                                <span>Completed</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p
                    style={{
                      fontSize: "12px",
                      color: darkTheme === false ? "#333" : "#fff",
                    }}
                  >
                    oops! nothing to see here
                  </p>
                )}
              </div>
            )}
          </Paper>
          <Footer />
        </div>
      ) : (
        <div className="dMain-td">
          <div className="dTd-main2">
            <div className="trd-top">
              <h1 style={{ color: "#F0B90B", fontSize: "30px" }}>
                My Transactions
              </h1>
            </div>
            <Paper
              style={{
                width: "95%",
                boxShadow: "none",
                margin: "auto",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                className={classes.tabs}
              >
                <Tab
                  style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
                  label="Deposit"
                />
                <Tab
                  style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
                  label="Withdrawal"
                />
              </Tabs>
              {value === 0 && (
                <div className="deposits">
                  {history ? (
                    <>
                      {history.map((data) => (
                        <div className="trans-deposit" key={data.transactionID}>
                          <div className="td-top">
                            <div className="td-top-child">
                              <p>USDT</p>
                              <span>
                                {moment(data.dateTime).format(
                                  "MMM Do YY, hh:mm A"
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="td-tom">
                            <p>+ ${data.tokenAmount / 1000000}</p>
                            <div className="td-status">
                              <h4 style={{ color: "green" }}>•</h4>
                              <span>Completed</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p
                      style={{
                        fontSize: "12px",
                        color: darkTheme === false ? "#333" : "#fff",
                      }}
                    >
                      oops! nothing to see here
                    </p>
                  )}
                </div>
              )}

              {value === 1 && (
                <div className="deposits">
                  {withdrawals ? (
                    <>
                      {withdrawals.map((data) => (
                        <div className="trans-deposit" key={data.transactionID}>
                          <div className="td-top">
                            <div className="td-top-child">
                              <p>USDT</p>
                              <span>{data.createdAt}</span>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                            }}
                          >
                            <div
                              style={{
                                marginTop: 7,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {/* <p style={{ fontSize: 14}}>Amount: ${data.amount}</p> */}
                              <p style={{ fontSize: 14, color: "red" }}>
                                - ${data.amount}
                              </p>
                            </div>
                            <div className="td-status">
                              {data.status === "Pending" ? (
                                <>
                                  <h4 style={{ color: "red" }}>•</h4>
                                  <span>Processing...</span>
                                </>
                              ) : data.status === "Declined" ? (
                                <>
                                  <h4 style={{ color: "green" }}>•</h4>
                                  <span>Declined</span>
                                  <BsFillInfoCircleFill
                                    style={{
                                      margin: "0px 5px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      revealModal();
                                    }}
                                  />
                                  <Modal
                                    open={openModal}
                                    onClose={closeModal}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>
                                      <div
                                        style={{
                                          background: "#fff",
                                          padding: 20,
                                          borderRadius: 5,
                                          maxWidth: 400,
                                        }}
                                      >
                                        <p>{data.reason}</p>
                                      </div>
                                    </div>
                                  </Modal>
                                </>
                              ) : (
                                <>
                                  <h4 style={{ color: "green" }}>•</h4>
                                  <span>Completed</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p
                      style={{
                        fontSize: "12px",
                        color: darkTheme === false ? "#333" : "#fff",
                      }}
                    >
                      oops! nothing to see here
                    </p>
                  )}
                </div>
              )}
            </Paper>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
