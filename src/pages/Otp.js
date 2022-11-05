import React, { useState, useContext } from "react";
import Header from "../components/Home/Header";
import PhoneInput from "react-phone-input-2";
import { makeStyles } from "@material-ui/core";
import { setDoc, doc, addDoc, collection } from "firebase/firestore";
import db, { auth } from "../store/server.config";
import Lottie from "react-lottie";
import { GlobalContext } from "../store/context";
import { Link, useNavigate, useParams } from "react-router-dom";
import animationData from "../loading.json";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const primaryColor = "#F0B90B";
const primaryColorDark = "#393091";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const myStyle = makeStyles({
  container: {
    margin: "10rem auto 0 auto",
    width: "80%",
  },
  head: {
    boxShadow: "0px 3px 10px #c1c1c1",
    background: "#ff7200",
    height: "4rem",
  },
  headP: {
    color: primaryColor,
    fontWeight: "600",
  },
  button: {
    fontFamily: "Poppins, sans-serif",
    background: primaryColor,
    width: "91%",
    maxWidth: "300px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "medium",
    padding: ".5rem ",
    margin: ".5rem 0 0 0",
    color: iconsLight,
    boxShadow: "0px 1px 7px #ddd",
    "&:active": {
      background: primaryColorDark,
    },
  },
  btnDiv: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    fontFamily: "Poppins, sans-serif",
    padding: ".6rem 0",
    border: "none",
    width: "100%",
    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
  form: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff",
    borderRadius: "10px",
    padding: "5rem 0",
    boxShadow: "1px 1px 5px #ccc",
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

const Otp = () => {
  const classes = myStyle();

  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState(null);
  const [otp, setOtp] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const { setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        callback: (response) => {},
      },
      auth
    );
  };

  const onSignInSubmit = () => {
    setLoading(true);
    if (phone === "") {
      setLoading(false);
      setErrors("Please fill the needed fields.");
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
          const newUser = {
            phone_number: phone,
          };
          // //conole.log(result.user)

          setDoc(doc(db, "users", phone), newUser);
          setUserData(newUser);
          localStorage.setItem("PhoneNumber", phone);
          setSigningUp(false);
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className={classes.head}>
        <Header />
      </div>
      <div className={classes.container}>
        <form className={classes.form}>
          <p className={classes.headP}>Verify your Phone Number</p>
          <div style={{ marginTop: 20 }}>
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={(phone) => {
                setErrors(null);
                setPhone(`+${phone}`);
              }}
              style={{ fontFamily: "Poppins, sans-serif" }}
              onlyCountries={["us", "ng", "ke"]}
            />
          </div>
          <div
            style={{
              background: "none",
              width: "91%",
              maxWidth: "300px",
              border: "1px #ccc solid",
              borderRadius: "5px",
              margin: ".8rem",
            }}
          >
            <input
              className={classes.input}
              type="text"
              style={{
                width: windowDimenion.winWidth < 600 && 250,
              }}
              placeholder="Enter Verification Code"
              value={otp}
              onChange={(e) => {
                setErrors(null);
                verifyOtp(e);
              }}
            />
            {/* <div style={{ marginLeft: 8 }}>
                {loading ? (
                  <Lottie options={defaultOptions} height={30} width={30} />
                ) : (
                  <Phone />
                )}
              </div> */}
          </div>
          <button
            className={classes.button}
            options={defaultOptions}
            onClick={onSignInSubmit}
          >
            Get OTP
          </button>
          <p style={{ fontSize: "15px", marginTop: "1rem" }}>
            <Link to="/otp-email">Email Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Otp;
