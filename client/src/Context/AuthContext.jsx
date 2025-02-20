import { createContext, useContext, useState } from "react";

export const Authcontext = createContext();

export const useAuth = () => {
  return useContext(Authcontext);
};

export function AuthContextProvider({ children }) {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chatapp") || null)
  );

  return (
    <Authcontext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </Authcontext.Provider>
  );
}
