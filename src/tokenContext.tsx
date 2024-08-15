import { createContext } from "react";

export const TokenContext = createContext<string>("");
export const DispatchTokenContext = createContext<CallableFunction | null>(
  null
);
