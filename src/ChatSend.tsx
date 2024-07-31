import "./styles/ChatSend.css";
import { useState, useEffect } from "react";
import { MouseEventHandler, ChangeEventHandler } from "react";

interface ChatSendProps {
  socket: WebSocket | null;
}

interface Message2BeSent {
  message: string;
}

export default function ChatSend({ socket }: ChatSendProps) {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [sendBtnStateClassName, setSendBtnStateClassName] =
    useState<string>("send-active");
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    setSendBtnStateClassName(
      inputMessage === "" ? "send-inactive" : "send-active"
    );
  }, [inputMessage]);

  const sendBtnClickHandler: MouseEventHandler = (e) => {
    if (inputMessage === "") return;
    let i = 0;
    if (socket) {
      while (i < 10) {
        if (socket.readyState == WebSocket.OPEN) {
          const message = { message: inputMessage } as Message2BeSent;
          socket.send(JSON.stringify(message));
          if (sendError) setSendError(null);
          setInputMessage("");
          return;
        }
        i++;
      }
      setSendError("Unable to send message, try again later.");
    }
  };

  const textareaChangleHandler: ChangeEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    setInputMessage(target.value);
    setSendBtnStateClassName(
      inputMessage === "" ? "send-inactive" : "send-active"
    );
  };

  return (
    <>
      {sendError ? <div className="send-error">{sendError}</div> : <></>}
      <div className="send">
        <div className="send-text">
          <textarea
            value={inputMessage}
            onChange={textareaChangleHandler}
          ></textarea>
        </div>
        <div
          className={`send-send ${sendBtnStateClassName}`}
          onClick={sendBtnClickHandler}
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
    </>
  );
}
