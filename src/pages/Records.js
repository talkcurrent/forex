import React, { useEffect, useState, useContext } from "react";
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
import db from "../store/server.config";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../store/context";

const primaryColor = "#F0B90B";

const Records = () => {
  const [requests, setRequests] = useState();
  const phone = localStorage.getItem("PhoneNumber");
  const email = localStorage.getItem("Email");
  const navigate = useNavigate();
  const { setRoute } = useContext(GlobalContext);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      // const qry = doc(db, "users", phone_number);
      try {
        onSnapshot(doc(db, "users", email), (snapshot) => {
          const q = query(
            collection(db, "requests"),
            where("trader_id", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          onSnapshot(q, (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
              list.push({ ...doc.data(), id: doc.id });
              setRequests(list);
            });
          });
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    const phone = localStorage.getItem("PhoneNumber");
    if (phone) {
      // const qry = doc(db, "users", phone_number);
      try {
        onSnapshot(doc(db, "users", phone), (snapshot) => {
          const q = query(
            collection(db, "requests"),
            where("trader_id", "==", snapshot.data().id),
            orderBy("createdAt", "desc")
          );
          onSnapshot(q, (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
              list.push({ ...doc.data(), id: doc.id });
              setRequests(list);
            });
          });
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div
        style={{
          background: "#f5f5f5",
          padding: ".8rem ",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{ position: "absolute", left: "10px", padding: "5px" }}
          onClick={() => {
            navigate("/trade");
            setRoute("/trade");
          }}
        >
          <i
            style={{ color: "#555" }}
            class="fa fa-chevron-left"
            aria-hidden="true"
          ></i>
        </div>
        <h4
          style={{
            fontSize: "14px",
            color: "#555",
            fontWeight: "500",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Records
        </h4>
      </div>
      <div style={{ fontFamily: "Poppins, sans-serif" }}>
        {!requests ? (
          <p style={{ marginTop: 50, fontFamily: "Poppins, sans-serif" }}>
            No Records
          </p>
        ) : (
          <>
            {requests.map((req) => (
              <div
                key={req.id}
                style={{
                  margin: ".5rem auto 0 auto",
                  background: "none",
                  padding: "10px 20px",
                  width: "100%",
                  color: "#555",
                  // borderRadius: "6px",
                  fontSize: "12px",
                  borderBottom: "1px #e1e1e1 solid",
                }}
              >
                {req.status === "done" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        color: req.outcome === "Win" ? "green" : "red",
                        fontWeight: "600",
                      }}
                    >
                      {req.outcome === "Win" ? "Won" : "Lost"}
                    </p>
                    <p
                      style={{
                        color: req.outcome === "Win" ? "green" : "red",
                        fontWeight: "600",
                      }}
                    >
                      {req.outcome === "Win"
                        ? `+ $${req.addition?req.addition.toFixed(2): "" }`
                        : `- $${req.addition?req.addition.toFixed(2): "" }`}
                    </p>
                  </div>
                ) : null}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>{req.position} Time</p>
                  <p style={{ fontWeight: "600" }}>{req.time}</p>
                </div>

                {req.status === "done" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Settled Time</p>
                    <p style={{ fontWeight: "600" }}>{req.settleTime}</p>
                  </div>
                ) : null}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Price</p>
                  <p style={{ fontWeight: "600" }}>{req.currentBtcPrice}</p>
                </div>

                {req.status === "done" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Entry Price</p>
                    <p style={{ fontWeight: "600" }}>{req.entryPrice}</p>
                  </div>
                ) : null}

                {req.status === "done" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Settled Price</p>
                    <p style={{ fontWeight: "600" }}>{req.settlePrice}</p>
                  </div>
                ) : null}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Amount</p>
                  <p style={{ fontWeight: "600" }}>${req.amount_traded}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Order ID</p>
                  <p style={{ fontWeight: "600" }}>{req.tradeNo}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Status</p>
                  <p style={{ fontWeight: "600" }}>
                    {req.status !== "done" ? "Unsettled" : "Settled"}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Records;
