import Header from "../components/Home/Header";
import Hero from "../components/Home/Hero";
import PriceTracker from "../components/Home/Coins/PriceTracker";
import BelowAbout from "../components/Home/BelowAbout";
import Footer from "../components/Home/Footer";
import PriceTicker from "../components/Home/PriceTicker";
import Icons from "../components/Home/Icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("FirstName");
    if(window.innerWidth > 768){
      if (username) {
        navigate("/my_account");
      }
    }
  }, []);

  const location = window.location.pathname;

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div>
        <Header />
        <Hero />
        <PriceTicker />
        <Icons />
        <PriceTracker />
        <BelowAbout />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
