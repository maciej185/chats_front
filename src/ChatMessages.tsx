import "./styles/ChatMessages.css";
import { useState, useEffect, useRef } from "react";
import configData from "./config.json";
import { getErrorFromResponse } from "./utils";
import { UIEvent } from "react";
import { Message } from "./Chat";

interface ChatMessagesProps {
  token: string;
  username: string;
  chat_id: string;
  messages: Array<Message> | null;
  setMessages: CallableFunction;
}

interface FetchMessagesRes {
  status: number;
  data: Array<Message> | null;
  error: string | null;
}

async function fetchMessages(
  token: string,
  chat_id: string,
  indexFromTheTop: number
): Promise<FetchMessagesRes> {
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
  if (res.status === 200)
    return {
      status: res.status,
      data: resData,
      error: null,
    };
  return {
    status: res.status,
    data: null,
    error: getErrorFromResponse(resData),
  };
}

export default function ChatMessages({
  token,
  username,
  chat_id,
  messages,
  setMessages,
}: ChatMessagesProps) {
  const [additionalMessages, setAdditionalMessages] = useState<Array<Message>>(
    new Array()
  );
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const indexFromTheTop = useRef<number>(0);
  const messagesBottomDiv = useRef(document.createElement("div"));

  useEffect(() => {
    (async function () {
      if (!messages) {
        const fetchdMessagesRes = await fetchMessages(
          token,
          chat_id,
          indexFromTheTop.current
        );
        if (fetchdMessagesRes.data && fetchdMessagesRes.data.length > 0) {
          setMessages(fetchdMessagesRes.data);
          indexFromTheTop.current =
            indexFromTheTop.current + configData.NUMBER_OF_MESSAGES_PER_FETCH;
          if (messagesError) setMessagesError(null);
        }
        if (fetchdMessagesRes.error) setMessagesError(fetchdMessagesRes.error);
      }
    })();
  }, [messages]);

  useEffect(() => {
    messagesBottomDiv.current.scrollIntoView({
      block: "end",
    });
  }, [messages]);

  const messagesScrollListener = (e: UIEvent<HTMLDivElement>) => {
    (async function () {
      const target = e.target as HTMLDivElement;
      if (target.scrollTop === 0) {
        const fetchMessagesRes = await fetchMessages(
          token,
          chat_id,
          indexFromTheTop.current
        );
        if (fetchMessagesRes.data && fetchMessagesRes.data.length > 0) {
          const newAdditionalMessages =
            fetchMessagesRes.data.concat(additionalMessages);
          setAdditionalMessages(newAdditionalMessages);
          indexFromTheTop.current =
            indexFromTheTop.current + configData.NUMBER_OF_MESSAGES_PER_FETCH;
          if (messagesError) setMessagesError(null);
        }
      }
    })();
  };

  return (
    <div className="messages" onScroll={messagesScrollListener}>
      {additionalMessages.length > 0 ? (
        additionalMessages.reverse().map((message, ind) => (
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
