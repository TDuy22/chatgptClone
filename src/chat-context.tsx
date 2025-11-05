import { createContext, useContext, useState } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  updateLastMessage: (content: string) => void;
  setMessageStreaming: (id: string, isStreaming: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext({} as ChatContextType);

export const ChatProvider = (props: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      isStreaming: role === 'assistant',
    };
    setMessages((prev: Message[]) => [...prev, newMessage]);
  };

  const updateLastMessage = (content: string) => {
    setMessages((prev: Message[]) => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        newMessages[newMessages.length - 1].content = content;
      }
      return newMessages;
    });
  };

  const setMessageStreaming = (id: string, isStreaming: boolean) => {
    setMessages((prev: Message[]) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isStreaming } : msg))
    );
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        addMessage, 
        updateLastMessage,
        setMessageStreaming,
        isLoading, 
        setIsLoading 
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
