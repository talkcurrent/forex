import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../store/context";
import { makeStyles, Modal } from "@material-ui/core";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  query,
  updateDoc,
} from "firebase/firestore";
import CurrencyFormat from "react-currency-format";
import db from "../store/server.config";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { MdInfo, MdModeEdit } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";
import Footer from "../components/Home/Footer";

const primaryColor = "#F0b90B";

const useStyles = makeStyles({
  sendUsdt: {
    fontFamily: "Poppins, sans-serif",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // justifyContent:"Flex"
    "& h1": {
      fontFamily: "Poppins, sans-serif",
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "22px",
    },
    "& p": {
      fontSize: "10px",
    },
  },
});

const Withdrawal = () => {
  const { darkTheme, setRoute } = useContext(GlobalContext);
  const classes = useStyles();
  const [userData, setUserData] = useState();
  const [errors, setErrors] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState(null);
  const [pinErrors, setPinErrors] = useState(null);
  const [authenticationComplete, setAuthenticationComplete] = useState(false);
  const [confirmPinLoading, setConfirmPinLoading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), async (snapshot) => {
          setUserData(snapshot.data());
          if (snapshot.data().authenticated) {
            setAuthenticationComplete(true);
          }
          console.log(snapshot.data());
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
          if (snapshot.data().authenticated) {
            setAuthenticationComplete(true);
          }
          console.log(snapshot.data());
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const widthraw = () => {
    setLoading(true);
    setErrors(null);
    setSuccessMsg(null);
    if (amount === "") {
      setErrors("Please set an amount to withdraw.");
      setLoading(false);
    } else if (userData && amount > userData.balance) {
      setErrors("Insufficient Funds.");
      setLoading(false);
    } else if (amount < 10) {
      setErrors("You can only withdraw a minimum of $10.");
      setLoading(false);
    } else if (authenticationComplete === false) {
      setErrors("Please complete your KYC on the security center.");
      setLoading(false);
    } else {
      try {
        setOpen(true);
        console.log(userData && userData.widthdrawal_pin);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const confirmPin = () => {
    console.log(pin);
    setConfirmPinLoading(true);
    if (pin === null) {
      setPinErrors("You cannot leave the pin field empty.");
      setConfirmPinLoading(false);
    } else if (pin !== userData.widthdrawal_pin) {
      setPinErrors("Incorrect withdrawal pin.");
      setConfirmPinLoading(false);
    } else {
      console.log("We added the doc");
      addDoc(collection(db, "withdrawal_requests"), {
        userID: userData && userData.id,
        amount: amount,
        balance: userData && userData.balance,
        createdAt: moment(new Date()).format("YYYY-MMM-DD, hh:mm A"),
        status: "Pending",
        name: userData && userData.firstname + " " + userData.lastname,
        withdrawal_address: userData && userData.withdrawal_address,
      }).then(async () => {
        console.log("We updated the doc");
        const email = localStorage.getItem("Email");
        const phone = localStorage.getItem("PhoneNumber");
        const userDocId = email ? email : phone;
        const que = doc(db, "users", userDocId);
        await updateDoc(que, {
          balance: userData.balance - amount,
        });
        setOpen(false);
        setConfirmPinLoading(false);
        setLoading(false);
        setSuccessMsg("Withdrawal Request Submitted Successfully.");
      });
    }
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
        <div>
          <div style={{ padding: 20 }}>
            <div className={classes.sendUsdt}>
              <h1 style={{ color: primaryColor }}>Send USDT</h1>
              <p>Send USDT to crypto address</p>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <p
                style={{
                  fontSize: "12px",
                  textAlign: "left",
                  fontWeight: "500",
                }}
              >
                Address
              </p>
              <div></div>
              <p
                style={{
                  background: "#f1f1f1",
                  padding: 10,
                  fontSize: 12,
                  borderRadius: 4,
                  textAlign: "left",
                  display: "flex",
                  flex: "1",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "500",
                  color: "#999",
                  height: "3rem",
                }}
              >
                {userData && userData.withdrawal_address
                  ? userData.withdrawal_address
                  : "You do not have a withdrawal address."}
                <button
                  style={{
                    background: "#aaa",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#f5f5f5",
                  }}
                  onClick={() => {
                    setRoute("/account_settings");
                    navigate("/withdraw_funds");
                  }}
                >
                  <MdModeEdit style={{ pointerEvents: " none" }} />
                </button>
              </p>
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <p
                style={{
                  fontSize: "12px",
                  textAlign: "left",
                  fontWeight: "500",
                }}
              >
                Network
              </p>
              <div></div>
              <select
                style={{
                  background: "#f1f1f1",
                  padding: 10,
                  fontSize: 12,
                  borderRadius: 4,
                  border: "none",
                  textAlign: "left",
                  display: "flex",
                  flex: "1",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "3rem",
                  width: "100%",
                  color: "#999",
                }}
              >
                <option style={{ color: "#999" }}>Select Network</option>
                <option>TRON 20</option>
              </select>
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <p
                style={{
                  fontSize: "12px",
                  textAlign: "left",
                  fontWeight: "500",
                }}
              >
                Amount
              </p>
              <div></div>
              <input
                placeholder="Amount to withdraw"
                type="number"
                style={{
                  background: "#f1f1f1",
                  padding: 10,
                  fontSize: 12,
                  borderRadius: 4,
                  border: "none",
                  textAlign: "left",
                  display: "flex",
                  flex: "1",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "3rem",
                  width: "100%",
                  color: "#777",
                }}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors(null);
                  setSuccessMsg(null);
                }}
              />
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px 0 0",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    textAlign: "left",
                    fontWeight: "500",
                  }}
                >
                  Available
                </p>
                <p>
                  {userData ? (
                    <CurrencyFormat
                      value={userData && userData.balance.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      // prefix={"$"}
                      renderText={(value) => (
                        <p
                          style={{
                            fontSize: "12px",
                            textAlign: "left",
                            fontWeight: "500",
                          }}
                        >
                          {value} USDT
                        </p>
                      )}
                    />
                  ) : (
                    <p>Fetching Data...</p>
                  )}
                </p>
              </div>
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={{ marginTop: 10 }}>
                {errors && (
                  <p
                    style={{
                      color: "red",
                      fontSize: 12,
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    {errors}
                  </p>
                )}
                {successMsg && (
                  <p style={{ color: "green", fontSize: 12, marginTop: 10 }}>
                    {successMsg}
                  </p>
                )}

                <Modal
                  open={open}
                  onClose={() => {
                    setOpen((prevState) => !prevState);
                    setPinErrors(null);
                    setLoading(false);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      padding: "30px 70px",
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <p>Your Withdrawal Pin</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <input
                        type="number"
                        style={{
                          border: "none",
                          borderBottom: "1px solid #ccc",
                          outline: "none",
                          marginTop: 20,
                        }}
                        value={pin}
                        onChange={(e) => {
                          setPin(e.target.value);
                          setPinErrors(null);
                        }}
                      />
                    </div>

                    {pinErrors && (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginTop: 10,
                          maxWidth: 200,
                          textAlign: "center",
                        }}
                      >
                        {pinErrors}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 20,
                      }}
                    >
                      <button
                        style={{ padding: "3px 20px" }}
                        onClick={() => confirmPin()}
                      >
                        {confirmPinLoading ? "Confirming..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          <div style={{ border: "0.5px #e1e1e1 solid" }} />
          <div
            style={{
              padding: "10px 20px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: "1.8" }}>
              <p
                style={{
                  color: "#333",
                  fontWeight: "300",
                  fontSize: "10px",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                }}
              >
                5% withdrawal fee <MdInfo style={{ color: primaryColor }} />
              </p>
            </div>
            <div style={{ flex: "1" }}>
              <div style={{ marginTop: 10 }}>
                <button
                  style={{
                    width: "100%",
                    height: "2.2rem",
                    border: "none",
                    background: primaryColor,
                    color: "#333",
                    borderRadius: "4px",
                    margin: "10px 0 0 0",
                    fontSize: "12px",
                  }}
                  onClick={widthraw}
                >
                  {loading ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div
          style={{
            width: "94%",
            margin: "3rem auto 0 auto",
            padding: "1rem 1rem 2rem 1rem",
            border: "1px #e1e1e1 solid",
            borderRadius: "10px",
          }}
        >
          <div style={{ padding: 20 }}>
            <div className={classes.sendUsdt}>
              <h1 style={{ color: primaryColor }}>Send USDT</h1>
              <p>Send USDT to crypto address</p>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <p
                style={{
                  fontSize: "12px",
                  textAlign: "left",
                  fontWeight: "500",
                }}
              >
                Address
              </p>
              <div></div>
              <p
                style={{
                  background: "#f1f1f1",
                  padding: 10,
                  fontSize: 12,
                  borderRadius: 4,
                  textAlign: "left",
                  display: "flex",
                  flex: "1",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "500",
                  color: "#999",
                  height: "3rem",
                }}
              >
                {userData && userData.withdrawal_address
                  ? userData.withdrawal_address
                  : "You do not have a withdrawal address."}
                <button
                  style={{
                    background: "#aaa",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#f5f5f5",
                  }}
                  onClick={() => {
                    setRoute("/account_settings");
                    navigate("/withdraw_funds");
                  }}
                >
                  <MdModeEdit style={{ pointerEvents: " none" }} />
                </button>
              </p>
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <p
                style={{
                  fontSize: "12px",
                  textAlign: "left",
                  fontWeight: "500",
                }}
              >
                Network
              </p>
              <div></div>
              <select
                style={{
                  background: "#f1f1f1",
                  padding: 10,
                  fontSize: 12,
                  borderRadius: 4,
                  border: "none",
                  textAlign: "left",
                  display: "flex",
                  flex: "1",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "3rem",
                  width: "100%",
                  color: "#999",
                }}
              >
                <option style={{ color: "#999" }}>Select Network</option>
                <option>TRON 20</option>
              </select>
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <p
                style={{
                  fontSize: "12px",
                  textAlign: "left",
                  fontWeight: "500",
                }}
              >
                Amount
              </p>
              <div></div>
              <input
                placeholder="Amount to withdraw"
                type="number"
                style={{
                  background: "#f1f1f1",
                  padding: 10,
                  fontSize: 12,
                  borderRadius: 4,
                  border: "none",
                  textAlign: "left",
                  display: "flex",
                  flex: "1",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "3rem",
                  width: "100%",
                  color: "#777",
                }}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors(null);
                  setSuccessMsg(null);
                }}
              />
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ margin: "1.2rem 0 0 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px 0 0",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    textAlign: "left",
                    fontWeight: "500",
                  }}
                >
                  Available
                </p>
                <p>
                  {userData ? (
                    <CurrencyFormat
                      value={userData && userData.balance.toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      // prefix={"$"}
                      renderText={(value) => (
                        <p
                          style={{
                            fontSize: "12px",
                            textAlign: "left",
                            fontWeight: "500",
                          }}
                        >
                          {value} USDT
                        </p>
                      )}
                    />
                  ) : (
                    <p>Fetching Data...</p>
                  )}
                </p>
              </div>
              <div style={{ marginTop: 10 }}></div>
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={{ marginTop: 10 }}>
                {errors && (
                  <p
                    style={{
                      color: "red",
                      fontSize: 12,
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    {errors}
                  </p>
                )}
                {successMsg && (
                  <p style={{ color: "green", fontSize: 12, marginTop: 10 }}>
                    {successMsg}
                  </p>
                )}

                <Modal
                  open={open}
                  onClose={() => {
                    setOpen((prevState) => !prevState);
                    setPinErrors(null);
                    setLoading(false);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      padding: "30px 70px",
                      borderRadius: 6,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <p>Your Withdrawal Pin</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <input
                        type="number"
                        style={{
                          border: "none",
                          borderBottom: "1px solid #ccc",
                          outline: "none",
                          marginTop: 20,
                        }}
                        value={pin}
                        onChange={(e) => {
                          setPin(e.target.value);
                          setPinErrors(null);
                        }}
                      />
                    </div>

                    {pinErrors && (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          marginTop: 10,
                          maxWidth: 200,
                          textAlign: "center",
                        }}
                      >
                        {pinErrors}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 20,
                      }}
                    >
                      <button
                        style={{ padding: "3px 20px" }}
                        onClick={() => confirmPin()}
                      >
                        {confirmPinLoading ? "Confirming..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          <div style={{ border: "0.5px #e1e1e1 solid" }} />
          <div
            style={{
              padding: "10px 20px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: "1.8" }}>
              <p
                style={{
                  color: "#333",
                  fontWeight: "300",
                  fontSize: "10px",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                }}
              >
                5% withdrawal fee
                <MdInfo style={{ color: primaryColor }} />
              </p>
            </div>
            <div style={{ flex: "1" }}>
              <div style={{ marginTop: 10 }}>
                <button
                  style={{
                    width: "100%",
                    height: "2.2rem",
                    border: "none",
                    background: primaryColor,
                    color: "#333",
                    borderRadius: "4px",
                    margin: "10px 0 0 0",
                    fontSize: "12px",
                  }}
                  onClick={widthraw}
                >
                  {loading ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdrawal;
