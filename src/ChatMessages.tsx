import "./styles/ChatMessages.css";
import { useState, useEffect, useRef } from "react";
import configData from "./config.json";
import { getErrorFromResponse } from "./utils";

interface ChatMessagesProps {
  token: string;
  username: string;
  chat_id: string;
}

interface Message {
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

async function fetchMessages(
  token: string,
  chat_id: string,
  indexFromTheTop: number,
  messagesSetter: CallableFunction,
  messagesError: string | null,
  messagesErrorSetter: CallableFunction,
  indexFromTheTopSetter: CallableFunction
) {
  const url =
    (
      configData.API_URL +
      ":" +
      configData.API_PORT +
      configData.GET_MESSAGES_ENDPOINT
    ).replace("chat_id", chat_id) + `?index_from_the_top=${indexFromTheTop}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await res.json();
  if (res.status === 200) {
    resData.reverse();
    messagesSetter(resData);
    indexFromTheTopSetter(
      indexFromTheTop + configData.NUMBER_OF_MESSAGES_PER_FETCH
    );
    if (messagesError) messagesErrorSetter(null);
    return;
  } else {
    messagesErrorSetter(getErrorFromResponse(resData));
  }
}

export default function ChatMessages({
  token,
  username,
  chat_id,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<Array<Message> | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [indexFromTheTop, setIndexFromTheTop] = useState<number>(0);
  const messagesBottomDiv = useRef(document.createElement("div"));

  useEffect(() => {
    if (!messages)
      fetchMessages(
        token,
        chat_id,
        indexFromTheTop,
        setMessages,
        messagesError,
        setMessagesError,
        setIndexFromTheTop
      );
  }, []);

  useEffect(() => {
    messagesBottomDiv.current.scrollIntoView({
      block: "end",
    });
  }, [messages]);

  return (
    <div className="messages">
      {messages ? (
        messages.reverse().map((message, ind) => (
          <div
            className={`messages-message ${
              message.chat_member.user.username === username
                ? "sent"
                : "received"
            }`}
            key={`messages-message-${ind}`}
          >
            <div className="messages-message-info">
              {new Date(message.time_sent).toLocaleString("pl-PL")}{" "}
              {message.chat_member.user.username === username
                ? ""
                : `${message.chat_member.user.profile.first_name} ${message.chat_member.user.profile.last_name}`}
            </div>
            <div className="messages-message-main">{message.text}</div>
          </div>
        ))
      ) : (
        <></>
      )}
      <div className="messages-bottom" ref={messagesBottomDiv}></div>
    </div>
  );
}
