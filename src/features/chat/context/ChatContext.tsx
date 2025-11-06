import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { demoResponseService, Source } from '@/services/demo-response-service';
import { useAppContext } from '@/contexts/AppContext';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  sources?: Source[]; // Add sources to message
}

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant', sources?: Source[]) => void;
  updateLastMessage: (content: string) => void;
  setMessageStreaming: (id: string, isStreaming: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
  selectedSource: Source | null;
  setSelectedSource: (source: Source | null) => void;
  getSourceById: (messageId: string, citationId: string) => Source | null;
}

const ChatContext = createContext({} as ChatContextType);

export const ChatProvider = (props: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [lastLoadedChatId, setLastLoadedChatId] = useState<string | null>(null);
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
        console.log('📖 Loading messages from chat history');
        console.log('📖 Current chat:', currentChat);
        console.log('📖 Messages:', currentChat.messages);
        console.log('📖 Sources in messages:', currentChat.messages?.map(m => ({ id: m.id, sourcesCount: m.sources?.length })));
        
        // Load messages and set isStreaming to false for all messages
        const loadedMessages = (currentChat.messages || []).map(msg => ({
          ...msg,
          isStreaming: false, // Never stream when loading from history
        }));
        
        console.log('📖 Loaded messages:', loadedMessages);
        console.log('📖 Sources after mapping:', loadedMessages.map(m => ({ id: m.id, sourcesCount: m.sources?.length })));
        
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
        console.log('💾 Saving messages to chat history');
        console.log('💾 Messages to save:', messages);
        console.log('💾 Sources in messages:', messages.map(m => ({ id: m.id, sourcesCount: m.sources?.length })));
        
        // Update title from first user message if still "New Chat"
        let title = currentChat?.title || 'New Chat';
        if (title === 'New Chat') {
          const firstUserMessage = messages.find(m => m.role === 'user');
          if (firstUserMessage) {
            // Truncate title to max 40 characters
            title = firstUserMessage.content.length > 40 
              ? firstUserMessage.content.substring(0, 40) + '...'
              : firstUserMessage.content;
          }
        }

        updateChatHistory(currentChatId, {
          messages,
          title,
        });
      }
    }
  }, [messages, currentChatId, lastLoadedChatId, getCurrentChatHistory, updateChatHistory]);

  const addMessage = (content: string, role: 'user' | 'assistant', sources?: Source[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      isStreaming: role === 'assistant',
      sources: sources || [],
    };
    
    console.log('➕ addMessage called with sources:', sources);
    console.log('➕ sources length:', sources?.length);
    console.log('➕ New message object:', newMessage);
    console.log('➕ New message sources:', newMessage.sources);
    
    // Create new chat if there's no current chat and not already creating one
    if (!currentChatId && !creatingChatRef.current) {
      const newChatId = addChatHistory();
      // Mark that we're creating this chat
      creatingChatRef.current = newChatId;
      // Update lastLoadedChatId immediately to prevent loading empty messages
      setLastLoadedChatId(newChatId);
    }
    
    setMessages((prev: Message[]) => {
      const updated = [...prev, newMessage];
      console.log('➕ Updated messages array:', updated);
      console.log('➕ Last message sources:', updated[updated.length - 1]?.sources);
      return updated;
    });
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

  const getSourceById = (messageId: string, citationId: string): Source | null => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || !message.sources) {
      return null;
    }
    return message.sources.find(source => source.id === citationId) || null;
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
        getSourceById,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
