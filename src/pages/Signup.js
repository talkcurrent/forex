import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Lottie from "react-lottie";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import animationData from "../loading.json";
import { GlobalContext } from "../store/context";
import db, { auth } from "../store/server.config";

import axios from "axios";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { Encrypt } from "../helpers/Cypher";

const TronWeb = require("tronweb");

const primaryColor = "#F0B90B";
const icons = "#B4AAF9";
const primaryColorDark = "#333";

const useStyles = makeStyles({
  input: {
    padding: 10,
    borderColor: "#ccc",
    border: "none",
    outline: "none",
    background: "none",
    fontFamily: "Poppins, sans-serif",
    textAlign: "left",
  },
  signup: {
    background: primaryColor,
    padding: 5,
    borderRadius: 10,
    width: 300,
  },
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: primaryColor,
    },
  },
});

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Signup = () => {
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [showPassword, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailRepeatPassword, setEmailRepeatPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [emailFirstname, setEmailFirstname] = useState("");
  const [emailLastname, setEmailLastname] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [value, setValue] = useState(0);
  const [signingUp, setSigningUp] = useState(false);
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const navigate = useNavigate();
  const { setUserData } = useContext(GlobalContext);
  const [referralcode, setReferralCode] = useState("");

  const fullNode = "https://api.shasta.trongrid.io";
  const solidityNode = "https://api.shasta.trongrid.io";
  const eventServer = "https://api.shasta.trongrid.io";
  const privateKey =
    "427139B43028A492E2705BCC9C64172392B8DB59F3BA1AEDAE41C88924960091";
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

  const { referralID } = useParams();

  useEffect(() => {
    console.log(referralID);
    if (referralID) {
      setReferralCode(referralID);
    }
  }, []);

  const generateRecaptcha = () => {
    console.log("We are here");
    window.recaptchaVerifier = new RecaptchaVerifier(
      "signup_recaptcha",
      {
        size: "invisible",
        callback: (response) => {
          // onSignInSubmit();
        },
      },
      auth
    );
    console.log("We are outta here");
  };

  const onSignInSubmit = async () => {
    setLoading(true);
    if (
      phone === "" ||
      lastname === "" ||
      (firstname === "") | (referralcode === "")
    ) {
      setLoading(false);
      setErrors("Please fill the needed fields.");
      return;
    }

    if (password !== repeatPassword) {
      setErrors("Passwords do not match.");
      setLoading(false);
      return;
    }

    const querySnapshot = await getDoc(doc(collection(db, "users"), phone));

    if (querySnapshot.exists()) {
      setErrors(
        "This phone number already exists on Bivestcoin. Please try another number."
      );
      setLoading(false);
      return;
    }

    const referrerQ = query(
      collection(db, "users"),
      where("referralcode", "==", referralcode)
    );
    const referrerDocs = await getDocs(referrerQ);
    let referrerId;
    if (referrerDocs.docs.length) {
      referrerId = referrerDocs.docs[0].id;
    }

    if (referrerId) {
      if (!window.recaptchaVerifier) {
        generateRecaptcha();
      }

      let appVerifier = window.recaptchaVerifier;
      console.log("Did we get here?");
      signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          console.log("We got here..!!");
          window.confirmationResult = confirmationResult;
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setErrors("Incorrect referral code.");
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    let otp = e.target.value;
    setOtp(otp);

    if (otp.length === 6) {
      setSigningUp(true);
      let confirmationResult = window.confirmationResult;

      if (!confirmationResult) {
        setErrors("Incorrect OTP");
        return;
      }

      const referrerQ = query(
        collection(db, "users"),
        where("referralcode", "==", referralcode)
      );
      const referrerDocs = await getDocs(referrerQ);
      let referrerId;
      if (referrerDocs.docs.length) {
        referrerId = referrerDocs.docs[0].id;
      }

      if (referrerId) {
        confirmationResult
          .confirm(otp)
          .then(async (result) => {
            const cryptoAccount = await tronWeb.createAccount();
            console.log("Crypto account>>>", cryptoAccount);
            const encryptedPrivateKey = Encrypt(cryptoAccount.privateKey);
            const encryptedPassword = Encrypt(password);
            const newUser = {
              firstname: firstname,
              lastname: lastname,
              phone_number: phone,
              password: encryptedPassword,
              id: result.user.uid,
              balance: 0,
              bonus: 5,
              referralcode: Math.random().toString(36).slice(6),
              cryptoWalletAddress: cryptoAccount.address.base58,
              cryptoWalletHex: cryptoAccount.address.hex,
              cryptoPrivateKey: encryptedPrivateKey,
              cryptoPublicKey: cryptoAccount.publicKey,
              referrerId,
              docID: phone,
            };

            setDoc(doc(db, "users", phone), newUser);
            setUserData(newUser);
            localStorage.setItem("FirstName", firstname);
            localStorage.setItem("PhoneNumber", phone);
            setSigningUp(false);
            navigate("/");
          })
          .catch((error) => {
            console.error(error);
            setErrors("Incorrect OTP");
          });
      }
    }
  };

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    //conole.log(windowDimenion);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  const revealPassword = () => {
    setShow(true);
  };

  const hidePassword = () => {
    setShow(false);
  };

  const handleChange = (event, value) => {
    setValue(value);
    //conole.log(value);
  };

  const emailSignUp = async () => {
    setLoading(true);
    setErrors(null);

    if (
      email === "" ||
      emailPassword === "" ||
      emailFirstname === "" ||
      emailLastname === "" ||
      referralcode === ""
    ) {
      setLoading(false);
      setErrors("Please fill the needed fields.");
    } else if (emailPassword !== emailRepeatPassword) {
      setErrors("Passwords do not match.");
      setLoading(false);
    } else {
      const referrerQ = query(
        collection(db, "users"),
        where("referralcode", "==", referralcode)
      );
      const referrerDocs = await getDocs(referrerQ);
      let referrerId;
      if (referrerDocs.docs.length) {
        referrerId = referrerDocs.docs[0].id;
      }

      if (referrerId) {
        createUserWithEmailAndPassword(auth, email, emailPassword)
          .then(async (user) => {
            const cryptoAccount = await tronWeb.createAccount();
            const encryptedPrivateKey = Encrypt(cryptoAccount.privateKey);
            const encryptedPassword = Encrypt(emailPassword);
            const newUser = {
              firstname: emailFirstname,
              lastname: emailLastname,
              email: email,
              password: encryptedPassword,
              id: user.user.uid,
              balance: 0,
              bonus: 5,
              referralcode: Math.random().toString(36).slice(6),
              referrerId,
              cryptoWalletAddress: cryptoAccount.address.base58,
              cryptoWalletHex: cryptoAccount.address.hex,
              cryptoPrivateKey: encryptedPrivateKey,
              cryptoPublicKey: cryptoAccount.publicKey,
              docID: email,
            };
            setDoc(doc(db, "users", email), newUser);
            setUserData(newUser);
            localStorage.setItem("FirstName", emailFirstname);
            localStorage.setItem("Email", email);
            setLoading(false);
            axios
              .post(
                `https://bivestcoin-email-server.herokuapp.com/send-verification-email`,
                {
                  email: user.user.email,
                }
              )
              .catch((error) => {
                console.error(error);
              });
          })
          .then(() => {
            navigate("/email_verify", {
              state: {
                email: email,
              },
            });
          })
          .catch((err) => {
            setErrors(err.message);
            setLoading(false);
          });
      } else {
        setErrors("Incorrect referral code.");
      }
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div
        style={{
          background: "#fff",
          dropShadow: "3px 3px 15px #f5f5f5",
          width: "94%",
          margin: "auto",
          padding: "3rem 0 0 0",
        }}
      >
        <Paper
          style={{
            background: "none",
            width: "100%",
            maxWidth: "500px",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <div>
            <p
              style={{
                color: primaryColor,
                fontSize: 25,
                fontWeight: "700",
                padding: "2rem 0 1rem 0",
                textAlign: "center",
              }}
            >
              Sign Up
            </p>
          </div>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            className={classes.tabs}
          >
            <Tab label="Email" style={{ color: "#333" }} />
            <Tab label="Phone Number" style={{ color: "#333" }} />
          </Tabs>
          {value === 1 && (
            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <input
                  className={classes.input}
                  type="text"
                  style={{
                    width: "100%",
                    // width: windowDimenion.winWidth < 600 && 300,
                  }}
                  placeholder="First Name"
                  onChange={(p) => {
                    setErrors(null);
                    setFirstname(p.target.value);
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <input
                  className={classes.input}
                  type="text"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Last Name"
                  onChange={(p) => {
                    setErrors(null);
                    setLastname(p.target.value);
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={(phone) => {
                    setErrors(null);
                    setPhone(`+${phone}`);
                  }}
                  // onlyCountries={["us", "ng", "ke"]}
                  inputStyle={{
                    border: "none",
                    width: "100%",
                  }}
                  buttonStyle={{
                    border: "none",
                    background: "none",
                    padding: "0",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <input
                  name="referrercode"
                  required
                  onChange={(e) => {
                    setReferralCode(e.target.value);
                  }}
                  value={referralcode}
                  className={classes.input}
                  type="text"
                  style={{
                    width: windowDimenion.winWidth < 600 && 300,
                    marginLeft: windowDimenion.winWidth < 600 ? -18 : -30,
                  }}
                  placeholder="Enter 6 digit invitation code"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                  padding: "0 10px 0 0",
                }}
              >
                <input
                  className={classes.input}
                  type="text"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Get Verification Code"
                  value={otp}
                  onChange={(e) => {
                    setErrors(null);
                    verifyOtp(e);
                  }}
                />
                <div id="signup_recaptcha"></div>
                <div
                  id="signin_btn"
                  style={{ marginLeft: 8 }}
                  onClick={onSignInSubmit}
                >
                  {loading ? (
                    <Lottie options={defaultOptions} height={30} width={30} />
                  ) : (
                    <BsFillTelephoneInboundFill
                      style={{ fontSize: 20, color: primaryColorDark }}
                    />
                  )}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                {errors !== null && (
                  <p style={{ fontSize: 12, color: "red" }}>{errors}</p>
                )}
              </div>

              {/* {loading ? (
                <p style={{ fontSize: 12, color: "red" }}>
                  Complete ReCaptcha to get verification code
                </p>
              ) : null} */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    background: primaryColor,
                    padding: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "50px",
                    overflow: "hidden",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ color: signingUp ? primaryColor : "#fff" }}>
                    {signingUp ? (
                      <Lottie options={defaultOptions} height={30} width={30} />
                    ) : (
                      "Sign Up"
                    )}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 10 }}>
                  By signing up, you accept our{" "}
                  <Link to="/terms_and_conditions" style={{ color: "blue" }}>
                    Terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="" style={{ color: "blue" }}>
                    Privacy Policy
                  </Link>
                </p>
              </div>

              <div>
                <p style={{ fontSize: 10 }}>
                  Already a member?{" "}
                  <Link to="/login" style={{ color: "blue" }}>
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          )}

          {value === 0 && (
            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <input
                  className={classes.input}
                  type="text"
                  style={{
                    width: "100%",
                  }}
                  placeholder="First Name"
                  onChange={(p) => {
                    setErrors(null);
                    setEmailFirstname(p.target.value);
                  }}
                  value={emailFirstname}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <input
                  className={classes.input}
                  type="text"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Last Name"
                  onChange={(p) => {
                    setErrors(null);
                    setEmailLastname(p.target.value);
                  }}
                  value={emailLastname}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <input
                  className={classes.input}
                  type="email"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setErrors(null);
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                  padding: "0 10px 0 0",
                }}
              >
                <input
                  className={classes.input}
                  type={showPassword ? "text" : "password"}
                  style={{ width: "100%" }}
                  placeholder="Enter Password"
                  value={emailPassword}
                  onChange={(p) => {
                    setErrors(null);
                    setEmailPassword(p.target.value);
                  }}
                />
                <div style={{ marginLeft: 8 }}>
                  {showPassword ? (
                    <MdOutlineVisibilityOff
                      onClick={() => hidePassword()}
                      style={{ fontSize: 20, color: primaryColorDark }}
                    />
                  ) : (
                    <MdOutlineVisibility
                      onClick={() => revealPassword()}
                      style={{ fontSize: 20, color: primaryColorDark }}
                    />
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    textAlign: "left",
                    fontSize: 10,
                    width: "100%",
                    marginLeft: 10,
                  }}
                >
                  Password at least 8 characters, and must contain letters and
                  numbers
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                  padding: "0 10px 0 0",
                }}
              >
                <input
                  className={classes.input}
                  type={showPassword ? "text" : "password"}
                  style={{ width: "100%" }}
                  placeholder="Repeat Password"
                  value={emailRepeatPassword}
                  onChange={(p) => {
                    setErrors(null);
                    setEmailRepeatPassword(p.target.value);
                  }}
                />
                <div style={{ marginLeft: 8 }}>
                  {showPassword ? (
                    <MdOutlineVisibilityOff
                      onClick={() => hidePassword()}
                      style={{ fontSize: 20, color: primaryColorDark }}
                    />
                  ) : (
                    <MdOutlineVisibility
                      onClick={() => revealPassword()}
                      style={{ fontSize: 20, color: primaryColorDark }}
                    />
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  width: "100%",
                  height: "50px",
                  background: "none",
                  overflow: "hidden",
                  borderRadius: "6px",
                  border: ".5px #B4AAF9 solid",
                }}
              >
                <input
                  name="referrercode"
                  onChange={(e) => {
                    setReferralCode(e.target.value);
                  }}
                  value={referralcode}
                  className={classes.input}
                  type="text"
                  style={{
                    width: windowDimenion.winWidth < 600 && 300,
                    marginLeft: windowDimenion.winWidth < 600 ? -18 : -30,
                  }}
                  placeholder="Enter 6 digit invitation code"
                />
              </div>
              <div>
                {errors !== null && (
                  <p style={{ fontSize: 12, color: "red" }}>{errors}</p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    background: primaryColor,
                    padding: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                    width: "100%",
                    height: "50px",
                    overflow: "hidden",
                    borderRadius: "6px",
                  }}
                  onClick={emailSignUp}
                >
                  <p style={{ color: "#fff" }}>
                    {loading ? "Signing Up..." : "Sign Up "}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 10 }}>
                  By signing up, you accept our{" "}
                  <Link to="/terms_and_conditions" style={{ color: "blue" }}>
                    Terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="" style={{ color: "blue" }}>
                    Privacy Policy
                  </Link>
                </p>
              </div>
              <div>
                <p style={{ fontSize: 10, textAlign: "center" }}>
                  Already a member?{" "}
                  <Link to="/login" style={{ color: "blue" }}>
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default Signup;
