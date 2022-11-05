import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../store/context";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineSave,
  HiOutlineChartSquareBar,
  HiOutlineChat,
} from "react-icons/hi";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiMailAddLine } from "react-icons/ri";

const primaryColor = "#F0B90B";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    width: "70%",
    margin: "1rem auto 2rem auto",
    fontSize: "14px",
    justifyContent: "space-between",
    padding: ".5rem ",
    background: "#fff",
    borderRadius: "6px",
    boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
  },
});

const Icons = () => {
  const classes = useStyles();
  const { user, darkTheme } = useContext(GlobalContext);
  const navigate = useNavigate();

  const authRoute = (param) => {
    if (user === null) {
      navigate("/login");
    } else {
      navigate(`/${param}`);
    }
  };

  return (
    <div
      className="icons-container"
      // style={{ background: darkTheme === false ? "rgb(226, 226, 226)" : "#333" }}
    >
      <div
        className="icon-btn"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={() => authRoute("deposit")}
      >
        <HiOutlineSave fontSize={20} className="icons-react" />
        <span
          style={{
            fontSize: "12px",
            color: darkTheme === false ? "#000" : "#fff",
          }}
        >
          Deposit
        </span>{" "}
      </div>

      <Link to="/trade">
        <div
          className="icon-btn"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <HiOutlineChartSquareBar fontSize={20} className="icons-react" />
          <span
            style={{
              fontSize: "12px",
              color: darkTheme === false ? "#000" : "#fff",
            }}
          >
            Trade
          </span>{" "}
        </div>
      </Link>

      <div
        className="icon-btn"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={() => authRoute("withdraw_funds")}
      >
        <MdOutlineFileUpload fontSize={20} className="icons-react" />
        <span
          style={{
            fontSize: "12px",
            color: darkTheme === false ? "#000" : "#fff",
          }}
        >
          Withdraw
        </span>{" "}
      </div>

      <div
        className="icon-btn"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={() => authRoute("referral")}
      >
        <RiMailAddLine fontSize={20} className="icons-react" />
        <span
          style={{
            fontSize: "12px",
            color: darkTheme === false ? "#000" : "#fff",
          }}
        >
          Invite
        </span>{" "}
      </div>
    </div>
  );
};

export default Icons;
