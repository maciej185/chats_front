import {
  useState,
  useEffect,
  ChangeEventHandler,
  FormEventHandler,
} from "react";
import configData from "./config.json";
import { getErrorFromResponse, getBackendAddress } from "./utils";

import "./styles/ChatAddMembersSelect.css";

interface ChatAddMembersSelectProps {
  token: string;
  chat_id: number;
  selectedPotentialMember: string | undefined;
  setSelectedPotentialMember: CallableFunction;
  setAddBtnClassName: CallableFunction;
}

interface potentialChatMember {
  user_id: number;
  profile: {
    first_name: string;
    last_name: string;
  };
}

async function fetchPotentialMembers(
  chat_id: number,
  token: string,
  potentialMembersSetter: CallableFunction,
  potentialMembersError: string | null,
  potentialMembersErrorSetter: CallableFunction
) {
  const url = (
    "http://" +
    getBackendAddress() +
    configData.GET_POTENTIAL_CHAT_MEMBERS_ENDPOINT
  ).replace("chat_id", String(chat_id));
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await res.json();
  if (res.status == 200) {
    potentialMembersSetter(resData);
    if (potentialMembersError) potentialMembersErrorSetter(null);
    return;
  } else {
    const resData = await res.json();
    potentialMembersErrorSetter(getErrorFromResponse(resData));
  }
}

export default function ChatAddMembersSelect({
  token,
  chat_id,
  selectedPotentialMember,
  setSelectedPotentialMember,
  setAddBtnClassName,
}: ChatAddMembersSelectProps) {
  const [potentialMembers, setPotentialMembers] =
    useState<Array<potentialChatMember> | null>(null);
  const [potentialMembersError, setPotentialMembersError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!potentialMembers)
      (async function () {
        fetchPotentialMembers(
          chat_id,
          token,
          setPotentialMembers,
          potentialMembersError,
          setPotentialMembersError
        );
      })();
  }, []);

  const selectMemberChangeHandler: ChangeEventHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPotentialMember(e.target.value);
    setAddBtnClassName(e.target.value === undefined ? "inactive" : "active");
  };

  return (
    <div className="add-select">
      {potentialMembers ? (
        <select
          className="add-select-select"
          value={selectedPotentialMember}
          onChange={selectMemberChangeHandler}
        >
          <option
            className="add-select-select-option"
            value={undefined}
          ></option>
          {potentialMembers.map((potentialMember, ind) => (
            <option
              key={`add-select-select-option-${ind + 1}`}
              value={String(potentialMember.user_id)}
            >
              {potentialMember.profile.first_name}{" "}
              {potentialMember.profile.last_name}
            </option>
          ))}
        </select>
      ) : (
        <div></div>
      )}
    </div>
  );
}
