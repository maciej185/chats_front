import "./styles/Register.css";
import { MouseEventHandler, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import configData from "./config.json";
import { login } from "./Login";
import { getBackendAddress } from "./utils";

interface RegisterProps {
  setUsername: CallableFunction;
  tokenDispatch: CallableFunction;
}

export default function Register({
  setUsername,
  tokenDispatch,
}: RegisterProps) {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputFirstName, setInputFirstName] = useState<string>("");
  const [inputLastName, setInputLastName] = useState<string>("");
  const [inputDateOfBirth, setInputDateOfBirth] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const buttonHandleClick: MouseEventHandler = (e) => {
    (async function () {
      const endpointUrl =
        "http://" + getBackendAddress() + configData.REGISTER_ENDPOINT;
      try {
        const res = await fetch(endpointUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_data: {
              username: inputUsername,
              email: inputEmail,
              plain_text_password: inputPassword,
            },
            profile_data: {
              first_name: inputFirstName,
              last_name: inputLastName,
              date_of_birth: inputDateOfBirth,
            },
          }),
        });
        if (res.status == 201) {
          setUsername(inputUsername);
          if (error) setError(null);
          await login(
            inputUsername,
            inputPassword,
            error,
            setUsername,
            tokenDispatch,
            setError
          );
          navigate("/");
        } else {
          const resJSON = await res.json();
          setError(resJSON["detail"]);
        }
      } catch (e) {
        setError("Network issue, please try again later.");
      }
    })();
  };

  return (
    <div className="register">
      <div className="register-top">
        {error ? <div className="register-top-error">{error}</div> : <></>}
        <div className="register-top-form">
          <div className="register-top-form-email">
            <div className="register-top-form-email-label register-top-form-input-label">
              E-mail
            </div>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => {
                setInputEmail(e.target.value);
              }}
              name="email"
              id="email"
            />
          </div>
          <div className="register-top-form-username">
            <div className="register-top-form-username-label register-top-form-input-label">
              Username
            </div>
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
              name="username"
              id="username"
            />
          </div>
          <div className="register-top-form-password">
            <div className="register-top-form-password-label register-top-form-input-label">
              Password
            </div>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
              name="password"
              id="password"
            />
          </div>
          <div className="register-top-form-first_name">
            <div className="register-top-form-first_name-label register-top-form-input-label">
              First name
            </div>
            <input
              type="text"
              value={inputFirstName}
              onChange={(e) => {
                setInputFirstName(e.target.value);
              }}
              name="first_name"
              id="first_name"
            />
          </div>
          <div className="register-top-form-last_name">
            <div className="register-top-form-last_name-label register-top-form-input-label">
              Last name
            </div>
            <input
              type="text"
              value={inputLastName}
              onChange={(e) => {
                setInputLastName(e.target.value);
              }}
              name="last_name"
              id="last_name"
            />
          </div>
          <div className="register-top-form-date_of_birth">
            <div className="register-top-form-date_of_birth-label register-top-form-input-label">
              Last name
            </div>
            <input
              type="date"
              value={inputDateOfBirth}
              onChange={(e) => {
                setInputDateOfBirth(e.target.value);
              }}
              name="date_of_birth"
              id="date_of_birth"
            />
          </div>
          <div className="register-top-form-button">
            <button onClick={buttonHandleClick}>Register</button>
          </div>
        </div>
      </div>
      <div className="register-bottom">
        If you already have an account, you can login{" "}
        <Link to="/login">here</Link>.
      </div>
    </div>
  );
}
