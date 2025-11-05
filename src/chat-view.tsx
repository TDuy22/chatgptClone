import { Box, Flex } from '@chakra-ui/react';
import { BottomSection } from './bottom-section';
import { MiddleSection } from './middle-section';
import { TopSection } from './top-section';
import { ChatProvider, useChatContext } from './chat-context';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

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