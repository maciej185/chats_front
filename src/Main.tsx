import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Feed from "./Feed";

interface MainProps {
  setUsername: CallableFunction;
  setToken: CallableFunction;
}

export default function Main({ setUsername, setToken }: MainProps) {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route
        path="/login"
        element={<Login setUsername={setUsername} setToken={setToken} />}
      />
    </Routes>
  );
}
