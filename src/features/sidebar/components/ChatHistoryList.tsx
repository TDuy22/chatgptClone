import { Stack, Text } from '@chakra-ui/react';
import { useAppContext } from '@/contexts/AppContext';
import { ChatHistoryItem } from './ChatHistoryItem';

export function ChatHistoryList() {
  const { chatHistories } = useAppContext();

  if (chatHistories.length === 0) {
    return null;
  }

  return (
    <Stack gap='1' mt='2'>
      <Text 
        fontSize='xs' 
        fontWeight='medium' 
        color='fg.subtle' 
        px='3'
        mb='1'
      >
        Gần đây
      </Text>
      <Stack gap='0.5'>
        {chatHistories.map((chatHistory) => (
          <ChatHistoryItem key={chatHistory.id} chatHistory={chatHistory} />
        ))}
      </Stack>
    </Stack>
  );
}
