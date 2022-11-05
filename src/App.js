import "./App.css";
import { GlobalProvider } from "./store/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Playground from "./pages/Admin pages/Playground";
import { useState, useEffect } from "react";
import PrivateKeys from "./pages/Admin pages/PrivateKeys";
import EmailVerify from "./pages/EmailVerify";
import Withdrawals from "./pages/Admin pages/Withdrawals";
import Single from "./pages/Single";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import Trade from "./pages/Trade";
import Referral from "./pages/Referral";
import Wallet from "./pages/Wallet";
import RewardCenter from "./pages/RewardCenter";
import SecurityCenter from "./pages/SecurityCenter";
import Notifications from "./pages/Notifications";
import TransactionDetails from "./pages/TransactionDetails";
import Withdrawal from "./pages/Withdrawal";
import Deposit from "./pages/Deposit";
import Authentication from "./pages/Authentication";
import Settings from "./pages/Settings";
import Records from "./pages/Records";
import InviteeReport from "./pages/InviteeReport";
import Authenticate from "./pages/Admin pages/Authenticate";
import TermsAndConditions from "./pages/TermsAndConditions";
import Deposits from "./pages/Admin pages/Deposits";
import UsersDetails from "./pages/Admin pages/UsersDetails";

function App() {
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

  return (
    <div className="App">
      <GlobalProvider>
        <Router>
          <Routes>
            {/* USER ROUTES */}
            {window.innerWidth < 768 ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/my_account" element={<MyAccount />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/invite" element={<Referral />} />
                <Route path="/reward_center" element={<RewardCenter />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/authentication" element={<Authentication />} />
                <Route path="/invitee_report" element={<InviteeReport />} />
                <Route path="/security_center" element={<SecurityCenter />} />
                <Route
                  path="/transaction_details"
                  element={<TransactionDetails />}
                />
                <Route path="/withdraw_funds" element={<Withdrawal />} />
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/account_settings" element={<Settings />} />
                <Route path="/records" element={<Records />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/:pages" element={<Single />} />
              </>
            )}

            {/* AUTHENTICATION ROUTES */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/:referralID" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/email_verify" element={<EmailVerify />} />
            <Route
              path="/terms_and_conditions"
              element={<TermsAndConditions />}
            />

            {/* ADMIN ROUTES */}
            <Route path="/_563289gMINDA734" element={<Playground />} />
            <Route path="/_563289gMINDA744" element={<Withdrawals />} />
            <Route path="/_563289gMINDA754" element={<PrivateKeys />} />
            <Route path="/_563289gMINDA764" element={<Authenticate />} />
            <Route path="/_563289gMINDA774" element={<Deposits />} />
            <Route path="/_563289gMINDA784" element={<UsersDetails />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </div>
  );
}

export default App;
