import "./styles/Chat.css";
import { useParams } from "react-router-dom";
import {
  useState,
  useEffect,
  MouseEventHandler,
  ChangeEvent,
  ChangeEventHandler,
} from "react";
import configData from "./config.json";
import { useNavigate } from "react-router-dom";
import { getErrorFromResponse } from "./utils";

interface ChatProps {
  token: string;
}

interface chatInfoInterface {
  name: string;
  members: Array<{
    user: {
      username: string;
      profile: { first_name: string; last_name: string };
    };
  }>;
}

async function fetchChatData(
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

export default function Chat({ token }: ChatProps) {
  const [chatInfo, setChatInfo] = useState<chatInfoInterface | null>(null);
  const [chatInfoError, setChatInfoError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [sendBtnClickHandlerFunction, setSendBtnClickHandlerFunction] =
    useState<MouseEventHandler | undefined>(undefined);
  const [sendBtnStateClassName, setSendBtnStateClassName] =
    useState<string>("inactive");
  const { chat_id } = useParams<string>();
  const navigate = useNavigate();

  const sendBtnClickHandler: MouseEventHandler = (e) => {};

  const textareaChangleHandler: ChangeEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    setInputMessage(target.value);
    if (target.value === "") {
      setSendBtnClickHandlerFunction(undefined);
      setSendBtnStateClassName("inactive");
    } else {
      setSendBtnClickHandlerFunction(sendBtnClickHandler);
      setSendBtnStateClassName("active");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    (async function () {
      await fetchChatData(
        Number(chat_id),
        token,
        setChatInfo,
        chatInfoError,
        setChatInfoError
      );
    })();
    setSendBtnClickHandlerFunction(sendBtnClickHandler);
  }, []);

  return (
    <div className="chat">
      <div className="chat-members">
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
        <div className="chat-main-messages"></div>
        <div className="chat-main-message">
          <div className="chat-main-message-text">
            <textarea
              value={inputMessage}
              onChange={textareaChangleHandler}
            ></textarea>
          </div>
          <div
            className={`chat-main-message-send ${sendBtnStateClassName}`}
            onClick={sendBtnClickHandlerFunction}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-send"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
