import React, { createContext, useContext, useMemo, useState } from "react";

type UIState = {
  unreadMessages: number;
  notifications: number;
  savedCount: number;
  setUnreadMessages: (n: number) => void;
  setNotifications: (n: number) => void;
  setSavedCount: (n: number) => void;
};

const Ctx = createContext<UIState | null>(null);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const value = useMemo(
    () => ({ unreadMessages, notifications, savedCount, setUnreadMessages, setNotifications, setSavedCount }),
    [unreadMessages, notifications, savedCount]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useUI = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI must be used within UIProvider");
  return v;
};
