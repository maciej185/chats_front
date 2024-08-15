import "./styles/Chats.css";
import { useEffect, useState, useContext } from "react";
import configData from "./config.json";
import { Link } from "react-router-dom";
import { getBackendAddress } from "./utils";
import { useAuthenticate } from "./hooks";
import { TokenContext } from "./tokenContext";

interface ChatProps {
  token: string;
}

interface GetChatsRespoonse {
  error_detail?: string;
  chats?: Array<{ chat_id: string; name: string }>;
}

async function getChats(token: string): Promise<GetChatsRespoonse> {
  const url = "http://" + getBackendAddress() + configData.GET_CHATS_ENDPOINT;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    return res.status === 200
      ? { chats: resData }
      : { error_detail: resData.detail };
  } catch (e) {
    return {
      error_detail: "Network issues, try again later",
    };
  }
}

export default function Chats() {
  const [chats, setChats] = useState<GetChatsRespoonse | null>(null);
  const token = useContext(TokenContext);
  useAuthenticate(token);

  useEffect(() => {
    (async function () {
      const chats = await getChats(token);
      setChats(chats);
    })();
  }, [token]);

  return (
    <div className="chats">
      <div className="chats-search"></div>
      <div className="chats-header">Your chats</div>
      <div className="chats-list">
        {chats?.chats ? (
          chats.chats.map((chat_object, ind) => (
            <div key={`chat-${ind}`} className="chats-list-chat">
              <Link to={`/chat/${chat_object.chat_id}`}>
                {chat_object.name}
              </Link>
            </div>
          ))
        ) : (
          <div className="chats-list-error">{chats?.error_detail}</div>
        )}
      </div>
      <div className="chats-create">
        <div className="chats-create-btn">
          <Link to="/create">Create chat</Link>
        </div>
      </div>
    </div>
  );
}
