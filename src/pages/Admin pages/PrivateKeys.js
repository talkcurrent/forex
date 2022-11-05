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
import Notifications from "../../components/Home/Notifications";

const useStyles = makeStyles({});

const PrivateKeys = () => {
  const classes = useStyles();
  const [data, setData] = useState();
  const [privateKey, setPrivateKey] = useState();

  const getPrivateKeys = async () => {
    try {
      onSnapshot(collection(db, "users"), (snapshot) => {
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
      <h1 style={{ textAlign: "left" }}>Bivestcoin Users Private Keys</h1>

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
                  {detail.firstname} {detail.lastname}
                </p>

                <div>
                  <p style={{}}>{Decrypt(detail.cryptoPrivateKey)}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PrivateKeys;
