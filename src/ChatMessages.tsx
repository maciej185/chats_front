import "./styles/ChatMessages.css";
import { useState, useEffect, useRef } from "react";
import configData from "./config.json";
import { getErrorFromResponse, getBackendAddress } from "./utils";
import { UIEvent } from "react";
import { Message, fetchImage } from "./Chat";

interface ChatMessagesProps {
  token: string;
  username: string;
  chat_id: string;
  newMessages: Array<Message>;
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
      "http://" +
      getBackendAddress() +
      configData.GET_MESSAGES_ENDPOINT
    ).replace("chat_id", chat_id) + `?index_from_the_top=${indexFromTheTop}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await res.json();
  if (res.status === 200) {
    const messages = resData as Array<Message>;
    return {
      status: res.status,
      data: messages.reverse(),
      error: null,
    };
  }

  return {
    status: res.status,
    data: null,
    error: getErrorFromResponse(resData),
  };
}

async function fetchImagesForMessageList(
  token: string,
  fetchedMessages: Array<Message>,
  messagesSetter: CallableFunction
) {
  // setting the messages list right away so that text messages get displayed imidiatelly
  messagesSetter(fetchedMessages);

  // re-setting the `images` state variable after each image was fetched so they
  // get rendered one by one

  const messagesWithImages = [...fetchedMessages];
  for (let i = 0; i < messagesWithImages.length; i++) {
    if (messagesWithImages[i].contains_image && !messagesWithImages[i].image) {
      const fetchedImage = await fetchImage(
        token,
        messagesWithImages[i].message_id
      );
      messagesWithImages[i].image = fetchedImage;
      const messagesWithImagesUpdated = [...messagesWithImages];
      messagesSetter(messagesWithImagesUpdated);
    }
  }
}

export default function ChatMessages({
  token,
  username,
  chat_id,
  newMessages,
}: ChatMessagesProps) {
  const [additionalMessages, setAdditionalMessages] = useState<Array<Message>>(
    new Array()
  );
  const [messages, setMessages] = useState<Array<Message> | null>(null);
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
          await fetchImagesForMessageList(
            token,
            fetchdMessagesRes.data,
            setMessages
          );

          indexFromTheTop.current =
            indexFromTheTop.current + configData.NUMBER_OF_MESSAGES_PER_FETCH;
          if (messagesError) setMessagesError(null);
        }
        if (fetchdMessagesRes.error) setMessagesError(fetchdMessagesRes.error);
      }
    })();
  }, []);

  useEffect(() => {
    messagesBottomDiv.current.scrollIntoView({
      block: "end",
    });
  }, [messages, newMessages]);

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
          await fetchImagesForMessageList(
            token,
            newAdditionalMessages,
            setAdditionalMessages
          );

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
        additionalMessages.map((message, ind) => (
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
            {!message.contains_image ? (
              <div className="messages-message-main">{message.text}</div>
            ) : (
              <div className="messages-message-main ">
                <div className="messages-message-main-img">
                  {message.image ? (
                    <img src={URL.createObjectURL(message.image)} />
                  ) : (
                    <div className="messages-message-main-img error">
                      There was an error when trying to fetch the image.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <></>
      )}
      {messages ? (
        messages.map((message, ind) => (
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
            {!message.contains_image ? (
              <div className="messages-message-main">{message.text}</div>
            ) : (
              <div className="messages-message-main ">
                <div className="messages-message-main-img">
                  {message.image ? (
                    <img src={URL.createObjectURL(message.image)} />
                  ) : (
                    <div className="messages-message-main-img error">
                      There was an error when trying to fetch the image.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <></>
      )}
      {newMessages.length > 0 ? (
        newMessages.map((message, ind) => (
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
            {!message.contains_image ? (
              <div className="messages-message-main">{message.text}</div>
            ) : (
              <div className="messages-message-main ">
                <div className="messages-message-main-img">
                  {message.image ? (
                    <img src={URL.createObjectURL(message.image)} />
                  ) : (
                    <div className="messages-message-main-img error">
                      There was an error when trying to fetch the image.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <></>
      )}
      <div className="messages-bottom" ref={messagesBottomDiv}></div>
    </div>
  );
}
