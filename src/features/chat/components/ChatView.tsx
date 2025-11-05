import { Box, Flex } from '@chakra-ui/react';
import { ChatProvider, useChatContext } from '../context/ChatContext';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { TopSection } from './sections/TopSection';
import { MiddleSection } from './sections/MiddleSection';
import { BottomSection } from './sections/BottomSection';

function ChatViewContent() {
  const { messages } = useChatContext();
  const hasMessages = messages.length > 0;

  if (!hasMessages) {
    // Initial state: input centered
    return (
      <Box flex='1'>
        <Flex direction='column' h='full'>
          <TopSection />
          <MiddleSection />
          <BottomSection />
        </Flex>
      </Box>
    );
  }

  // After first message: show messages and input at bottom
  return (
    <Box flex='1'>
      <Flex direction='column' h='100vh'>
        <TopSection />
        <Box flex='1' overflowY='auto'>
          <ChatMessages />
        </Box>
        <ChatInput />
        <BottomSection />
      </Flex>
    </Box>
  );
}

export function ChatView() {
  return (
    <ChatProvider>
      <ChatViewContent />
    </ChatProvider>
  );
}
