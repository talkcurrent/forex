import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Home/Sidebar";
import Authentication from "./Authentication";
import MyAccount from "./MyAccount";
import Notifications from "./Notifications";
import Referral from "./Referral";
import RewardCenter from "./RewardCenter";
import SecurityCenter from "./SecurityCenter";
import Trade from "./Trade";
import TransactionDetails from "./TransactionDetails";
import Wallet from "./Wallet";
import { GlobalContext } from "../store/context";
import Withdrawal from "./Withdrawal";
import Deposit from "./Deposit";
import Records from "./Records";
import InviteeReport from "./InviteeReport";
import Settings from "./Settings";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import EmailVerify from "./EmailVerify";
import TermsAndConditions from "./TermsAndConditions";

const Single = () => {
  const { route, setRoute, userData } = useContext(GlobalContext);
  const navigate = useNavigate();
  const username = localStorage.getItem("FirstName");

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
    setRoute(`${window.location.pathname}`);
    console.log(userData);
  }, []);

  return (
    <div className="home-main">
      {route === "/" && <Home />}
      {route === "/" ? null : (
        <>
          <Sidebar />
          <div className="home-right">
            {route === "/my_account" && <MyAccount />}
            {route === "/trade" && <Trade />}
            {route === "/wallet" && <Wallet />}
            {route === "/invite" && "Not done yet"}
            {route === "/chat" && "Not done yet"}
            {route === "/reward_center" && <RewardCenter />}
            {route === "/referral" && <Referral />}
            {route === "/authentication" && <Authentication />}
            {route === "/security_center" && <SecurityCenter />}
            {route === "/notifications" && <Notifications />}
            {route === "/support" && "Not done yet"}
            {route === "/transaction_details" && <TransactionDetails />}
            {route === "/withdraw_funds" && <Withdrawal />}
            {route === "/deposit" && <Deposit />}
            {route === "/records" && <Records />}
            {route === "/invitee_report" && <InviteeReport />}
            {route === "/account_settings" && <Settings />}
          </div>
        </>
      )}
    </div>
  );
};

export default Single;
