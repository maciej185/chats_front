import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Chats from "./Chats";
import Register from "./Register";
import ChatCreate from "./ChatCreate";
import Chat from "./Chat";
import ChatAddMember from "./ChatAddMember";

interface MainProps {
  setUsername: CallableFunction;
  tokenDispatch: CallableFunction;
  username: string;
}

export default function Main({
  setUsername,
  tokenDispatch,
  username,
}: MainProps) {
  return (
    <Routes>
      <Route path="/" element={<Chats />} />
      <Route
        path="/login"
        element={
          <Login setUsername={setUsername} tokenDispatch={tokenDispatch} />
        }
      />
      <Route
        path="/register"
        element={
          <Register setUsername={setUsername} tokenDispatch={tokenDispatch} />
        }
      />
      <Route path="/create" element={<ChatCreate />} />
      <Route path="/chat/:chat_id" element={<Chat username={username} />} />
      <Route
        path="/chat/add_member/:chat_id"
        element={<ChatAddMember username={username} />}
      />
    </Routes>
  );
}
