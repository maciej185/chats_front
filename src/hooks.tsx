import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function useAuthenticate(token: string | null) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token]);
}
