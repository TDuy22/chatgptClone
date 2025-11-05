import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { demoResponseService } from '@/services/demo-response-service';
import { useAppContext } from '@/contexts/AppContext';
import type { SourceItem } from '@/utils/citation';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string | { answer?: string; text?: string; sources?: SourceItem[] };
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string | { answer?: string; text?: string; sources?: SourceItem[] }, role: 'user' | 'assistant') => void;
  updateLastMessage: (content: string) => void;
  setMessageStreaming: (id: string, isStreaming: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
  selectedSource: SourceItem | null;
  setSelectedSource: (source: SourceItem | null) => void;
}

const ChatContext = createContext({} as ChatContextType);

export const ChatProvider = (props: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastLoadedChatId, setLastLoadedChatId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<SourceItem | null>(null);
  const creatingChatRef = useRef<string | null>(null); // Track chat being created
  const { currentChatId, getCurrentChatHistory, updateChatHistory, addChatHistory } = useAppContext();

  // Load demo responses khi component mount
  useEffect(() => {
    demoResponseService.loadResponses();
  }, []);

  // Load messages from current chat history when chat changes
  useEffect(() => {
    // Only load if the chat ID has changed
    if (currentChatId !== lastLoadedChatId) {
      const currentChat = getCurrentChatHistory();
      if (currentChat) {
        // Load messages and set isStreaming to false for all messages
        const loadedMessages = (currentChat.messages || []).map(msg => ({
          ...msg,
          isStreaming: false, // Never stream when loading from history
        }));
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }
      setLastLoadedChatId(currentChatId);
      // Clear the creating chat ref when currentChatId is set
      if (currentChatId && creatingChatRef.current === currentChatId) {
        creatingChatRef.current = null;
      }
    }
  }, [currentChatId, lastLoadedChatId, getCurrentChatHistory]);

  // Save messages to current chat history (but don't trigger on load)
  useEffect(() => {
    // Only save if we have messages and this is not a fresh load
    if (currentChatId && messages.length > 0 && currentChatId === lastLoadedChatId) {
      const currentChat = getCurrentChatHistory();
      
      // Prevent saving if messages are the same (to avoid infinite loop)
      const existingMessages = currentChat?.messages || [];
      const messagesChanged = 
        existingMessages.length !== messages.length ||
        messages.some((msg, idx) => 
          !existingMessages[idx] || 
          existingMessages[idx].id !== msg.id ||
          existingMessages[idx].content !== msg.content
        );
      
      if (messagesChanged) {
        // Update title from first user message if still "New Chat"
        let title = currentChat?.title || 'New Chat';
        if (title === 'New Chat') {
          const firstUserMessage = messages.find(m => m.role === 'user');
          if (firstUserMessage) {
            // Get content as string
            const contentText = typeof firstUserMessage.content === 'string' 
              ? firstUserMessage.content 
              : (firstUserMessage.content.text || firstUserMessage.content.answer || '');
            // Truncate title to max 40 characters
            title = contentText.length > 40 
              ? contentText.substring(0, 40) + '...'
              : contentText;
          }
        }

        updateChatHistory(currentChatId, {
          messages,
          title,
        });
      }
    }
  }, [messages, currentChatId, lastLoadedChatId, getCurrentChatHistory, updateChatHistory]);

  const addMessage = (content: string | { answer?: string; text?: string; sources?: SourceItem[] }, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      isStreaming: role === 'assistant',
    };
    
    // Create new chat if there's no current chat and not already creating one
    if (!currentChatId && !creatingChatRef.current) {
      const newChatId = addChatHistory();
      // Mark that we're creating this chat
      creatingChatRef.current = newChatId;
      // Update lastLoadedChatId immediately to prevent loading empty messages
      setLastLoadedChatId(newChatId);
    }
    
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

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        addMessage, 
        updateLastMessage,
        setMessageStreaming,
        isLoading, 
        setIsLoading,
        clearMessages,
        selectedSource,
        setSelectedSource,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
