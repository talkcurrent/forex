import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { BsFileX } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { IoRadioButtonOffOutline } from "react-icons/io5";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import Sidebar from "../components/Home/Sidebar";
import { BiChevronLeft } from "react-icons/bi";
import db, { storage } from "../store/server.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { setDoc, doc, getDoc } from "firebase/firestore";

const blue = "#2163EB";
const primaryColor = "#F0B90B";
const primaryColorDark = "#393091";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF";
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const myStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    alignItems: "flex-start",
    fontFamily: "Poppins, sans-serif",
    "& i": {
      color: "#333",
    },
  },
  top: {
    background: "#f5f5f5",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    position: "relative",
    top: "0",
    "& h3": {
      fontSize: "16px",
      fontWeight: "700",
      textAlign: "right",
    },
    "& i": {
      width: "7%",
      position: "absolute",
      left: "10px",
    },
    [theme.breakpoints.up("sm")]: {
      "& i": {
        display: "none",
      },
      "& h3": {
        textAlign: "left",
      },
    },
  },
  area: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    margin: "2.5rem 0 0 0",
    marginTop: 70,
    "& p": {
      fontWeight: "600",
      color: "#555",
      fontSize: "12px",
    },
  },
  areaSection: {
    display: "flex",
    alignItems: "center",
    color: "#555",
    justifyContent: "space-between",
    padding: "1rem 1rem",
    margin: "1rem 0 0 0",
    borderTop: ".5px #e5e5e5 solid",
    borderBottom: ".5px #e5e5e5 solid",
  },
  radios: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0rem 1rem .5rem 1rem",
    [theme.breakpoints.up("sm")]: {
      padding: "0rem 1rem .5rem 1rem",
    },
  },
  radio: {
    display: "flex",
    gap: ".5rem",
    "& h5": {
      color: "gray",
      fontWeight: "600",
    },
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
    margin: ".6rem auto 0 auto ",
    padding: ".5rem 1rem",
    "& input": {
      fontFamily: "Poppins,sans-serif",
      fontSize: "14px",
      fontWeight: "400",
      width: "100%",
      padding: ".8rem",
      border: "none",
      background: "#f5f5f5",
      color: "#555",
      "&:focus": {
        border: "none",
        outline: "none",
      },
    },
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      gap: "1rem",
      "& input": {
        borderRadius: "6px",
        width: "50%",
      },
    },
  },
  birthday: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#555",
    padding: "1rem 1rem",
    margin: "1rem 0 0 0",
    borderTop: ".5px #e5e5e5 solid",
    borderBottom: ".5px #e5e5e5 solid",
  },
  submitBtn: {
    width: "100%",
    margin: "0 0 5rem 0",
    padding: "0 1rem",
  },
}));

