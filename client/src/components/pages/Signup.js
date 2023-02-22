import "../../App.css";
import "../style/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "../../api/axios.js";
import { UserContext } from "../../userConetext";

const USER_REGEX = new RegExp(/^[A-z0-9-_]{5,12}$/);
const PWD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,24})"
);
const REGISTER_URL = "/api/v1/signup";

function Signup() {
  const navigate = useNavigate();

  const [usernameReg, setUsernameReg] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameErr, setNameErr] = useState(null);

  const [pwdReg, setPwdReg] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdErr, setPwdErr] = useState(null);

  const [matchPwdReg, setMatchPwdReg] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchErr, setMatchErr] = useState(false);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setValidName(USER_REGEX.test(usernameReg));
  }, [usernameReg]);

  useEffect(() => {
    if (usernameReg) {
      if (usernameReg.length < 6 || usernameReg.length > 12) {
        setNameErr("Username length need to be 6 - 12 characters");
      } else if (!validName) {
        setNameErr("Username can only contains letters, numbers, '_', and '-'");
      } else {
        setNameErr(null);
      }
    }
  }, [validName, usernameReg]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwdReg));
    setValidMatch(pwdReg === matchPwdReg);
  }, [pwdReg, matchPwdReg]);

  useEffect(() => {
    if (pwdReg) {
      if (pwdReg.length < 8 || pwdReg.length > 26) {
        setPwdErr("Password length need to be 8 - 26 characters");
      } else if (!validPwd) {
        setPwdErr(
          "Password must contains uppercase, lowercase, number and a symbol"
        );
      } else {
        setPwdErr(null);
      }
    }
  }, [validPwd, pwdReg]);

  useEffect(() => {
    if (matchPwdReg) {
      if (!validMatch) {
        setMatchErr("Those passwords are not match");
      } else {
        setMatchErr(null);
      }
    }
  }, [validMatch]);

  function setColor(target, color) {
    document.documentElement.style.setProperty(target, color);
  }

  useEffect(() => {
    if (pwdErr) setColor("--color-pwdReg", "red");
    else setColor("--color-pwdReg", "white");

    if (nameErr) setColor("--color-userReg", "red");
    else setColor("--color-userReg", "white");

    if (matchErr) setColor("--color-matchReg", "red");
    else setColor("--color-matchReg", "white");
  }, [pwdErr, nameErr, matchErr]);

  const signup = (e) => {
    e.preventDefault();
    if (!pwdErr && !nameErr && !matchErr) {
      axios
        .post(REGISTER_URL, {
          username: usernameReg,
          password: pwdReg,
          confirmPassword: matchPwdReg,
        })
        .then(function (res) {
          setUser(res.data);
          navigate("/select", { replace: true });
        })
        .catch(function (error) {
          if (error.response.status === 409) {
            setNameErr(error.response.data.message);
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
          <div className="brand-title">SIGN UP</div>
          <form className="Form-inputs">
            <div className="input-box">
              <input
                className="Form-input"
                id="usernameReg"
                type="text"
                placeholder=" "
                name="username"
                onChange={(e) => {
                  setUsernameReg(e.target.value);
                }}
                required
              />
              <label className="Form-label">USERNAME</label>
              {usernameReg ? (
                <p className="err-msg"> {nameErr}</p>
              ) : (
                <p className="tip-msg">
                  You can use letters, numbers, ' _ ', and ' - '
                </p>
              )}
            </div>
            <div className="input-box">
              <input
                className="Form-input"
                id="pwdReg"
                type="password"
                autoComplete="off"
                onChange={(e) => {
                  setPwdReg(e.target.value);
                }}
                required
              />
              <label className="Form-label">PASSWORD</label>
              {pwdReg ? (
                <p className="err-msg"> {pwdErr}</p>
              ) : (
                <p className="tip-msg">
                  Password with length 8 - 24 with letters, nunmbers and special
                  characters
                </p>
              )}
            </div>
            <div className="input-box">
              <input
                className="Form-input"
                id="pwdMatch"
                type="password"
                autoComplete="off"
                onChange={(e) => {
                  setMatchPwdReg(e.target.value);
                }}
                required
              />
              <label className="Form-label">REPEAT PASSWORD</label>
              <p className="err-msg">{matchErr}</p>
            </div>
            <br></br>
          </form>
          <button className="Form-button" onClick={signup}>
            SIGN UP
          </button>
          <div>
            <Link to="/login" className="link">
              Have an Account Already? Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
