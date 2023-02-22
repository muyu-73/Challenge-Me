import React, { useState, useMemo, useEffect } from "react";
import NavigationBar from "./components/NavigationBar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import Select from "./components/pages/Select";
import Topic from "./components/pages/Topic";
import GameRoom from "./components/pages/GameRoom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { UserContext, AvaPath } from "./userConetext";
import Cookies from "js-cookie";
import ProtectedRoutes from "./components/ProtectedRoutes";
import UnProtectedRoutes from "./components/unProtectedRoutes";
import axios from "./api/axios";
import JoinRoom from "./components/pages/JoinRoom";
import Matchmaking from "./components/pages/Matchmaking";
import Credit from "./components/pages/Credit";

const AVA_PATH_URL = "/api/v1/getAvatar";

function App() {
  let username = Cookies.get("username");
  const [user, setUser] = useState(username, () => {});
  const [avaPath, setAvaPath] = useState();
  const getPath = async () => {
    let path = "/profile/add-user.png";
    if (user) {
      try {
        await axios
          .get(AVA_PATH_URL, {
            params: {
              username: user,
            },
          })
          .then(function (res) {
            path = res.data.message;
          });
        return path;
      } catch (err) {
        console.log(err);
        return path;
      }
    } else {
      return path;
    }
  };

  getPath().then(function (result) {
    setAvaPath(result);
  });

  const providerUser = useMemo(() => ({ user, setUser }), [user, setUser]);
  const providerAvaPath = useMemo(
    () => ({ avaPath, setAvaPath }),
    [avaPath, setAvaPath]
  );

  return (
    <>
      <Router>
        <UserContext.Provider value={providerUser}>
          <AvaPath.Provider value={providerAvaPath}>
            <NavigationBar />
            <Routes>
              <Route element={<ProtectedRoutes />}>
                <Route path="/select" element={<Select />} exact />
                <Route path="/topics" element={<Topic />} exact />
                <Route path="/joinroom" element={<JoinRoom />} exact />
                <Route path="/gameroom" element={<GameRoom />} exact />
                <Route path="/matchmaking" element={<Matchmaking />} exact />
              </Route>
              <Route path="/" element={<Home />} exact />
              <Route element={<UnProtectedRoutes />}>
                <Route path="/login" element={<Login />} exact />
                <Route path="/signup" element={<Signup />} exact />
                <Route path="/credit" element={<Credit />} exact />
              </Route>
            </Routes>
          </AvaPath.Provider>
        </UserContext.Provider>
      </Router>
    </>
  );
}

export default App;
