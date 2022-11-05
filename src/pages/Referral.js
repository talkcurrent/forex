import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { BiUserCircle } from "react-icons/bi";
import { FaShare } from "react-icons/fa";
import { MdControlPoint } from "react-icons/md";
import { TbAccessPointOff } from "react-icons/tb";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../store/context";
import { TbAward, TbCopy, TbUsers } from "react-icons/tb";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import db from "../store/server.config";
import { BsClockFill } from "react-icons/bs";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";
import { TiFlowChildren } from "react-icons/ti";
import Sidebar from "../components/Home/Sidebar";
import awardReferrer from "../utils/awardReferrer";
import { Tooltip, IconButton } from "@material-ui/core";
import moment from "moment";

const primaryColor = "#F0B90B";
const primaryColorActive = "#c19810";
const primaryColor2 = "#ccc";
const icons = "#B4AAF9";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const useStyles = makeStyles((theme) => ({
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "#d1d1d1",
    },
  },
  transfer_box: {
    display: "flex",
    justifyContent: "center",
    width: 1030,
    margin: "auto",
    marginTop: 20,
    marginBottom: 50,
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      width: 300,
    },
  },
}));

const Referral = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { darkTheme, setRoute } = useContext(GlobalContext);
  const handleChange = (event, value) => {
    setValue(value);
  };
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState();
  const [errors, setErrors] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [userID, setUserID] = useState();
  const [loading, setLoading] = useState(false);

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error(err);
      setCopied(false);
    }
  };

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
      try {
        onSnapshot(doc(db, "users", email), (snapshot) => {
          setUserData(snapshot.data());
          setUserID(snapshot.id);
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
        onSnapshot(doc(db, "users", phone), (snapshot) => {
          setUserData(snapshot.data());
          setUserID(snapshot.id);
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
  };

  const transferBonus = async () => {

    //Helper Function
    const getfirstChar = (num) => {
      console.log(String(num)[0]);
      return String(num)[0];
    };

    
    setLoading(true);
    setSuccessMsg(null);
    setErrors(null);
    const number = parseFloat(amount);
    const firstChar = getfirstChar(number)
    console.log(firstChar)
    if (number > userData.bonus - 5) {
      setErrors("Insufficient Referral funds.");
      setLoading(false);
    } else if (firstChar === "0") {
      console.log("less than 1");
      setErrors("You can't transfer less than $1.");
      setLoading(false);
      } else {
        const docRef = doc(db, "users", userID);

        await updateDoc(docRef, {
          bonus: userData.bonus - number,
          balance: userData.balance + number,
        }).then(() => {
          setLoading(false);
          setSuccessMsg("Transfer successful.");
        });
    }
  };

  return (
    <div>
      <div className="referrals-top container">
        <BiChevronLeft
          fontSize={25}
          onClick={() => {
            navigate("/my_account");
          }}
        />
        <p>Referrals</p>
        <span></span>
      </div>
      <div className="container" style={{ marginTop: 50 }}>
        <div className="top-text" style={{ marginBottom: 50 }}>
          <p style={{ width: 300, margin: "auto" }}>
            If you have issues transferring your bonus, please contact customer support.
          </p>
        </div>
        <div className="ref-top">
          <div className="ref-box">
            <div>
              <TbAward fontSize={20} color={primaryColor} />
            </div>
            <div className="ref-box-items">
              <p>Total rewards</p>
              <h4>{userData ? userData.bonus.toFixed(2) : "0.00"}</h4>
            </div>
          </div>
          <div className="ref-box">
            <div>
              <TbUsers fontSize={20} color={primaryColor} />
            </div>
            <div className="ref-box-items">
              <p>Class 1-invitee</p>
              <h4>{userData?.classOneBonus?.toFixed(2) || "0.00"}</h4>
            </div>
          </div>
          <div className="ref-box">
            <div>
              <TbUsers fontSize={20} color={primaryColor} />
            </div>
            <div className="ref-box-items">
              <p>Class 2-invitee</p>
              <h4>{userData?.classTwoBonus?.toFixed(2) || "0.00"}</h4>
            </div>
          </div>
          <div className="ref-box">
            <div>
              <TbUsers fontSize={20} color={primaryColor} />
            </div>
            <div className="ref-box-items">
              <p>Class 3-invitee</p>
              <h4>{userData?.classThreeBonus?.toFixed(2) || "0.00"}</h4>
            </div>
          </div>
        </div>
        {/* <button
          onClick={() => {
            if (userData?.referrerId) {
              awardReferrer(100, userData.referrerId);
              addDoc(collection(db, "referrals"), {
                amount_deposited: 100,
                referrerId: userData.referrerId,
                referral: userData.firstname + " " + userData.lastname,
                createdAt: moment(new Date()).format("YYYY-MMM-DD, hh:mm A"),
              });
            }
          }}
        >
          Award Referrer
        </button> */}
        {/* ---------------------------------------invitation link */}
        <div className="invi">
          <div className="invi-top tap">
            <p>Invitation Code</p>
            <span>bivestcoin.com/signup/{userData?.referralcode}</span>
            <Tooltip title={copied ? "Copied to clipboard" : "copy"}>
              <IconButton>
                <TbCopy
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    copyToClipboard(
                      `https://bivestcoin.com/signup/${userData?.referralcode}`
                    )
                  }
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* ----------------------------------------- invitee report */}
        <div
          className="invi-report tap"
          onClick={() => {
            navigateToScreen("invitee_report");
            setRoute("/invitee_report");
          }}
        >
          <TiFlowChildren />
          <p>Invitee Report</p>
          <BiChevronRight fontSize={25} />
        </div>

        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 15 }}>Tranfer Bonus</p>
        </div>
        <div className={classes.transfer_box}>
          <input
            placeholder="Transfer bonus to wallet"
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
              outline: "none",
              color: "#777",
            }}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors(null);
              setSuccessMsg(null);
            }}
          />
          {errors && (
            <p style={{ fontSize: 15, marginTop: 10, color: "red" }}>
              {errors}
            </p>
          )}
          {successMsg && (
            <p style={{ fontSize: 15, marginTop: 10, color: "green" }}>
              {successMsg}
            </p>
          )}
          <button
            className="btn btn-full"
            style={{ margin: 20 }}
            onClick={() => transferBonus()}
          >
            {loading ? "Transferring..." : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// userData ? userData.bonus.toFixed(2) : "0.00"
export default Referral;
