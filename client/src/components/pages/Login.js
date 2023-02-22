import "../../App.css";
import "../style/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "../../api/axios";
import { UserContext } from "../../userConetext";

const LOGIN_URL = "/api/v1/login";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [nameErr, setNameErr] = useState(null);

  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState(null);

  const { user, setUser } = useContext(UserContext);

  function setColor(target, color) {
    document.documentElement.style.setProperty(target, color);
  }

  useEffect(() => {
    if (username) {
      if (username.length < 6 || username.length > 12) {
        setNameErr("Username length needs to be 6 - 12 characters");
      } else {
        setNameErr(null);
      }
    }
  }, [username]);

  useEffect(() => {
    if (pwdErr) setColor("--color-pwd", "red");
    else setColor("--color-pwd", "white");

    if (nameErr) setColor("--color-username", "red");
    else setColor("--color-username", "white");
  }, [pwdErr, nameErr]);

  useEffect(() => {
    if (pwd) {
      if (pwd.length < 6 || pwd.length > 26) {
        setPwdErr("Password length need to be 6 - 26 characters");
      } else {
        setPwdErr(null);
      }
    }
  }, [pwd]);

  const login = (e) => {
    e.preventDefault();
    if (!nameErr && !pwdErr) {
      axios
        .post(LOGIN_URL, {
          username: username,
          password: pwd,
        })
        .then(function (res) {
          setUser(res.data);
          navigate("/select", { replace: true });
        })
        .catch(function (error) {
          if (
            error.response.status === 400 ||
            error.response.status === 401 ||
            error.response.status === 404
          ) {
            setNameErr(error.response.data.message);
            setPwdErr(error.response.data.message);
          } else {
            console.log("something went wrong");
          }
        });
    }
  };

  return (
    <>
      <div className="Form-body">
        <div className="Form-container">
          <div className="brand-logo"></div>
          <div className="brand-title">LOGIN</div>
          <form className="Form-inputs">
            <div className="input-box">
              <input
                className="Form-input"
                type="text"
                name="username"
                id="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
              <label className="Form-label">USERNAME</label>
              {username ? (
                <p className="err-msg"> {nameErr}</p>
              ) : (
                <p className="tip-msg"></p>
              )}
            </div>
            <div className="input-box">
              <input
                className="Form-input"
                id="pwd"
                type="password"
                autoComplete="off"
                onChange={(e) => {
                  setPwd(e.target.value);
                }}
                required
              />
              <label className="Form-label">PASSWORD</label>
              {pwd ? (
                <p className="err-msg"> {pwdErr}</p>
              ) : (
                <p className="tip-msg"></p>
              )}
            </div>
          </form>
          <br></br>
          <button className="Form-button" onClick={login}>
            LOGIN
          </button>
          <div>
            <Link to="/signup" className="link">
              Don't have an account yet? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
