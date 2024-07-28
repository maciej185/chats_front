import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Chats from "./Chats";
import Register from "./Register";
import ChatCreate from "./ChatCreate";
import Chat from "./Chat";

interface MainProps {
  setUsername: CallableFunction;
  setToken: CallableFunction;
  token: string;
}

export default function Main({ setUsername, setToken, token }: MainProps) {
  return (
    <Routes>
      <Route path="/" element={<Chats token={token} />} />
      <Route
        path="/login"
        element={<Login setUsername={setUsername} setToken={setToken} />}
      />
      <Route
        path="/register"
        element={<Register setUsername={setUsername} setToken={setToken} />}
      />
      <Route path="/create" element={<ChatCreate token={token} />} />
      <Route path="/chat/:chat_id" element={<Chat token={token} />} />
    </Routes>
  );
}
