import {
  Box,
  Center,
} from '@chakra-ui/react';
import { SharedChatInput } from './SharedChatInput';

export function ChatInput() {
  return (
    <Box pb='6' pt='4' px='4' bg='transparent'>
      <Center>
        <SharedChatInput />
      </Center>
    </Box>
  );
}
