import React, { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import db from "../../store/server.config";
import { makeStyles } from "@material-ui/styles";
import { Decrypt } from "../../helpers/Cypher";
import moment from "moment";
import Notifications from "../../components/Home/Notifications";

const useStyles = makeStyles({});

const Deposits = () => {
  const classes = useStyles();
  const [data, setData] = useState();
  const [privateKey, setPrivateKey] = useState();

  const getPrivateKeys = async () => {
    try {
      const colRef = query(
        collection(db, "transactions"),
        orderBy("dateTime", "desc")
      );
      onSnapshot(colRef, (snapshot) => {
        setData(snapshot.docs.map((doc) => doc.data()));
        // console.log(snapshot.docs.map(doc => doc.data()))
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPrivateKeys();
  }, []);

  return (
    <div style={{ textAlign: "left", padding: 20 }}>
      <h1 style={{ textAlign: "left" }}>Bivestcoin Users Deposits</h1>

      <Notifications />

      <div>
        {data &&
          data.map((detail) => {
            console.log(detail);
            return (
              <div
                style={{ background: "#ccc", padding: 20, margin: "10px 0px" }}
              >
                <p
                  key={detail.id}
                  style={{ margin: "10px auto", fontWeight: "bold" }}
                >
                  {detail.name}
                </p>
                <div>
                  <p style={{}}>
                    Amount Deposited: ${detail.tokenAmount / 1000000}
                  </p>
                </div>
                <div>
                  <p style={{}}>
                    Deposited Time:{" "}
                    {moment(detail.dateTime).format("MMM Do YYYY, hh:mm A")}
                  </p>
                </div>
                <div>
                  <p style={{}}>Private Key: {Decrypt(detail.privateKey)}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Deposits;
