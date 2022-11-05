import React, { createContext, useState, useEffect, useRef } from "react";
import db, { auth } from "./server.config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import {
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  getDocs,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import awardReferrer from "../utils/awardReferrer";
import moment from "moment";
import CollectionRef from "../sirB/reuseables/CollectionRef";
import TimeDiffInSecs from "../sirB/reuseables/TimeDiffInSecs";
import AutomationHandler from "../sirB/automator/AutomationHandler";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [timeLeft, setTimeLeft] = useState();
  const [darkTheme, setDarkTheme] = useState(false);
  const [progressKYC, setProgressKYC] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [route, setRoute] = useState();
  const [emailState, setEmailState] = useState(0);
  const [phoneState, setPhoneState] = useState(0);
  const [authState, setAuthState] = useState(0);
  const [fundPassword, setFundPassword] = useState(0);
  const [walletAddress, setWalletAddress] = useState(0);

  const [activeTrades, setactiveTrades] = useState([]);

  // Helper Function
  const sumation = (a, b, c, d, e) => {
    return a + b + c + d + e;
  };

  useEffect(() => {
    setProgressKYC(
      sumation(emailState, phoneState, authState, fundPassword, walletAddress)
    );
  }, [emailState, phoneState, authState, fundPassword, walletAddress]);

  useEffect(() => {
    setProgressKYC(
      sumation(emailState, phoneState, authState, fundPassword, walletAddress)
    );
  }, []);

  const userHandler = (user) => (user ? setUser(user) : setUser(null));

  useEffect(() => {
    onAuthStateChanged(auth, (user) => userHandler(user));
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    if (email) {
      try {
        onSnapshot(doc(db, "users", email), (snapshot) => {
          axios
            .get(
              `https://api.trongrid.io/v1/accounts/${
                snapshot.data().cryptoWalletAddress
              }/transactions/trc20?only_confirmed=true&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
            )

            .then(async (res) => {
              const lastData = await res.data.data[0];
              console.log("Last Item>>>", lastData);

              if (lastData) {
                const q = query(
                  collection(db, "transactions"),
                  where("transactionID", "==", lastData.transaction_id)
                );

                const qSnapshot = await getDocs(q);
                if (qSnapshot.docs.length > 0) {
                  return;
                } else if (
                  lastData.from === snapshot.data().cryptoWalletAddress
                ) {
                  return;
                } else {
                  addDoc(collection(db, "transactions"), {
                    userID: snapshot.data().id,
                    transactionID: lastData.transaction_id,
                    walletAddress: lastData.to,
                    tokenAmount: lastData.value,
                    dateTime: lastData.block_timestamp,
                    userDocId: snapshot.data().docID,
                    name:
                      snapshot.data().firstname +
                      " " +
                      snapshot.data().lastname,
                    privateKey: snapshot.data().cryptoPrivateKey,
                  });
                  const q = doc(db, "users", snapshot.data().email);
                  updateDoc(q, {
                    balance: snapshot.data().balance + lastData.value / 1000000,
                  }).then(() => {
                    awardReferrer(
                      lastData.value / 1000000,
                      snapshot.data().referrerId
                    );
                    addDoc(collection(db, "referrals"), {
                      amount_deposited: lastData.value / 1000000,
                      referrerId: snapshot.data().referrerId,
                      referral:
                        snapshot.data().firstname +
                        " " +
                        snapshot.data().lastname,
                      createdAt: moment(new Date()).format(
                        "YYYY-MMM-DD, hh:mm A"
                      ),
                    });
                  });
                }
              }
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
      try {
        onSnapshot(doc(db, "users", phone), async (snapshot) => {
          await axios
            .get(
              `https://api.trongrid.io/v1/accounts/${
                snapshot.data().cryptoWalletAddress
              }/transactions/trc20?only_confirmed=true&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
            )
            .then(async (res) => {
              const lastData = await res.data.data[0];
              console.log("Last Item>>>", lastData);

              if (lastData) {
                const q = query(
                  collection(db, "transactions"),
                  where("transactionID", "==", lastData.transaction_id)
                );

                const qSnapshot = await getDocs(q);
                if (qSnapshot.docs.length > 0) {
                  return;
                } else if (
                  lastData.from === snapshot.data().cryptoWalletAddress
                ) {
                  return;
                } else {
                  addDoc(collection(db, "transactions"), {
                    userID: snapshot.data().id,
                    transactionID: lastData.transaction_id,
                    walletAddress: lastData.to,
                    tokenAmount: lastData.value,
                    dateTime: lastData.block_timestamp,
                    userDocId: snapshot.data().docID,
                    name:
                      snapshot.data().firstname +
                      " " +
                      snapshot.data().lastname,
                    privateKey: snapshot.data().cryptoPrivateKey,
                  });
                  const q = doc(db, "users", snapshot.data().phone_number);
                  updateDoc(q, {
                    balance: snapshot.data().balance + lastData.value / 1000000,
                  }).then(() => {
                    awardReferrer(
                      lastData.value / 1000000,
                      snapshot.data().referrerId
                    );
                    addDoc(collection(db, "referrals"), {
                      amount_deposited: lastData.value / 1000000,
                      referrerId: snapshot.data().referrerId,
                      referral:
                        snapshot.data().firstname +
                        " " +
                        snapshot.data().lastname,
                      createdAt: moment(new Date()).format(
                        "YYYY-MMM-DD, hh:mm A"
                      ),
                    });
                  });
                }
              }
            });
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

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

  // sirB code starts

  const docEvent = useRef();
  const activeTradesChecker = useRef();

  useEffect(() => {

    clearInterval(activeTradesChecker.current)
    // check active trade every 3 seconds 
    handleTradesChecker()
    return () => clearInterval(activeTradesChecker.current)
  }, [activeTrades])

  useEffect(() => {    
    const auth = getAuth();
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const {uid} = user;
        handleListener(uid)        
      }
    });

    return () => {
      const unsubscribe = docEvent.current
      if(unsubscribe && Object.prototype.toString.call(unsubscribe) == '[object Function]')
        unsubscribe()
    }
  }, [])

  const handleListener = (userId) => {

    const colRef = CollectionRef("requests")
  
      const q = query( 
        colRef, 
        where("outcome", "==", ""),
        where("trader_id", "==", userId),
      );
  
      docEvent.current = onSnapshot(q, (snapshot)=>{
        let collections = [];
        snapshot.docs.forEach((doc)=>{
            collections.push({id:doc.id, ...doc.data()})
        })
        handleDocAdded(collections)
      })
  }

  const handleDocAdded = (collections) =>{
      // handle latest user trades
      setactiveTrades(prev=> [...collections])
  }

  const handleTradesChecker = () =>{
    activeTradesChecker.current = setInterval(() => {
      
      const date = new Date();
      const expiredTrades = activeTrades.filter(t => {
        const tradeDate = new Date(t.time);
        return (date.getTime() / 1000) - (tradeDate.getTime() / 1000) >= t.timeLeft
        // return TimeDiffInSecs(t.time, date) >= t.timeLeft
      })

      if(expiredTrades.length){
        clearInterval(activeTradesChecker.current)
        const tradeIds = expiredTrades.map(trade => trade.tradeNo)
        AutomationHandler(expiredTrades)
      }
    }, 1000);
  }

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        userData,
        setUserData,
        timeLeft,
        setTimeLeft,
        darkTheme,
        setDarkTheme,
        progressKYC,
        setProgressKYC,
        isOpen,
        setIsOpen,
        route,
        setRoute,
        setEmailState,
        setPhoneState,
        setAuthState,
        setFundPassword,
        setWalletAddress,
        activeTrades, setactiveTrades,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
