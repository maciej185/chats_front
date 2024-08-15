import {
  useState,
  useEffect,
  MouseEventHandler,
  FormEventHandler,
} from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ChatCreate.css";
import configData from "./config.json";
import { getErrorFromResponse, getBackendAddress } from "./utils";
import { useAuthenticate } from "./hooks";

interface ChatCreateProps {
  token: string;
}

export default function ChatCreate({ token }: ChatCreateProps) {
  const [inputName, setInputName] = useState<string>("");
  const [inputNameError, setInputNameError] = useState<string | null>(null);
  const navigate = useNavigate();
  useAuthenticate(token);

  const createBtnClickHandler: MouseEventHandler = (e) => {
    if (inputName === "") {
      setInputNameError("Please provide a name");
      return;
    }
    (async function () {
      const url =
        "http://" + getBackendAddress() + configData.CREATE_CHAT_ENDPOINT;
      try {
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            name: inputName,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status == 201) {
          navigate("/");
        } else {
          const resData = await res.json();
          setInputNameError(getErrorFromResponse(resData));
        }
      } catch (e) {
        setInputNameError("Network issue, please try again later.");
      }
    })();
  };

  const nameInputChangeHandler: FormEventHandler = (e) => {
    if (inputNameError) setInputNameError(null);
    const target = e.target as HTMLInputElement;
    setInputName(target.value);
  };

  return (
    <div className="create">
      <div className="create-header">Create a new chat</div>
      <div className="create-main">
        {inputNameError ? (
          <div className="create-main-error">{inputNameError}</div>
        ) : (
          <></>
        )}
        <div className="create-main-input">
          <input
            type="text"
            value={inputName}
            onChange={nameInputChangeHandler}
            id="chat_name"
          ></input>
        </div>
        <div className="create-main-btn">
          <button type="submit" onClick={createBtnClickHandler}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
