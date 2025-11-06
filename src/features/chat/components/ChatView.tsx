import { Box, Flex } from '@chakra-ui/react';
import { ChatProvider, useChatContext } from '../context/ChatContext';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { TopSection } from './sections/TopSection';
import { MiddleSection } from './sections/MiddleSection';
import { BottomSection } from './sections/BottomSection';
import { PDFViewer } from './PDFViewer';

function ChatViewContent() {
  const { messages, selectedSource, setSelectedSource } = useChatContext();
  const hasMessages = messages.length > 0;

  if (!hasMessages) {
    // Initial state: input centered
    return (
      <Flex h='100vh' overflow='hidden' w='full'>
        <Box flex='1' transition='all 0.3s ease-in-out'>
          <Flex direction='column' h='full'>
            <TopSection />
            <MiddleSection />
            <BottomSection />
          </Flex>
        </Box>
        {selectedSource && (
          <PDFViewer source={selectedSource} onClose={() => setSelectedSource(null)} />
        )}
      </Flex>
    );
  }

  // After first message: show messages and input at bottom
  return (
    <Flex h='100vh' overflow='hidden' w='full'>
      <Box flex='1' minW='0' transition='all 0.3s ease-in-out'>
        <Flex direction='column' h='full'>
          <TopSection />
          <Box flex='1' overflowY='auto'>
            <ChatMessages />
          </Box>
          <ChatInput />
          <BottomSection />
        </Flex>
      </Box>
      {selectedSource && (
        <PDFViewer source={selectedSource} onClose={() => setSelectedSource(null)} />
      )}
    </Flex>
  );
}

export function ChatView() {
  return (
    <ChatProvider>
      <ChatViewContent />
    </ChatProvider>
  );
}
