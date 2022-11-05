import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { GiJetPack } from "react-icons/gi";
import Lottie from "react-lottie";
import animationData from "../animations/email.json";
import { useLocation } from "react-router-dom";
import axios from "axios";
import loadingAnimation from "../loading.json";

const primaryColor = "#F0B90B";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const defaultOptionsLoading = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px 20px",
  },
  modal: {
    boxShadow: "0 0 10px 2px #ccc",
    borderRadius: 10,
    padding: "20px 10px",
    marginTop: 100,
  },
  jetBody: {
    background: primaryColor,
    borderRadius: "50%",
    padding: 10,
    maxWidth: 50,
  },
  textBody: {
    textAlign: "left",
    marginTop: 20,
  },
});

const EmailVerify = () => {
  const classes = useStyles();
  const location = useLocation();
  const email = location.state.email;
  const [loading, setLoading] = useState(false);

  const resendVerificationLink = () => {
    setLoading(true);
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
  };

  return (
    <div className={classes.container}>
      <div className={classes.modal}>
        <div className={classes.jetBody}>
          <GiJetPack style={{ color: "#fff" }} />
        </div>

        <div className={classes.textBody}>
          <p style={{ color: "#333", fontSize: 25 }}>Verify your account</p>
          <p style={{ color: "#333", fontSize: 15, marginTop: 10 }}>
            Account activation link has been sent to the email link you provided
          </p>
        </div>

        <div style={{ marginTop: 10 }}>
          <Lottie options={defaultOptions} height={150} width={150} />
        </div>

        <div style={{ marginTop: 30 }}>
          {loading ? (
            <Lottie options={defaultOptionsLoading} height={30} width={30} />
          ) : (
            <p
              style={{ color: primaryColor }}
              onClick={() => resendVerificationLink()}
            >
              Didin't get the mail? Send it again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
