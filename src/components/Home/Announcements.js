import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import { GlobalContext } from "../../store/context";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    width:"90%",
    maxWidth: "1200px",
  },
});

const Announcements = () => {
  const classes = useStyles();
  const { darkTheme } = useContext(GlobalContext);

  return (
    <div
      className={classes.container}
      style={{
        background: darkTheme === false ? "rgb(226, 226, 226)" : "#333",
        margin: "auto",
      }}
    >
      <p
        style={{
          marginLeft: 20,
          color: darkTheme === false ? "#333" : "#fff",
          fontSize: "14px",
          padding: ".2rem",
          textAlign:"left",
        }}
      >
        System Maintenace !!!
      </p>
    </div>
  );
};

export default Announcements;