const Authentication = () => {
  const classes = myStyles();
  const [isComplete, setIsComplete] = useState(true);
  const email = localStorage.getItem("Email");
  const phone = localStorage.getItem("PhoneNumber");

  const [item, setItem] = useState("");
  const [form, setForm] = useState((currForm) => ({
    id_number: "",
    fullName: "",
    frontPic: "",
    backPic: "",
    userID: email ? email : phone,
    status: "pending",
    item_name: item,
  }));
  const [frontPics, setFrontPics] = useState();
  const [backPics, setBackPics] = useState();
  const [percent, setPercent] = useState(0);
  const [countPercent, startPercent] = useState(false);
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [reviewStats, setReviewStats] = useState();
  const [pageloading, setPageloading] = useState(false);

  useEffect(() => {
    if (item === "") {
      setItem("id");
    }
  }, []);

  useEffect(() => {
    if (
      form.id_number !== "" &&
      form.fullName !== "" &&
      form.frontPic !== "" &&
      form.backPic !== ""
    ) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [form]);

  useEffect(() => {
    setPageloading(true);
    try {
      const docRef = doc(db, "verification", email ? email : phone);

      getDoc(docRef).then((snapshot) => {
        if (!snapshot.exists()) {
          setPageloading(false);
          return;
        } else {
          console.log(snapshot.data());
          if (snapshot.data().status === "pending") {
            setReviewStats("pending");
            setPageloading(false);
          } else if (snapshot.data().status === "declined") {
            setReviewStats("declined");
            setPageloading(false);
          } else {
            setReviewStats("approved");
            setPageloading(false);
          }
        }
      });
    } catch (err) {
      console.log(err);
      setPageloading(false);
    }
  }, []);

  const selectId = () => {
    setItem("id");
    console.log(item);
  };

  const selectPassport = () => {
    setItem("passport");
    console.log(item);
  };

  const selectOthers = () => {
    setItem("others");
    console.log(item);
  };

  const selectDl = () => {
    setItem("dl");
    console.log(item);
  };

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    startPercent(true);
    console.log(e.target.files[0]);
    setForm({
      ...form,
      [e.target.name]: e.target.files[0],
    });
    const storageRef = ref(storage, `/files/${e.target.files[0].name}`);
    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          startPercent(false);
          if (e.target.name === "frontPic") {
            setFrontPics(url);
            setForm({
              ...form,
              [e.target.name]: url,
            });
          }
          if (e.target.name === "backPic") {
            setBackPics(url);
            setForm({
              ...form,
              [e.target.name]: url,
            });
          }
        });
      }
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    setMessage(null);
    console.log(form);
    try {
      setDoc(doc(db, "verification", email ? email : phone), form).then(() => {
        setLoading(false);
        setMessage(
          "Your information has been submitted and is undergoing verification. Check your security center within one working day to confirm your verification."
        );
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="referrals-top container">
        <BiChevronLeft
          fontSize={25} /*onClick={() => {navigate("/my_account")}}*/
        />
        <p>Authentication</p>
        <span> </span>
      </div>
      {pageloading ? (
        <p style={{ marginTop: 70 }}>Fetching Identification Status...</p>
      ) : (
        <>
          {reviewStats === undefined ? (
            <>
              <div className={classes.area}>
                <div className={classes.radios}>
                  <div className={classes.radio}>
                    <div>
                      {item === "id" ? (
                        <AiFillCheckCircle
                          color={primaryColor}
                          onClick={selectId}
                        />
                      ) : (
                        <IoRadioButtonOffOutline onClick={selectId} />
                      )}
                    </div>
                    <h5>ID</h5>
                  </div>
                  <div className={classes.radio}>
                    <div>
                      {item === "passport" ? (
                        <AiFillCheckCircle
                          color={primaryColor}
                          onClick={selectPassport}
                        />
                      ) : (
                        <IoRadioButtonOffOutline onClick={selectPassport} />
                      )}
                    </div>
                    <h5>Passport</h5>
                  </div>
                  <div className={classes.radio}>
                    <div id="dl" onClick={selectDl}>
                      {item === "dl" ? (
                        <AiFillCheckCircle color={primaryColor} />
                      ) : (
                        <IoRadioButtonOffOutline />
                      )}
                    </div>
                    <h5>DL</h5>
                  </div>
                  <div className={classes.radio}>
                    <div id="others" onClick={selectOthers}>
                      {item === "others" ? (
                        <AiFillCheckCircle color={primaryColor} />
                      ) : (
                        <IoRadioButtonOffOutline />
                      )}
                    </div>
                    <h5>Others</h5>
                  </div>
                </div>
                <form className={classes.form}>
                  <input
                    type="text"
                    onChange={handleFormChange}
                    name="id_number"
                    placeholder="Enter your ID number"
                  />
                  <input
                    type="text"
                    onChange={handleFormChange}
                    name="fullName"
                    placeholder="Enter your name"
                  />
                </form>
              </div>
              <div className="id-cards">
                <div
                  className="id-card"
                  style={{
                    backgroundImage: `url("${frontPics}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <i class="fa fa-camera" aria-hidden="true"></i>
                  <p>Upload the front of the {item}</p>
                  <input
                    onChange={handleFileChange}
                    name="frontPic"
                    className="upload-doc"
                    type="file"
                  />
                  {countPercent ? (
                    <div
                      style={{
                        width: 60,
                        marginTop: 20,
                        aspectRatio: "1",
                        position: "relative",
                        color: "#555",
                      }}
                    >
                      <CircularProgressbar
                        value={percent}
                        styles={buildStyles({
                          backgroundColor: "#fafafa",
                          trailColor: "#f5f5f5",
                          pathColor: primaryColor,
                        })}
                      />
                      <div
                        style={{
                          color: "#555",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "15px",
                            color: "#555",
                            margin: "0",
                            fontWeight: "600",
                            fontFamily: "Poppins, sans-serif",
                            letterSpacing: "-1px",
                            // lineHeight: "40px",
                          }}
                        >
                          {percent}{" "}
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "400",
                            }}
                          >
                            %
                          </span>
                        </h1>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div
                  className="id-card"
                  style={{
                    backgroundImage: `url("${backPics}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <i class="fa fa-camera" aria-hidden="true"></i>
                  <p>Upload the back of the {item}</p>
                  <input
                    onChange={handleFileChange}
                    name="backPic"
                    className="upload-doc"
                    type="file"
                  />
                  {countPercent ? (
                    <div
                      style={{
                        width: 60,
                        marginTop: 20,
                        aspectRatio: "1",
                        position: "relative",
                        color: "#555",
                      }}
                    >
                      <CircularProgressbar
                        value={percent}
                        styles={buildStyles({
                          backgroundColor: "#fafafa",
                          trailColor: "#f5f5f5",
                          pathColor: primaryColor,
                        })}
                      />
                      <div
                        style={{
                          color: "#555",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "15px",
                            color: "#555",
                            margin: "0",
                            fontWeight: "600",
                            fontFamily: "Poppins, sans-serif",
                            letterSpacing: "-1px",
                            // lineHeight: "40px",
                          }}
                        >
                          {percent}{" "}
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "400",
                            }}
                          >
                            %
                          </span>
                        </h1>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {message && <p style={{ color: "green" }}>{message}</p>}
              <div className={classes.submitBtn}>
                <button
                  onClick={handleSubmit}
                  className={isComplete ? "active" : "disabled"}
                  disabled={!isComplete}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </>
          ) : (
            <>
              {reviewStats === "pending" ? (
                <p style={{ marginTop: 70 }}>
                  Your Identity verification is under review.
                </p>
              ) : (
                <>
                  {reviewStats === "declined" ? (
                    <p style={{ marginTop: 70 }}>
                      Your Identity verification was unsuccessful.
                    </p>
                  ) : (
                    <>
                      {reviewStats === "approved" ? (
                        <p style={{ marginTop: 70 }}>
                          Your Identity has been successfully verified.
                        </p>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Authentication;
