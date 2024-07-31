import "./styles/Chat.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import configData from "./config.json";
import { useNavigate } from "react-router-dom";
import { getErrorFromResponse } from "./utils";
import ChatMessages from "./ChatMessages";
import ChatSend from "./ChatSend";

interface ChatProps {
  token: string;
  username: string;
}

export type chatMembers = Array<{
  user_id: number;
  user: {
    username: string;
    profile: { first_name: string; last_name: string };
  };
}>;

export interface chatInfoInterface {
  name: string;
  members: chatMembers;
}

export async function fetchChatData(
  chat_id: number,
  token: string,
  ChatInfoSetter: CallableFunction,
  chatInfoError: string | null,
  ChatInfoErrorSetter: CallableFunction
) {
  const url = (
    configData.API_URL +
    ":" +
    configData.API_PORT +
    configData.GET_CHAT_ENDPOINT
  ).replace("chat_id", String(chat_id));
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await res.json();
  if (res.status == 200) {
    ChatInfoSetter(resData);
    if (chatInfoError) ChatInfoSetter(null);
    return;
  } else {
    const resData = await res.json();
    ChatInfoErrorSetter(getErrorFromResponse(resData));
  }
}

export function checkIfcurrentUserIsChatMember(
  currentUsersUsername: string,
  members: chatMembers
): boolean {
  members.forEach((chatMember) => {
    if (chatMember.user.username === currentUsersUsername) return true;
  });
  return false;
}

export interface Message {
  text: string;
  time_sent: string;
  chat_member: {
    user: {
      username: "user";
      profile: {
        first_name: string;
        last_name: string;
      };
    };
  };
}

const getWebSocketConnectionURL = (
  chat_id: string | undefined,
  token: string
): string => {
  return chat_id
    ? configData.WS_API_URL +
        ":" +
        configData.API_PORT +
        configData.CHAT_WS_URL.replace("chat_id", chat_id) +
        `?token=${token}`
    : "";
};

export default function Chat({ token, username }: ChatProps) {
  const [chatInfo, setChatInfo] = useState<chatInfoInterface | null>(null);
  const [chatInfoError, setChatInfoError] = useState<string | null>(null);
  const [currentUserIsChatMember, setCurrentUserIsChatMember] =
    useState<boolean>(true);
  const [newMessages, setNewMessages] = useState<Array<Message>>(new Array());
  const { chat_id } = useParams<string>();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const webSocketMessageHandler = (e: MessageEvent) => {
    const newMessage = (({ text, time_sent, chat_member }) => ({
      text,
      time_sent,
      chat_member,
    }))(JSON.parse(e.data)) as Message;
    setNewMessages((newMessages) => [...newMessages, newMessage]);
  };

  useEffect(() => {
    if (!socket) {
      const newSocket = new WebSocket(
        getWebSocketConnectionURL(chat_id, token)
      );
      setSocket(newSocket);
      newSocket.addEventListener("message", webSocketMessageHandler);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!chatInfo)
      (async function () {
        await fetchChatData(
          Number(chat_id),
          token,
          setChatInfo,
          chatInfoError,
          setChatInfoError
        );
      })();
    if (chatInfo)
      setCurrentUserIsChatMember(
        checkIfcurrentUserIsChatMember(username, chatInfo.members)
      );
  }, [token]);

  return currentUserIsChatMember ? (
    <div className="chat">
      <div className="chat-members">
        <div className="chat-members-add">
          <Link
            to={`/chat/add_member/${chat_id}`}
            state={{ chat_name: chatInfo?.name }}
          >
            <div className="chat-members-add-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                />
              </svg>
            </div>
          </Link>
        </div>
        {chatInfo ? (
          chatInfo.members.map((chatMemberObject, ind) => (
            <div
              key={`chat-members-member-${ind}`}
              className="chat-members-member"
            >
              <div className="chat-members-member-username">
                {chatMemberObject.user.username}
              </div>
              <div className="chat-members-member-name">
                {chatMemberObject.user.profile.first_name}{" "}
                {chatMemberObject.user.profile.last_name}
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="chat-main">
        <div className="chat-main-header">
          {chatInfo ? chatInfo.name : "Loading"}
        </div>
        <ChatMessages
          token={token}
          username={username}
          chat_id={String(chat_id)}
          newMessages={newMessages}
        />
        <ChatSend />
      </div>
    </div>
  ) : (
    <div className="chat-error">You are not a member of this chat!</div>
  );
}
