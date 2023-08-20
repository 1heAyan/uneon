"use client"
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

type Message = {
  role: string;
  content: string;
};

type ConversationContextType = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  prompt: string | null;
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversationContext must be used within a ConversationProvider");
  }
  return context;
};

type ConversationProviderProps = {
  children: ReactNode;
  prompt: string | null; // Add prompt prop
};

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children, prompt }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const contextValue: ConversationContextType = {
    messages,
    setMessages,
    prompt,
  };

  return (
    <ConversationContext.Provider value={contextValue}>
      {children}
    </ConversationContext.Provider>
  );
};
