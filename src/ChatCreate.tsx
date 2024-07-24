import {
  useState,
  useEffect,
  MouseEventHandler,
  FormEventHandler,
} from "react";
import { useNavigate } from "react-router-dom";
import "./styles/ChatCreate.css";
import configData from "./config.json";

interface ChatCreateProps {
  token: string;
}

export default function ChatCreate({ token }: ChatCreateProps) {
  const [inputName, setInputName] = useState<string>("");
  const [inputNameError, setInputNameError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  const createBtnClickHandler: MouseEventHandler = (e) => {
    if (inputName === "") {
      setInputNameError("Please provide a name");
      return;
    }
    (async function () {
      const url =
        configData.API_URL +
        ":" +
        configData.API_PORT +
        configData.CREATE_CHAT_ENDPOINT;
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
        type resDetailType = string | Array<{ msg: string }>;
        const resDataDetail = resData.detail as any as resDetailType;
        {
          if (Array.isArray(resDataDetail)) {
            setInputNameError(resData.detail[0]["msg"]);
          } else if (typeof resDataDetail == "string") {
            setInputNameError(resData.detail);
          } else {
            setInputNameError("There was an error.");
          }
        }
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
