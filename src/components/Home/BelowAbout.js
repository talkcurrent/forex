import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { MdOutlineSecurity } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { CgArrowsExchange } from "react-icons/cg";
import { RiVipCrownLine } from "react-icons/ri";


const primaryColor = "#F0B90B";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "100px 30px",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    fontSize: 100,
    margin: "0px auto",
    color: primaryColor,
  },
  iconBox: {
    margin: "0px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
});

const BelowAbout = () => {
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

  const items = [
    { icon:<MdOutlineSecurity/>, heading: "Security", desc:" Comprehensive financial risk control and security system. Wallet, multi-signature system ensure the safety of your assets."},
    { icon:<FiClock/>, heading: "24H Services", desc:" 24H online manual checking prevents customers from missing the best investment opportunities."},
    { icon:<CgArrowsExchange/>, heading: "Global Exchange", desc:" Global service helps you invest into encrypted assets from across the world and trade with global users."},
    { icon:<RiVipCrownLine/>, heading: "Premium Assets", desc:" Quality encrypted projects are selected strictly to shield you entirely from extremely high-risk projects."},
  ]

  return (
    <>
      {windowDimenion.winWidth < 600 ? (
        <></>
      ) : (
          <div className="below-about">
            {
              items && items.map((item) => (
                <div className="item-card">
                  <div className="item-icon">{ item.icon }</div>
                  <h1>{item.heading}</h1>
                  <p>{item.desc }</p>
                </div>
              )) 
          }
        </div>
      )}
    </>
  );
};

export default BelowAbout;
