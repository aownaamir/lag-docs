"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
};

type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");

    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useCurrentUser must be used inside UserProvider");
  }

  return context;
}
