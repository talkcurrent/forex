import React, { useContext, useEffect, useState } from "react";
import { AiFillGift, AiFillSecurityScan, AiFillHome } from "react-icons/ai";
import { BiCreditCard, BiTransfer, BiMenu } from "react-icons/bi";
import { HiUserAdd } from "react-icons/hi";
import {
  IoMdNotifications,
  IoIosWallet,
  IoCloseSharp,
  IoMdSettings,
} from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdLiveHelp, MdAreaChart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../store/context";
import { auth } from "../../store/server.config";

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    user,
    userData,
    setUserData,
    darkTheme,
    isOpen,
    setIsOpen,
    setRoute,
  } = useContext(GlobalContext);

  const list1 = [
    {
      path: "/reward_center",
      name: "Reward Center",
      icon: <AiFillGift style={{ fontSize: 18 }} />,
    },
    {
      path: "/referral",
      name: "Referral",
      icon: <HiUserAdd style={{ fontSize: 18 }} />,
    },
  ];

  const list2 = [
    {
      path: "/my_account",
      name: "My Account",
      icon: <BiCreditCard style={{ fontSize: 18 }} />,
    },
    {
      path: "/trade",
      name: "Trade",
      icon: <AiFillSecurityScan style={{ fontSize: 18 }} />,
    },
    {
      path: "/wallet",
      name: "Wallet",
      icon: <IoMdNotifications style={{ fontSize: 18 }} />,
    },
  ];

  const list3 = [
    {
      path: "/authentication",
      name: "Authentication",
      icon: <BiCreditCard style={{ fontSize: 18 }} />,
    },
    {
      path: "/security_center",
      name: "Security Center",
      icon: <AiFillSecurityScan style={{ fontSize: 18 }} />,
    },
    // {
    //   path: "/notifications",
    //   name: "Notifications",
    //   icon: <IoMdNotifications style={{ fontSize: 18 }} />,
    // },
    // {
    //   path: "/support",
    //   name: "Help & Support",
    //   icon: <MdLiveHelp style={{ fontSize: 18 }} />,
    // },
    {
      path: "/transaction_details",
      name: "Transaction Details",
      icon: <BiTransfer style={{ fontSize: 18 }} />,
    },
    {
      path: "/account_settings",
      name: "Settings",
      icon: <IoMdSettings style={{ fontSize: 18 }} />,
    },
  ];

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    setUserData(null);
    navigate("/");
    setRoute("/");
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };

  const route = (route) => {
    navigate(route);
    setRoute(route);
  };

  return (
    <div className="sidebar" style={{ width: isOpen ? "70%" : "0%" }}>
      <div className="sidebar-logo">
        <img src="logo.png" alt="logo.png" />
        <h2 className="logo-text">BivestCoin</h2>
        <span>
          {isOpen ? (
            <IoClose style={{ fontSize: 25 }} onClick={handleClose} />
          ) : (
            <></>
          )}
        </span>
      </div>
      <div className="sidebar-lists">
        <div className="sidebar-toplist">
          <ul>
            {list2 &&
              list2.map((list) => (
                <div
                  className={
                    window.location.pathname === list.path
                      ? "sidebar_selected"
                      : "sidebar-listbtn"
                  }
                  onClick={() => {
                    route(list.path);
                  }}
                >
                  <div className="sidebar-listitem">
                    {list.icon}
                    <li>{list.name}</li>
                  </div>
                </div>
              ))}
          </ul>
        </div>
        <div className="sidebar-downlist">
          <ul>
            {list1 &&
              list1.map((list) => (
                <div
                  className={
                    window.location.pathname === list.path
                      ? "sidebar_selected"
                      : "sidebar-listbtn"
                  }
                  onClick={() => {
                    route(list.path);
                  }}
                >
                  <div className="sidebar-listitem">
                    {list.icon}
                    <li>{list.name}</li>
                  </div>
                </div>
              ))}
          </ul>
        </div>
        <div className="sidebar-downlist">
          <ul>
            {list3 &&
              list3.map((list) => (
                <div
                  className={
                    window.location.pathname === list.path
                      ? "sidebar_selected"
                      : "sidebar-listbtn"
                  }
                  onClick={() => {
                    route(list.path);
                  }}
                >
                  <div className="sidebar-listitem">
                    {list.icon}
                    <li>{list.name}</li>
                  </div>
                </div>
              ))}
          </ul>
        </div>
        <div className="sidebar-downlist">
          <ul>
            <div className="sidebar-listbtn" onClick={handleLogout}>
              <div className="sidebar-listitem">
                <BiTransfer style={{ fontSize: 18 }} />
                <li>Logout</li>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
