import React, { useEffect, useState } from "react";
import { BsClockFill } from "react-icons/bs";
import { BiChevronRight, BiChevronLeft, BiCreditCard } from "react-icons/bi";
import { TiFlowChildren } from "react-icons/ti";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import db from "../store/server.config";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  referral_body: {
    width: 500,
    margin: "auto",
    marginTop: 50,
    [theme.breakpoints.down("xs")]: {
      width: 350,
      fontSize: 10,
    },
  },
  no_referral: {
    marginTop: 50,
    fontSize: 12,
  },
  detail: {
    textAlign: "left",
    fontSize: 12,
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
    },
  },
}));

const InviteeReport = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState();

  const getReferralDetails = async () => {
    const email = localStorage.getItem("Email");
    const phone = localStorage.getItem("PhoneNumber");

    if (email) {
      const q = query(
        collection(db, "referrals"),
        where("referrerId", "==", email),
        orderBy("createdAt", "desc")
      );
      const snapshots = await getDocs(q);
      console.log(
        "Referral Details>>>",
        snapshots.docs.map((doc) => doc.data())
      );
    }

    if (phone) {
      const q = query(
        collection(db, "referrals"),
        where("referrerId", "==", phone),
        orderBy("createdAt", "desc")
      );
      const snapshots = await getDocs(q);
      console.log(
        "Referral Details>>>",
        snapshots.docs.map((doc) => doc.data())
      );
      setReferrals(snapshots.docs.map((doc) => doc.data()));
    }
  };

  useEffect(() => {
    getReferralDetails();
  }, []);

  return (
    <div className="invitee-report">
      <div className="ir-top">
        <BiChevronLeft
          fontSize={25}
          onClick={() => {
            navigate("/referral");
          }}
        />
        <p>Invitee Report</p>
        <span></span>
      </div>
      <div className="container">
        <div className="top-text">
          <p>
            My team report: Level(One, two, three), TIme(Today) Some data is
            slightly delayed, please be patient
          </p>
        </div>
        {referrals ? (
          <div className={classes.referral_body}>
            {referrals.map((user) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                  boxShadow: "0px 0px 10px 2px #ccc",
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <div className={classes.detail}>
                  <p>Name</p>
                  <p>{user.referral}</p>
                </div>

                <div className={classes.detail}>
                  <p>Deposited on</p>
                  <p>{user.createdAt}</p>
                </div>

                <div className={classes.detail}>
                  <p>Deposited Amount</p>
                  <p>${user.amount_deposited}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={classes.no_referral}>You currently have no referral.</p>
        )}
      </div>
    </div>
  );
};

export default InviteeReport;
