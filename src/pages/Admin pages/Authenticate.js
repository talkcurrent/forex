import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
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
  getDoc,
} from "firebase/firestore";
import db from "../../store/server.config";
import { Tooltip, IconButton } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Notifications from "../../components/Home/Notifications";

const primaryColor = "#F0B90B";

const useStyles = makeStyles((theme) => ({
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: primaryColor,
      color: "#333",
    },
  },
}));

const Authenticate = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [verifiedData, setVerifiedData] = useState();
  const [pendingData, setPendingData] = useState();
  const [declinedData, setDeclinedData] = useState();
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (event, value) => {
    setValue(value);
  };

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

  const verify = async (docId) => {
    setVerifyLoading(true);
    try {
      const docToUpdate = doc(db, "verification", docId);
      await updateDoc(docToUpdate, {
        status: "approved",
      }).then(async () => {
        setVerifyLoading(false);
        setMessage("Verified!");
        const docRef = await getDoc(docToUpdate);
        console.log(docRef.data());
        const userDocToUpdate = doc(db, "users", docRef.data().userID);
        await updateDoc(userDocToUpdate, {
          authenticated: true,
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const decline = async (docId) => {
    setDeclineLoading(true);
    try {
      const docToUpdate = doc(db, "verification", docId);
      await updateDoc(docToUpdate, {
        status: "declined",
      }).then(() => {
        setDeclineLoading(false);
        setMessage("Declined!");
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getVerifiedData = async () => {
    try {
      const q = query(
        collection(db, "verification"),
        where("status", "==", "approved")
      );
      const snapshots = await getDocs(q);
      console.log(
        "Approved Verifications>>>",
        snapshots.docs.map((doc) => doc.data())
      );
      let list = [];
      snapshots.docs.map((doc) => {
        list.push({ ...doc.data(), id: doc.id });
        setVerifiedData(list);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getDeclinedData = async () => {
    try {
      const q = query(
        collection(db, "verification"),
        where("status", "==", "declined")
      );
      const snapshots = await getDocs(q);
      console.log(
        "Declined Verifications>>>",
        snapshots.docs.map((doc) => doc.data())
      );
      let list = [];
      snapshots.docs.map((doc) => {
        list.push({ ...doc.data(), id: doc.id });
        setDeclinedData(list);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getPendingData = async () => {
    try {
      const q = query(
        collection(db, "verification"),
        where("status", "==", "pending")
      );
      const snapshots = await getDocs(q);
      console.log(
        "Pending Verifications>>>",
        snapshots.docs.map((doc) => doc.data())
      );
      let list = [];
      snapshots.docs.map((doc) => {
        list.push({ ...doc.data(), id: doc.id });
        setPendingData(list);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVerifiedData();
    getDeclinedData();
    getPendingData();
  }, []);

  return (
    <div style={{ textAlign: "left", padding: 20 }}>
      <h1 style={{ textAlign: "left" }}>Bivestcoin ID Verification Center</h1>

      <Paper
        style={{
          width: "95%",
          boxShadow: "none",
          margin: "auto",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab
            style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
            label={`Verified ${
              verifiedData === undefined ? 0 : verifiedData.length
            }`}
          />
          <Tab
            style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
            label={`Declined ${
              declinedData === undefined ? 0 : declinedData.length
            }`}
          />
          <Tab
            style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
            label={`Pending ${
              pendingData === undefined ? 0 : pendingData.length
            }`}
          />
        </Tabs>
        {value === 0 && (
          <div>
            {verifiedData ? (
              <>
                {verifiedData.map((detail) => (
                  <div
                    style={{
                      background: "#ccc",
                      padding: 20,
                      margin: "10px 0px",
                    }}
                  >
                    <p
                      key={detail.id}
                      style={{ margin: "10px auto", fontWeight: "bold" }}
                    >
                      {detail.fullName}
                    </p>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>ID type:</p>
                      <p style={{ marginLeft: 10 }}>{detail.item_name}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>ID number:</p>
                      <p style={{ marginLeft: 10 }}>{detail.id_number}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: "600" }}>Back</p>
                        <img style={{ width: 300 }} src={detail.frontPic} />
                      </div>
                      <div style={{ marginLeft: 20 }}>
                        <p style={{ fontWeight: "600" }}>Front</p>
                        <img style={{ width: 300 }} src={detail.backPic} />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>Status:</p>
                      <p style={{ marginLeft: 10 }}>{detail.status}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              verifiedData === undefined && <p>No Verified IDs at the moment</p>
            )}
          </div>
        )}

        {value === 1 && (
          <div>
            {declinedData ? (
              <>
                {declinedData.map((detail) => (
                  <div
                    style={{
                      background: "#ccc",
                      padding: 20,
                      margin: "10px 0px",
                    }}
                  >
                    <p
                      key={detail.id}
                      style={{ margin: "10px auto", fontWeight: "bold" }}
                    >
                      {detail.fullName}
                    </p>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>ID type:</p>
                      <p style={{ marginLeft: 10 }}>{detail.item_name}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>ID number:</p>
                      <p style={{ marginLeft: 10 }}>{detail.id_number}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: "600" }}>Back</p>
                        <img style={{ width: 300 }} src={detail.frontPic} />
                      </div>
                      <div style={{ marginLeft: 20 }}>
                        <p style={{ fontWeight: "600" }}>Front</p>
                        <img style={{ width: 300 }} src={detail.backPic} />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>Status:</p>
                      <p style={{ marginLeft: 10 }}>{detail.status}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              declinedData === undefined && <p>No Declined IDs at the moment</p>
            )}
          </div>
        )}

        {value === 2 && (
          <div>
            {pendingData ? (
              <>
                {pendingData.map((detail) => (
                  <div
                    style={{
                      background: "#ccc",
                      padding: 20,
                      margin: "10px 0px",
                    }}
                  >
                    <p
                      key={detail.id}
                      style={{ margin: "10px auto", fontWeight: "bold" }}
                    >
                      {detail.fullName}
                    </p>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>ID type:</p>
                      <p style={{ marginLeft: 10 }}>{detail.item_name}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>ID number:</p>
                      <p style={{ marginLeft: 10 }}>{detail.id_number}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: "600" }}>Back</p>
                        <img style={{ width: 300 }} src={detail.frontPic} />
                      </div>
                      <div style={{ marginLeft: 20 }}>
                        <p style={{ fontWeight: "600" }}>Front</p>
                        <img style={{ width: 300 }} src={detail.backPic} />
                      </div>
                    </div>

                    {message === null ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: 5,
                        }}
                      >
                        <button
                          onClick={() => verify(detail.id)}
                          className="btn btn-full"
                        >
                          {verifyLoading ? "Verifying..." : "Verify"}
                        </button>
                        <button
                          onClick={() => decline(detail.id)}
                          className="btn btn-full"
                          style={{ marginLeft: 10 }}
                        >
                          {declineLoading ? "Declining..." : "Decline"}
                        </button>
                      </div>
                    ) : (
                      <p>{message}</p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              pendingData === undefined && (
                <p>No Pending verifications at the moment</p>
              )
            )}
          </div>
        )}
      </Paper>
    </div>
  );
};

export default Authenticate;
