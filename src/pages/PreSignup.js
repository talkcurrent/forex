import React from 'react'
import { makeStyles } from "@material-ui/core";
import Header from '../components/Home/Header';
import { Link } from 'react-router-dom';


const primaryColor = "#F0B90B";
const primaryColorDark = "#393091";
const icons = "#B4AAF9";
const iconsLight = "#D6CBFF"
const textInput = " #E4E2F1";
const subTexts = " #D3CFE2";

const myStyle = makeStyles({
    container: {
        margin: "10rem auto 0 auto",
        width: "80%",
        borderRadius: "10px",
        padding: "5rem 1rem",
        boxShadow:"1px 1px 3px #ccc"
    },
    head: {
        boxShadow: "0px 3px 10px #c1c1c1",
        background: "#ff7200",
        height: "4rem",
    },
    button: {
        background: primaryColor,
        width: "91%",
        border: "none",
        borderRadius: "6px",
        fontWeight: "medium",
        padding: "1rem ",
        color: "#fff",
        boxShadow: "0px 1px 7px #ddd",
        fontFamily: "Poppins",
        "&:active": {
            background: primaryColorDark,
        }
    },
    btnDiv: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
    }
})

const PreSignup = () => {

    const classes = myStyle();

  return (
    <div style={{fontFamily : "Poppins, sans-serif"}}>
        <div className={classes.head}>
            <Header/>
        </div>
        <div className={classes.container}>
            <div className={classes.btnDiv}>
                <p style={{marginBottom :"1rem", color :primaryColor, fontWeight: "600"}}>How would you like to sign up?</p>
                <Link to="/otp-auth"><button className={classes.button}>Sign up with Phone Number</button></Link>
                <Link to="/otp-email"><button className={classes.button}>Sign up with Email</button></Link>
            </div>
        </div>
    </div>
  )
}

export default PreSignup