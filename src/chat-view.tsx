import { Box, Stack } from '@chakra-ui/react';
import { BottomSection } from './bottom-section';
import { MiddleSection } from './middle-section';
import { TopSection } from './top-section';

export function ChatView() {
  return (
    <Box flex='1'>
      <Stack h='full'>
        <TopSection />
        <MiddleSection />
        <BottomSection />
      </Stack>
    </Box>
  );
}