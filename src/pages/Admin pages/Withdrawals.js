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
import { TbCopy } from "react-icons/tb";
import { Tooltip, IconButton } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Notifications from "../../components/Home/Notifications";

const primaryColor = "#F0B90B";

const useStyles = makeStyles({
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: primaryColor,
      color: "#333",
    },
  },
});

const Withdrawals = () => {
  const classes = useStyles();
  const [approvedData, setApprovedData] = useState();
  const [unapprovedData, setUnapprovedData] = useState();
  const [copied, setCopied] = useState(false);
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });
  const [value, setValue] = useState(0);
  const handleChange = (event, value) => {
    setValue(value);
  };
  const [reason, setReason] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    //conole.log(windowDimenion);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  const getApprovedWithdrawalRequests = async () => {
    try {
      const q = query(
        collection(db, "withdrawal_requests"),
        where("status", "==", "Approved"),
        orderBy("createdAt", "desc")
      );
      const snapshots = await getDocs(q);
      console.log(
        "Withdrawal Requests>>>",
        snapshots.docs.map((doc) => doc.data())
      );
      let list = [];
      snapshots.docs.map((doc) => {
        list.push({ ...doc.data(), id: doc.id });
        setApprovedData(list);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getUnapprovedWithdrawalRequests = async () => {
    try {
      const q = query(
        collection(db, "withdrawal_requests"),
        where("status", "==", "Pending"),
        orderBy("createdAt", "desc")
      );
      const snapshots = await getDocs(q);
      console.log(
        "Withdrawal Requests>>>",
        snapshots.docs.map((doc) => doc.data())
      );
      let list = [];
      snapshots.docs.map((doc) => {
        list.push({ ...doc.data(), id: doc.id });
        setUnapprovedData(list);
      });
    } catch (err) {
      console.log(err);
    }
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
    getApprovedWithdrawalRequests();
    getUnapprovedWithdrawalRequests();
  }, []);

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  const approveRequest = async (docId) => {
    setApproveLoading(true);
    try {
      const docToUpdate = doc(db, "withdrawal_requests", docId);
      await updateDoc(docToUpdate, {
        status: "Approved",
      });
      setApproveLoading(false);
      setMessage("Done");
    } catch (err) {
      console.log(err);
      setApproveLoading(false);
    }
  };

  const declineRequest = async (docId) => {
    setDeclineLoading(true);
    if (reason === "") {
      setDeclineLoading(false);
      setError("You need to set a decline reason.");
    } else {
      try {
        const docToUpdate = doc(db, "withdrawal_requests", docId);
        await updateDoc(docToUpdate, {
          status: "Declined",
          reason: reason,
        });
        setDeclineLoading(false);
        setMessage("Done");
      } catch (err) {
        console.log(err);
        setDeclineLoading(false);
      }
    }
  };

  return (
    <div style={{ textAlign: "left", padding: 20 }}>
      <h1 style={{ textAlign: "left" }}>Bivestcoin Withdrawal Requests</h1>

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
            label="Approved"
          />
          <Tab
            style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}
            label="Unapproved"
          />
        </Tabs>
        {value === 0 && (
          <div>
            {approvedData ? (
              <>
                {approvedData.map((detail) => (
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
                      {detail.name}
                    </p>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>Requesting:</p>
                      <p style={{ marginLeft: 10 }}>${detail.amount}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <p style={{ fontWeight: "600" }}>User Balance:</p>
                      <p style={{ marginLeft: 10 }}>${detail.balance}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <p style={{ fontWeight: "600" }}>Status:</p>
                      <p
                        style={{
                          marginLeft: 10,
                          color: detail.status === "Pending" ? "red" : "green",
                        }}
                      >
                        {detail.status === "Pending"
                          ? "Unapproved"
                          : "Approved"}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <p style={{ fontWeight: "600" }}>Withdrawal Address:</p>
                      <p
                        style={{
                          marginLeft: 10,
                        }}
                      >
                        {windowDimenion.winWidth < 768 ? (
                          <>{truncateString(detail.withdrawal_address, 6)}</>
                        ) : (
                          <>{truncateString(detail.withdrawal_address, 20)}</>
                        )}
                      </p>
                      <Tooltip title={copied ? "Copied to clipboard" : "copy"}>
                        <IconButton>
                          <TbCopy
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              copyToClipboard(detail.withdrawal_address)
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </div>

                    {detail.status === "Pending" ? (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <button
                            onClick={() => approveRequest(detail.id)}
                            style={{ padding: "3px 18px" }}
                          >
                            {approveLoading ? "Loading..." : "Approve Request"}
                          </button>
                          <button
                            onClick={() => declineRequest(detail.id)}
                            style={{ padding: "3px 18px", marginLeft: 20 }}
                          >
                            {declineLoading ? "Loading..." : "Decline Request"}
                          </button>
                        </div>
                        <textarea
                          placeholder="Reason for decline..."
                          style={{
                            width: 300,
                            marginTop: 20,
                            padding: 10,
                            outline: "none",
                          }}
                          value={reason}
                          onChange={(e) => {
                            setReason(e.target.value);
                            setError(null)
                          }}
                        />
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                      </div>
                    ) : null}
                  </div>
                ))}
              </>
            ) : approvedData && approvedData.length === 0 ? (
              <p>No Withdrawal Requests At The Moment.</p>
            ) : (
              <p>Fetching withdrawal requests...</p>
            )}
          </div>
        )}

        {value === 1 && (
          <div>
            {unapprovedData ? (
              <>
                {unapprovedData.map((detail) => (
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
                      {detail.name}
                    </p>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ fontWeight: "600" }}>Requesting:</p>
                      <p style={{ marginLeft: 10 }}>${detail.amount}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <p style={{ fontWeight: "600" }}>User Balance:</p>
                      <p style={{ marginLeft: 10 }}>${detail.balance}</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <p style={{ fontWeight: "600" }}>Status:</p>
                      <p
                        style={{
                          marginLeft: 10,
                          color: detail.status === "Pending" ? "red" : "green",
                        }}
                      >
                        {detail.status === "Pending"
                          ? "Unapproved"
                          : "Approved"}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <p style={{ fontWeight: "600" }}>Withdrawal Address:</p>
                      <p
                        style={{
                          marginLeft: 10,
                        }}
                      >
                        {windowDimenion.winWidth < 768 ? (
                          <>{truncateString(detail.withdrawal_address, 6)}</>
                        ) : (
                          <>{truncateString(detail.withdrawal_address, 20)}</>
                        )}
                      </p>
                      <Tooltip title={copied ? "Copied to clipboard" : "copy"}>
                        <IconButton>
                          <TbCopy
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              copyToClipboard(detail.withdrawal_address)
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </div>

                    {detail.status === "Pending" ? (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 5,
                          }}
                        >
                          <button
                            onClick={() => approveRequest(detail.id)}
                            style={{ padding: "3px 18px" }}
                          >
                            {approveLoading ? "Loading..." : "Approve Request"}
                          </button>
                          <button
                            onClick={() => declineRequest(detail.id)}
                            style={{ padding: "3px 18px", marginLeft: 20 }}
                          >
                            {declineLoading ? "Loading..." : "Decline Request"}
                          </button>
                        </div>

                        <textarea
                          placeholder="Reason for decline..."
                          style={{
                            width: 300,
                            marginTop: 20,
                            padding: 10,
                            outline: "none",
                          }}
                          value={reason}
                          onChange={(e) => {
                            setReason(e.target.value);
                            setError(null);
                          }}
                        />
                        {message && <p>{message}</p>}
                        {error && <p style={{ color: "red" }}>{error}</p>}
                      </div>
                    ) : null}
                  </div>
                ))}
              </>
            ) : approvedData && approvedData.length === 0 ? (
              <p>No Withdrawal Requests At The Moment.</p>
            ) : (
              <p>Fetching withdrawal requests...</p>
            )}
          </div>
        )}
      </Paper>
    </div>
  );
};

export default Withdrawals;
