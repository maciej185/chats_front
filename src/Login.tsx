import configData from "./config.json";
import { MouseEventHandler, useState } from "react";
import "./styles/Login.css";
import { getBackendAddress } from "./utils";

import { useNavigate, Link } from "react-router-dom";

export async function login(
  username: string,
  password: string,
  error: string | null,
  usernameSetter: CallableFunction,
  tokenDispatch: CallableFunction,
  errorSetter: CallableFunction
) {
  const endpointUrl =
    "http://" + getBackendAddress() + configData.LOGIN_ENDPOINT;
  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);
  try {
    const res = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: data,
    });
    const resJSON = await res.json();
    if (res.status === 200) {
      usernameSetter(username);
      tokenDispatch({ token_value: resJSON.access_token });

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("token", resJSON.access_token);

      if (error) errorSetter(null);

      return true;
    } else {
      errorSetter(resJSON["detail"]);
      return false;
    }
  } catch (e) {
    errorSetter("Network issue, please try again later.");
  }
}

interface LoginProps {
  setUsername: CallableFunction;
  tokenDispatch: CallableFunction;
  admin?: Boolean;
}

export default function Login({
  setUsername,
  tokenDispatch,
  admin = false,
}: LoginProps) {
  const [inputUsername, setInputUsername] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const buttonHandleClick: MouseEventHandler = (e) => {
    (async function () {
      const loginSuccessful = await login(
        inputUsername,
        inputPassword,
        error,
        setUsername,
        tokenDispatch,
        setError
      );
      if (loginSuccessful) navigate(admin ? "/admin" : "/");
    })();
  };

  return (
    <div className="login">
      <div className="login-top">
        {error ? <div className="login-top-error">{error}</div> : <></>}
        <div className="login-top-form">
          <div className="login-top-form-username">
            <div className="login-top-form-username-label login-top-form-input-label">
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
          <div className="login-top-form-password">
            <div className="login-top-form-password-label login-top-form-input-label">
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
          <div className="login-top-form-button">
            <button onClick={buttonHandleClick}>Login</button>
          </div>
        </div>
      </div>
      <div className="login-bottom">
        If you don't already have an account, you can register{" "}
        <Link to="/register">here</Link>.
      </div>
    </div>
  );
}
