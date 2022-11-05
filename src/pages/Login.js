import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, query } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Lottie from "react-lottie";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import animationData from "../loading.json";
import { GlobalContext } from "../store/context";
import db, { auth } from "../store/server.config";
import axios from "axios";

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

const Login = () => {
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [showPassword, setShow] = useState(false);
  const { setUserData } = useContext(GlobalContext);
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const navigate = useNavigate();
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

  const handleChange = (event, value) => {
    setValue(value);
    //conole.log(value);
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        //  size: "invisible",
        callback: (response) => {},
      },
      auth
    );
  };

  const onSignInSubmit = async () => {
    setLoading(true);
    const q = query(doc(db, "users", phone));

    const querySnapshot = await getDoc(q);
    console.log("Snapshot", querySnapshot.exists());

    if (phone === "") {
      setLoading(false);
      setErrors("Please fill the needed fields.");
    } else if (querySnapshot.exists() === false) {
      setErrors(
        "This account does not exist on Bivestcoin. Please sign up first."
      );
      setLoading(false);
    } else {
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const verifyOtp = (e) => {
    let otp = e.target.value;
    setOtp(otp);

    if (otp.length === 6) {
      setSigningUp(true);
      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          onSnapshot(doc(db, "users", result.user.phoneNumber), (snapshot) => {
            // //conole.log("Snapshot>>>", snapshot.data())
            setUserData(snapshot.data());
            localStorage.setItem("FirstName", snapshot.data().firstname);
            localStorage.setItem("PhoneNumber", snapshot.data().phone_number);
          });
          setSigningUp(false);
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const signInUser = () => {
    setLoading(true);
    setErrors(null);

    if (email === "" || emailPassword === "") {
      setErrors("Please fill the needed fields.");
      setLoading(false);
    } else {
      signInWithEmailAndPassword(auth, email, emailPassword)
        .then((userCredentials) => {
          console.log(userCredentials.user);
          if (userCredentials.user.emailVerified === false) {
            auth.signOut().then(() => {
              axios
                .post(
                  `https://bivestcoin-email-server.herokuapp.com/send-verification-email`,
                  {
                    email: email,
                  }
                )
                .then((res) => {
                  console.log(res);
                  setLoading(false);
                })
                .catch((error) => {
                  console.error(error);
                  setLoading(false);
                });
              navigate("/email_verify", {
                state: {
                  email: email,
                },
              });
            });
          } else {
            try {
              getDoc(doc(db, "users", email)).then((snapshot) => {
                setUserData(snapshot.data());
                localStorage.setItem("FirstName", snapshot.data().firstname);
                localStorage.setItem("Email", email);
                setLoading(false);
                navigate("/");
              });
            } catch (err) {
              console.error(err);
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error message>>>", err.message);
          if (err.message === "Firebase: Error (auth/wrong-password).") {
            setErrors("Wrong Password.");
          } else if (
            err.message ===
            "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
          ) {
            setErrors(
              "Account temporarily disabled. Please contact customer support."
            );
          } else if (err.message === "Firebase: Error (auth/user-not-found).") {
            setErrors("This account does not exist in our database.");
          }
        });
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

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div></div>

      <Paper
        style={{
          width: "95%",
          maxWidth: "500px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "2rem 0",
        }}
      >
        <p
          style={{
            fontSize: 25,
            fontWeight: "700",
            color: primaryColor,
            padding: "0rem 0 1rem 0",
          }}
        >
          Login
        </p>
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
          <div style={{ width: "92%", margin: "2rem auto 0 auto" }}>
            <div style={{ margin: "auto", width: "85%", overflow: "hidden" }}>
              <PhoneInput
                country={"us"}
                value={phone}
                onChange={(phone) => {
                  setErrors(null);
                  setPhone(`+${phone}`);
                }}
                style={{
                  width: "100%",
                  margin: "0 auto .5rem auto",
                  fontFamily: "Poppins, sans-serif",
                  border: "1px #B4AAF9 solid",
                  borderRadius: "5px",
                  padding: "5px 2px",
                  background: "#fff",
                }}
                inputStyle={{ border: "none", width: "100%" }}
                buttonStyle={{ border: "none", background: "none" }}
                containerStyle={{}}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "0 auto .5rem auto",
                width: "85%",
                background: "#fff",
                border: "1px solid",
                borderColor: icons,
                borderRadius: "5px",
                padding: "0 5px",
              }}
            >
              <input
                className={classes.input}
                type="text"
                style={{
                  width: windowDimenion.winWidth < 600 && 250,
                }}
                placeholder="Get Verification Code"
                value={otp}
                onChange={(e) => {
                  setErrors(null);
                  verifyOtp(e);
                }}
              />
              <div
                style={{
                  marginLeft: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={onSignInSubmit}
              >
                {loading ? (
                  <Lottie options={defaultOptions} height={40} width={40} />
                ) : (
                  <BsFillTelephoneInboundFill
                    style={{ fontSize: 20, color: primaryColorDark }}
                  />
                )}
              </div>
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
                marginTop: "",
              }}
            >
              <div id="recaptcha-container" />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: ".5rem",
              }}
            >
              <div
                style={{
                  width: windowDimenion.winWidth < 600 ? "85%" : 300,
                  background: signingUp ? "#fff" : primaryColor,
                  padding: ".6rem",
                  borderRadius: 5,
                  cursor: "pointer",
                  border: signingUp ? "0.5px solid #ccc" : "none",
                }}
              >
                <p style={{ color: signingUp ? primaryColor : "#fff" }}>
                  {signingUp ? (
                    <Lottie
                      options={defaultOptions}
                      height={30}
                      width={30}
                      background={iconsLight}
                      style={{ fontSize: "30px" }}
                    />
                  ) : (
                    "Login"
                  )}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: ".5rem auto 0 auto",
                width: "85%",
              }}
            >
              <div />
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
                Don't have an account yet?{" "}
                <Link to="/signup" style={{ color: "blue" }}>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        )}

        {value === 0 && (
          <div style={{ width: "92%", margin: "2rem auto 0 auto " }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "0 auto .5rem auto",
                width: "85%",
                background: "#fff",
                border: "1px solid",
                borderColor: icons,
                borderRadius: "5px",
                // padding: 5
              }}
            >
              <input
                className={classes.input}
                type="email"
                style={{
                  padding: ".6rem 5px",
                }}
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(null);
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "0 auto .5rem auto",
                width: "85%",
                background: "#fff",
                border: "1px solid",
                borderColor: icons,
                borderRadius: "5px",
                padding: "0",
              }}
            >
              <input
                className={classes.input}
                type={showPassword ? "text" : "password"}
                style={{ width: windowDimenion.winWidth < 768 && 300 }}
                placeholder="Enter Password"
                value={emailPassword}
                onChange={(e) => {
                  setEmailPassword(e.target.value);
                  setErrors(null);
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
                justifyContent: "space-between",
                margin: ".5rem auto 0 auto",
                width: "85%",
              }}
            >
              <div />
            </div>

            {errors && (
              <div style={{ marginTop: 20 }}>
                <p style={{ color: "red", fontSize: 12 }}>{errors}</p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: ".5rem",
              }}
            >
              <div
                style={{
                  width: windowDimenion.winWidth < 600 ? "85%" : 300,
                  background: signingUp ? "#fff" : primaryColor,
                  padding: ".6rem",
                  borderRadius: 5,
                  cursor: "pointer",
                  border: signingUp ? "0.5px solid #ccc" : "none",
                }}
                onClick={signInUser}
              >
                <p style={{ color: "#fff" }}>
                  {loading ? "Login in..." : "Login"}
                </p>
              </div>
            </div>

            <div style={{ marginTop: 50 }}>
              <p style={{ fontSize: 10 }}>
                Continue to log in if you agree to{" "}
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
                Don't have an account yet?{" "}
                <Link to="/signup" style={{ color: "blue" }}>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default Login;
