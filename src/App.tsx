import "./styles/App.css";
import { useState, useEffect } from "react";
import Nav from "./Nav";
import Main from "./Main";
import { getCookie } from "./utils";

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const usernameFromCookie = getCookie("username");
    const tokenFromCookie = getCookie("token");

    if (usernameFromCookie && tokenFromCookie) {
      setUsername(usernameFromCookie);
      setToken(tokenFromCookie);
    }
  }, []);

  return (
    <>
      <Nav username={username} setUsername={setUsername} setToken={setToken} />
      <Main setUsername={setUsername} setToken={setToken} token={token} />
    </>
  );
}
