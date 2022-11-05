import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../store/server.config";
import { BiChevronLeft } from "react-icons/bi";
import { GlobalContext } from "../store/context";
import PhoneInput from "react-phone-input-2";

const primaryColor = "#F0B90B";

const useStyles = makeStyles({});

const Settings = () => {
  const classes = useStyles();
  const { userData } = useContext(GlobalContext);
  const [pin, setPin] = useState();
  const [address, setAddress] = useState(
    userData && userData.withdrawal_address
  );
  const [phone_number, setPhone] = useState(userData && userData.phone_number);
  const [emailAddress, setEmail] = useState(userData && userData.email);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [addressErrors, setAddressErrors] = useState(null);
  const [emailErrors, setEmailErrors] = useState(null);
  const [phoneErrors, setPhoneErrors] = useState(null);
  const [message, setMessage] = useState(null);
  const [addressMessage, setAddressMessage] = useState(null);
  const [emailMessage, setEmailMessage] = useState(null);
  const [phoneMessage, setPhoneMessage] = useState(null);

  useEffect(() => {
    console.log(userData);
  }, []);

  const saveWithdrawalPin = () => {
    setLoading(true);
    const phone = localStorage.getItem("PhoneNumber");
    const email = localStorage.getItem("Email");

    if (pin === undefined) {
      setErrors("Please set your 4 digit pin.");
      setLoading(false);
    } else {
      if (email) {
        const q = doc(db, "users", email);
        updateDoc(q, {
          widthdrawal_pin: pin,
        }).then(() => {
          setLoading(false);
          setMessage("Your wihdrawal pin has been set successfully.");
        });
      } else {
        const q = doc(db, "users", phone);
        updateDoc(q, {
          widthdrawal_pin: pin,
        }).then(() => {
          setLoading(false);
          setMessage("Your wihdrawal pin has been set successfully.");
        });
      }
    }
  };

  const saveWithdrawalAddress = () => {
    setAddressLoading(true);
    const phone = localStorage.getItem("PhoneNumber");
    const email = localStorage.getItem("Email");

    if (address === undefined) {
      setAddressErrors("Please set your TRC20 USDT address.");
      setAddressLoading(false);
    } else {
      if (email) {
        const q = doc(db, "users", email);
        updateDoc(q, {
          withdrawal_address: address,
        }).then(() => {
          setAddressLoading(false);
          setAddressMessage(
            "Your wihdrawal address has been set successfully."
          );
        });
      } else {
        const q = doc(db, "users", phone);
        updateDoc(q, {
          withdrawal_address: address,
        }).then(() => {
          setAddressLoading(false);
          setAddressMessage(
            "Your wihdrawal address has been set successfully."
          );
        });
      }
    }
  };

  const saveEmail = () => {
    setEmailLoading(true);
    const phone = localStorage.getItem("PhoneNumber");
    const email = localStorage.getItem("Email");

    if (emailAddress === undefined) {
      setEmailErrors("Please set your email  address.");
      setEmailLoading(false);
    } else {
      if (email) {
        const q = doc(db, "users", email);
        updateDoc(q, {
          email: emailAddress,
        }).then(() => {
          setEmailLoading(false);
          setEmailMessage("Your email has been set successfully.");
        });
      } else {
        const q = doc(db, "users", phone);
        updateDoc(q, {
          email: emailAddress,
        }).then(() => {
          setEmailLoading(false);
          setEmailMessage("Your email has been set successfully.");
        });
      }
    }
  };

  const savePhone = () => {
    setPhoneLoading(true);
    const phone = localStorage.getItem("PhoneNumber");
    const email = localStorage.getItem("Email");

    if (phone_number === undefined) {
      setPhoneErrors("Please set your phone number.");
      setPhoneLoading(false);
    } else {
      if (email) {
        const q = doc(db, "users", email);
        updateDoc(q, {
          phone_number: phone_number,
        }).then(() => {
          setPhoneLoading(false);
          setPhoneMessage("Your Phone number has been set successfully.");
        });
      } else {
        const q = doc(db, "users", phone);
        updateDoc(q, {
          phone_number: phone_number,
        }).then(() => {
          setPhoneLoading(false);
          setPhoneMessage("Your Phone number has been set successfully.");
        });
      }
    }
  };

  return (
    <div>
      <div className="referrals-top container">
        <BiChevronLeft
          fontSize={25} /*onClick={() => {navigate("/my_account")}}*/
        />
        <p>Settings</p>
        <span> </span>
      </div>

      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          margin: "3.6rem auto 0 auto",
          border: "2px solid",
          borderColor: primaryColor,
          borderRadius: "10px",
          padding: "2rem ",
        }}
      >
        <p>Your Email</p>

        <div>
          <input
            placeholder="Set your email address"
            style={{
              padding: 10,
              outline: "none",
              width: "80%",
              border: "none",
              background: "#e1e1e1",
              borderRadius: "4px",
              margin: ".6rem auto 0 auto",
            }}
            type="email"
            value={emailAddress}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailErrors(null);
              setEmailMessage(null);
            }}
            disabled={userData && userData.email}
          />

          {emailErrors && (
            <p style={{ color: "red", fontSize: 13, marginTop: 10 }}>
              {emailErrors}
            </p>
          )}
          {emailMessage && (
            <p style={{ color: "green", fontSize: 13, marginTop: 10 }}>
              {emailMessage}
            </p>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn-full"
              style={{ padding: "3px 20px" }}
              onClick={saveEmail}
              disabled={userData && userData.email}
            >
              {userData && userData.email
                ? "Saved"
                : emailLoading
                ? "Saving..."
                : "Save Email"}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          margin: "3.6rem auto 0 auto",
          border: "2px solid",
          borderColor: primaryColor,
          borderRadius: "10px",
          padding: "2rem ",
        }}
      >
        <p>Your Phone Number</p>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: 10,
              width: "100%",
              height: "50px",
              background: "none",
              overflow: "hidden",
              borderRadius: "6px",
              border: ".5px #B4AAF9 solid",
            }}
          >
            <PhoneInput
              country={"us"}
              value={phone_number}
              onChange={(phone) => {
                setPhoneErrors(null);
                setPhone(`+${phone}`);
              }}
              // onlyCountries={["us", "ng", "ke"]}
              inputStyle={{
                border: "none",
                textAlign: "left",
              }}
              buttonStyle={{
                border: "none",
                background: "none",
                padding: "0",
              }}
              disabled={userData && userData.phone_number}
            />
          </div>

          {phoneErrors && (
            <p style={{ color: "red", fontSize: 13, marginTop: 10 }}>
              {phoneErrors}
            </p>
          )}
          {phoneMessage && (
            <p style={{ color: "green", fontSize: 13, marginTop: 10 }}>
              {phoneMessage}
            </p>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn-full"
              style={{ padding: "3px 20px" }}
              onClick={savePhone}
              disabled={userData && userData.phone_number}
            >
              {userData && userData.phone_number
                ? "Saved"
                : phoneLoading
                ? "Saving..."
                : "Save Phone number"}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          margin: "1.4rem auto 0 auto",
          border: "2px solid",
          borderColor: primaryColor,
          borderRadius: "10px",
          padding: "2rem ",
        }}
      >
        <p>Your Withdrawal Pin</p>

        <div>
          <input
            placeholder={
              userData && userData.widthdrawal_pin
                ? "****"
                : "Must be a 4 digit pin"
            }
            style={{
              padding: 10,
              outline: "none",
              width: "80%",
              border: "none",
              background: "#e1e1e1",
              borderRadius: "4px",
              outline: "none",
              margin: ".6rem auto 0 auto",
            }}
            type="number"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErrors(null);
              setMessage(null);
              if (e.target.value.length >= 4) {
                alert("Cannot have more than 4 digits.");
                e.preventDefault();
              }
            }}
            disabled={userData && userData.widthdrawal_pin}
          />

          {errors && (
            <p style={{ color: "red", fontSize: 13, marginTop: 10 }}>
              {errors}
            </p>
          )}
          {message && (
            <p style={{ color: "green", fontSize: 13, marginTop: 10 }}>
              {message}
            </p>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn-full"
              style={{ padding: "3px 20px" }}
              onClick={saveWithdrawalPin}
              disabled={userData && userData.widthdrawal_pin}
            >
              {userData && userData.widthdrawal_pin
                ? "Saved"
                : loading
                ? "Saving..."
                : "Save Pin"}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          margin: "3.6rem auto 0 auto",
          border: "2px solid",
          borderColor: primaryColor,
          borderRadius: "10px",
          padding: "2rem ",
        }}
      >
        <p>Your Withdrawal Wallet Address</p>

        <div>
          <input
            placeholder="TRC20 USDT address only"
            style={{
              padding: 10,
              outline: "none",
              width: "80%",
              border: "none",
              background: "#e1e1e1",
              borderRadius: "4px",
              margin: ".6rem auto 0 auto",
            }}
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setAddressErrors(null);
              setAddressMessage(null);
            }}
            disabled={userData && userData.withdrawal_address}
          />

          {addressErrors && (
            <p style={{ color: "red", fontSize: 13, marginTop: 10 }}>
              {addressErrors}
            </p>
          )}
          {addressMessage && (
            <p style={{ color: "green", fontSize: 13, marginTop: 10 }}>
              {addressMessage}
            </p>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn-full"
              style={{ padding: "3px 20px" }}
              onClick={saveWithdrawalAddress}
              disabled={userData && userData.withdrawal_address}
            >
              {userData && userData.withdrawal_address
                ? "Saved"
                : addressLoading
                ? "Saving..."
                : "Save Wallet Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
