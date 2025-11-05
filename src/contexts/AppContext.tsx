import { createContext, useContext, useState, useEffect } from 'react';
import { ChatHistory } from '@/types/chat-history';

export type AppView = 'chat' | 'data-management';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  chatHistories: ChatHistory[];
  currentChatId: string | null;
  addChatHistory: () => string;
  deleteChatHistory: (id: string) => void;
  selectChatHistory: (id: string) => void;
  updateChatHistory: (id: string, updates: Partial<ChatHistory>) => void;
  getCurrentChatHistory: () => ChatHistory | null;
}

const AppContext = createContext({} as AppContextType);

export const AppProvider = (props: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chat histories from localStorage
  useEffect(() => {
    const savedHistories = localStorage.getItem('chatHistories');
    if (savedHistories) {
      try {
        const parsed = JSON.parse(savedHistories);
        // Convert date strings back to Date objects
        const histories = parsed.map((h: ChatHistory) => ({
          ...h,
          createdAt: new Date(h.createdAt),
          updatedAt: new Date(h.updatedAt),
          messages: h.messages.map(m => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setChatHistories(histories);
      } catch (error) {
        console.error('Failed to load chat histories:', error);
      }
    }
  }, []);

  // Save chat histories to localStorage
  useEffect(() => {
    if (chatHistories.length > 0) {
      localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    }
  }, [chatHistories]);

  const addChatHistory = (): string => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChatHistories(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const deleteChatHistory = (id: string) => {
    setChatHistories(prev => prev.filter(chat => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
  };

  const selectChatHistory = (id: string) => {
    setCurrentChatId(id);
    setCurrentView('chat');
  };

  const updateChatHistory = (id: string, updates: Partial<ChatHistory>) => {
    setChatHistories(prev => 
      prev.map(chat => 
        chat.id === id 
          ? { ...chat, ...updates, updatedAt: new Date() } 
          : chat
      )
    );
  };

  const getCurrentChatHistory = (): ChatHistory | null => {
    if (!currentChatId) return null;
    return chatHistories.find(chat => chat.id === currentChatId) || null;
  };

  return (
    <AppContext.Provider 
      value={{ 
        currentView, 
        setCurrentView,
        chatHistories,
        currentChatId,
        addChatHistory,
        deleteChatHistory,
        selectChatHistory,
        updateChatHistory,
        getCurrentChatHistory,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
