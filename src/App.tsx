import "./styles/App.css";
import { useState, useEffect } from "react";
import Nav from "./Nav";
import Main from "./Main";

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const usernameFromSessionStorage = localStorage.getItem("username");
    const tokenFromSessionStorage = localStorage.getItem("token");

    if (usernameFromSessionStorage && tokenFromSessionStorage) {
      setUsername(usernameFromSessionStorage);
      setToken(tokenFromSessionStorage);
    }
  }, []);

  return (
    <>
      <Nav username={username} setUsername={setUsername} setToken={setToken} />
      <Main
        setUsername={setUsername}
        setToken={setToken}
        token={token}
        username={username}
      />
    </>
  );
}
