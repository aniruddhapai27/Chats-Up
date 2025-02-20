import { createContext, useContext, useState } from "react";

export const ConversationContext = createContext();

export const useConversation = () => {
  return useContext(ConversationContext);
};
export function ConversationProvider({ children }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState("");
  return (
    <ConversationContext.Provider
      value={{
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export default ConversationContext;
