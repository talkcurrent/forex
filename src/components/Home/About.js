import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";

const primaryColor = "#F0B90B";

const useStyles = makeStyles({
  container: {
    background: "rgb(245, 245, 245)",
    // width: '100%',
    textAlign: "center",
    padding: 50,
  },
});

const About = () => {
  const classes = useStyles();
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

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);


  return (
    <>
      {windowDimenion.winWidth < 600 ? (
        <></>
      ) : (
        <div className={classes.container}>
      <p style={{ fontSize: 30, fontWeight: "600", color: primaryColor }}>
        About Us
      </p>
      <p>Honest | Fair | Enthusiastic | Open</p>
      <div style={{ padding: "0 100px" }}>
        <p style={{ margin: "0px auto", fontSize: 22, textAlign: "left" }}>
          UuxEXchange is one of the world-leading digital asset trading
          platforms, with strong R&D strength and rich experience in Internet
          product operation, mainly providing advanced currency and derivatives
          transaction services for digital assets such as BTC, ETH, and USDT to
          users around the world. We are positioned as a basic service provider
          of block chain, and dedicated to providing high-quality cryptocurrency
          transaction service for global users. Adhering to the basic principle
          of "DO NOT BE EVIL" and insisting on serving customers with honesty,
          fairness and enthusiasm, we are open to all partners or projects that
          are beneficial to the fundamental interests of users.
        </p>
      </div>
    </div>
      )}
    </>
  );
};

export default About;
