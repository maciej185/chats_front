import { Link } from "react-router-dom";
import { deleteCookie } from "./utils";
import "./styles/Nav.css";

interface NavProps {
  username: string;
  setUsername: CallableFunction;
  tokenDispatch: CallableFunction;
}

export default function Nav({
  username,
  setUsername,
  tokenDispatch,
}: NavProps) {
  function logoutHandleClick() {
    setUsername(null);
    tokenDispatch({ token_value: null });

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
  }

  return (
    <div className="nav">
      <div className="nav-logo">
        <Link to="/">Chats</Link>
      </div>
      {username ? (
        <div className="nav-user">
          <div className="nav-user-username">{username}</div>
          <div className="nav-user-logout" onClick={logoutHandleClick}>
            Logout
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
