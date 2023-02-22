import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext, AvaPath } from "../userConetext";
import "./style/NavigationBar.css";
import axios from "../api/axios";
import Popup from "./pages/Popup";
import Cookies from "js-cookie";
const LOGOUT_URL = "/api/v1/signout/";
const AVATAR_URL = "/api/v1/avatar";
const AVA_PATH_URL = "/api/v1/getAvatar";

function NavigationBar() {
  const { user, setUser } = useContext(UserContext);
  const { avaPath, setAvaPath } = useContext(AvaPath);

  const [pop, setPop] = useState(false);

  const logout = () => {
    axios
      .get(LOGOUT_URL)
      .then(function (res) {
        setUser(null);
        Cookies.remove("connect.sid");
        Cookies.remove("username");
      })
      .catch(function (error) {
        console.log("fail");
      });
  };

  const trigger = (e) => {
    e.preventDefault();
    setPop(pop ? false : true);
  };

  return (
    <>
      <nav className="navigationBar">
        <div className="navigationBar-container">
          <Link to="/" className="navigationBar-title">
            Challenge Me
          </Link>
          {user ? (
            <>
              <ul className="navigationBar-menu">
                <li className="navigationBar-item">
                  <Link to="/select" className="navigationBar-links">
                    MODE
                  </Link>
                </li>
                <li className="navigationBar-item">
                  <Link to="/" className="navigationBar-links" onClick={logout}>
                    LOG OUT
                  </Link>
                </li>
                {pop ? (
                  <li className="navigationBar-item">
                    <img
                      id="avatar-pop"
                      src="/images/cross.png"
                      alt="Profile"
                      className="navigationBar-profile navigationBar-links"
                      onClick={trigger}
                    ></img>
                  </li>
                ) : (
                  <li className="navigationBar-item">
                    <img
                      id="avatar-pop"
                      src={avaPath}
                      alt="Profile"
                      className="navigationBar-profile navigationBar-links"
                      onClick={trigger}
                    ></img>
                  </li>
                )}
              </ul>
              <Popup trigger={pop} setTrigger={setPop}>
                {" "}
              </Popup>
            </>
          ) : (
            <ul className="navigationBar-menu">
              <li className="navigationBar-item">
                <Link to="/credit" className="navigationBar-links">
                  CREDIT
                </Link>
              </li>
              <li className="navigationBar-item">
                <Link to="/login" className="navigationBar-links">
                  LOG IN
                </Link>
              </li>
              <li className="navigationBar-item">
                <Link to="/signup" className="navigationBar-links">
                  SIGN UP
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavigationBar;
