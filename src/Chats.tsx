import "./styles/Chats.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import configData from "./config.json";
import { Link } from "react-router-dom";

interface ChatProps {
  token: string;
}

async function getChats(token: string) {
  const url =
    configData.API_URL +
    ":" +
    configData.API_PORT +
    configData.GET_CHATS_ENDPOINT;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status == 200) {
    const resData = await res.json();
    return resData;
  } else {
    return null;
  }
}

export default function Chats({ token }: ChatProps) {
  const [chats, setChats] = useState<Array<{
    name: string;
    chat_id: number;
  }> | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
    (async function () {
      const chats = await getChats(token);
      if (chats === null) {
        setChatsError("There was an error when fetching data");
      } else {
        setChats(chats);
        if (chatsError) setChatsError(null);
      }
    })();
  }, []);

  return (
    <div className="chats">
      <div className="chats-search"></div>
      <div className="chats-header">Your chats</div>
      <div className="chats-list">
        {chats
          ? chats.map((chat_object, ind) => (
              <div key={`chat-${ind}`} className="chats-list-chat">
                <Link to={`/chat/${chat_object.chat_id}`}>
                  {chat_object.name}
                </Link>
              </div>
            ))
          : chatsError}
      </div>
      <div className="chats-create">
        <div className="chats-create-btn">
          <Link to="/create">Create chat</Link>
        </div>
      </div>
    </div>
  );
}
