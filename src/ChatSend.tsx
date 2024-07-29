import "./styles/ChatSend.css";
import { useState, useEffect } from "react";
import { MouseEventHandler, ChangeEventHandler } from "react";

export default function ChatSend() {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [sendBtnClickHandlerFunction, setSendBtnClickHandlerFunction] =
    useState<MouseEventHandler | undefined>(undefined);
  const [sendBtnStateClassName, setSendBtnStateClassName] =
    useState<string>("send-inactive");

  const sendBtnClickHandler: MouseEventHandler = (e) => {};

  useEffect(() => {
    setSendBtnClickHandlerFunction(sendBtnClickHandler);
  }, []);

  const textareaChangleHandler: ChangeEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    setInputMessage(target.value);
    if (target.value === "") {
      setSendBtnClickHandlerFunction(undefined);
      setSendBtnStateClassName("send-inactive");
    } else {
      setSendBtnClickHandlerFunction(sendBtnClickHandler);
      setSendBtnStateClassName("send-active");
    }
  };

  return (
    <div className="send">
      <div className="send-text">
        <textarea
          value={inputMessage}
          onChange={textareaChangleHandler}
        ></textarea>
      </div>
      <div
        className={`send-send ${sendBtnStateClassName}`}
        onClick={sendBtnClickHandlerFunction}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="bi bi-send"
          viewBox="0 0 16 16"
        >
          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
        </svg>
      </div>
    </div>
  );
}
