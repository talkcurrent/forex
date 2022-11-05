import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { AiFillGift } from "react-icons/ai";
import { GlobalContext } from "../store/context";
import { onSnapshot, doc } from "firebase/firestore";
import db from "../store/server.config";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Home/Sidebar";
import { BiChevronLeft } from "react-icons/bi";

const primaryColor = "#F0B90B";
const primaryColorActive = "#c19810";

const useStyles = makeStyles({});

const RewardCenter = () => {
  const { darkTheme, setRoute } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState();

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), (snapshot) => {
          setUserData(snapshot.data());
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
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const classes = useStyles();
  return (
        <div>
          <div className="referrals-top container">
            <BiChevronLeft fontSize={ 25 } onClick={() => {navigate("/my_account")}} />
            <p>Reward Center</p>
            <span> </span>
          </div>
          <div
            style={{
              fontFamily: "Poppins, sanf-serif",
              background: darkTheme === false ? "#fff" : "#333",
              padding: 20,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <p>REWARD BONUS</p>
              <div style={{ marginTop: 20 }}>
                <p>Balance (USDT) - ${userData && userData.bonus.toFixed(2)}</p>
              </div>
              <div
                style={{
                  margin: "0px 10px",
                  background: darkTheme === false ? primaryColor : "#ffdf10",
                  padding: "10px",
                  borderRadius: 50,
                  "&:active": {
                    background: primaryColorActive,
                  },
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 20
                }}
                onClick={() => {
                  navigate("/trade");
                  setRoute("/trade")
                }}
              >
                <p>Trade</p>
              </div>
            </div>
          </div>
        </div>
  );
};

export default RewardCenter;
