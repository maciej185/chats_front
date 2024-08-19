import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../tokenContext";
import AdminDashboard from "./AdminDashboard";
import Login from "../Login";
import configData from "../config.json";
import { getBackendAddress } from "../utils";

interface AdminProps {
  setUsername: CallableFunction;
  tokenDispatch: CallableFunction;
}

export default function Admin({ tokenDispatch, setUsername }: AdminProps) {
  const token = useContext(TokenContext);
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);

  useEffect(() => {
    if (token) {
      (async function () {
        const url =
          "http://" + getBackendAddress() + configData.IS_ADMIN_ENDPOINT;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = await res.json();
        setIsAdmin(resData);
      })();
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  return isAdmin ? (
    <AdminDashboard />
  ) : (
    <Login tokenDispatch={tokenDispatch} setUsername={setUsername} />
  );
}
