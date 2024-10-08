import "./styles/ChatAddMember.css";
import { useLocation } from "react-router-dom";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  chatInfoInterface,
  fetchChatData,
  checkIfcurrentUserIsChatMember,
} from "./Chat";
import { useParams } from "react-router-dom";
import ChatAddMembersSelect from "./ChatAddMembersSelect";
import configData from "./config.json";
import { getErrorFromResponse, getBackendAddress } from "./utils";
import { useAuthenticate } from "./hooks";
import { TokenContext } from "./tokenContext";

interface ChatAddMemberProps {
  username: string;
}

export default function ChatAddMember({ username }: ChatAddMemberProps) {
  const [chatInfo, setChatInfo] = useState<chatInfoInterface | null>(null);
  const [chatInfoError, setChatInfoError] = useState<string | null>(null);
  const [currentUserIsChatMember, setCurrentUserIsChatMember] =
    useState<boolean>(true);
  const [selectedPotentialMember, setSelectedPotentialMember] = useState<
    string | undefined
  >(undefined);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);
  const [addBtnClassName, setAddBtnClassName] = useState<string>("inactive");
  const { chat_id } = useParams<string>();
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  useAuthenticate(token);
  let { state } = useLocation();

  useEffect(() => {
    if (!chatInfo) {
      (async function () {
        await fetchChatData(
          Number(chat_id),
          token,
          setChatInfo,
          chatInfoError,
          setChatInfoError
        );
      })();
    }
    if (chatInfo)
      setCurrentUserIsChatMember(
        checkIfcurrentUserIsChatMember(username, chatInfo.members)
      );
  }, []);

  const addUserBtnClickHandler: MouseEventHandler = (e) => {
    if (selectedPotentialMember === undefined) {
      setAddMemberError("Please select a user.");
      return;
    }

    (async function () {
      const url =
        "http://" + getBackendAddress() + configData.ADD_CHAT_MEMBER_ENDPOINT;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: selectedPotentialMember,
            chat_id: chat_id,
          }),
        });
        if (res.status == 201) {
          navigate(`/chat/${chat_id}`);
          return;
        } else {
          const resData = await res.json();
          setAddMemberError(getErrorFromResponse(resData));
        }
      } catch (e) {
        setAddMemberError("Network issue, please try again later.");
      }
    })();
  };

  return currentUserIsChatMember ? (
    <div className="add">
      <div className="add-chat_name">
        Add members for chat: {state ? state.chat_name : ""}
      </div>
      <ChatAddMembersSelect
        token={token}
        chat_id={Number(chat_id)}
        selectedPotentialMember={selectedPotentialMember}
        setSelectedPotentialMember={setSelectedPotentialMember}
        setAddBtnClassName={setAddBtnClassName}
      />
      {addMemberError ? (
        <div className="add-error">{addMemberError}</div>
      ) : (
        <></>
      )}
      <div
        className={`add-btn ${addBtnClassName}`}
        onClick={addUserBtnClickHandler}
      >
        Add member
      </div>
    </div>
  ) : (
    <div className="add error">You are not a member of this chat!</div>
  );
}
