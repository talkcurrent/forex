import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { RiNotification3Line } from "react-icons/ri";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import db from "../../store/server.config";
import moment from "moment";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  body: {
    maxWidth: 1200,
    margin: "auto",
    textAlign: "left",
  },
  deposit_box: {
    margin: "20px 0px",
    display: "flex",
    alignItems: "center",
    // justifyContent: "space-evenly",
    width: "100%",
  },
  notifications: {
    position: "relative",
    marginLeft: 20,
  },
  noti_count: {
    position: "absolute",
    background: "red",
    borderRadius: 50,
    color: "white",
    width: 18,
    display: "flex",
    justifyContent: "center",
    fontSize: 12,
    top: -10,
    right: -8,
  },
  noti_icon: {
    fontSize: 20,
  },
  latest_text: {
    marginLeft: 20,
  },
}));

const Notifications = () => {
  const classes = useStyles();
  const [depositData, setDepositData] = useState();
  const [depLength, setDepLength] = useState()

  const fetchNewDeposit = async () => {
    const colRef = collection(db, "transactions");
    const documents = await getDocs(colRef);
    const docLength = documents.docs.length
    setDepLength(docLength);
    const queriedDoc = await query(
      colRef,
      orderBy("dateTime", "desc"),
      limit(1)
    );
    onSnapshot(queriedDoc, (snapshot) => {
      // console.log(
      //   "Queried Doc>>>",
      //   snapshot.docs.map((doc) => doc.data())
      // );
      setDepositData(snapshot.docs.map((doc) => doc.data()));
    });
  };

  useEffect(() => {
    fetchNewDeposit();
  }, []);

  return (
    <div className={classes.body}>
      <div className={classes.deposit_box}>
        <p>Deposit Notifications: </p>

        <div className={classes.notifications}>
          <RiNotification3Line className={classes.noti_icon} />
          <div className={classes.noti_count}>
            <p>{depLength && depLength}</p>
          </div>
        </div>

        {depositData &&
          depositData.map((data) => (
            <div className={classes.latest_text}>
              <p>
                Latest deposit was made by {data.name} on{" "}
                {moment(data.dateTime).format("MMM Do YYYY, hh:mm A")}.{" "}
                <Link to="/_563289gMINDA774">See all deposits {"->"}</Link>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Notifications;
