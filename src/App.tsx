import "./styles/App.css";
import { useState, useEffect, useReducer } from "react";
import Nav from "./Nav";
import Main from "./Main";

function tokenReducer(_token: string, action: { token_value: string }) {
  return action.token_value;
}

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [token, tokenDispatch] = useReducer(tokenReducer, "");

  useEffect(() => {
    const usernameFromSessionStorage = sessionStorage.getItem("username");
    const tokenFromSessionStorage = sessionStorage.getItem("token");

    if (usernameFromSessionStorage && tokenFromSessionStorage) {
      setUsername(usernameFromSessionStorage);
      tokenDispatch({ token_value: tokenFromSessionStorage });
    }
  }, []);

  return (
    <>
      <Nav
        username={username}
        setUsername={setUsername}
        tokenDispatch={tokenDispatch}
      />
      <Main
        setUsername={setUsername}
        tokenDispatch={tokenDispatch}
        token={token}
        username={username}
      />
    </>
  );
}
