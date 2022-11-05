import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import bitcoin1 from "../../assets/bitcoin1.webp";
import bg from "../../assets/bg.jpg";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../store/context";

const primaryColor = "transparent";

const useStyles = makeStyles({
  textBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: 70,
  },
  text: {
    fontSize: 30,
    fontWeight: 700,
    width: 700,
    textAlign: "center",
  },
});

const Hero = () => {
  const classes = useStyles();
  const FirstName = localStorage.getItem("FirstName");
  const navigate = useNavigate();
  const { setRoute } = useContext(GlobalContext);

  const route = (route) => {
    navigate(route);
  };

  return (
    <div className="hero-cover">
      <div className="hero-bg">
        <img src={bg} alt="bg" />
      </div>
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to Bivestcoin</h1>
          <div className="content-btn">
            {FirstName ? null : (
              <button onClick={() => route("/signup")} className="btn btn-full">
                Register
              </button>
            )}
          </div>
        </div>
        <div className="hero-carousel">
          <Carousel
            background={primaryColor}
            autoPlay={true}
            infiniteLoop={true}
            swipeable={true}
            showStatus={false}
            showThumbs={false}
          >
            <img src="/img1.jpeg"></img>
            <img src="/img2.jpeg"></img>
            <img src="/img3.jpeg"></img>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Hero;
