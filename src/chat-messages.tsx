import { Box, Flex, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useChatContext } from './chat-context';
import { LuThumbsUp, LuThumbsDown, LuCopy, LuRefreshCw, LuShare } from 'react-icons/lu';
import { Tooltip } from './components/ui/tooltip';

export function ChatMessages() {
  const { messages } = useChatContext();

  return (
    <VStack gap='0' align='stretch' flex='1' overflowY='auto'>
      {messages.map((message) => (
        <Box 
          key={message.id} 
          py='8'
          px='4'
          bg={message.role === 'assistant' ? 'rgba(255, 255, 255, 0.02)' : 'transparent'}
          borderBottomWidth='1px'
          borderBottomColor='rgba(255, 255, 255, 0.05)'
        >
          <Flex 
            maxW='768px' 
            mx='auto'
            justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
          >
            {message.role === 'user' ? (
              // User message: right-aligned with gray box
              <Box
                maxW='80%'
                bg='rgba(255, 255, 255, 0.1)'
                px='4'
                py='3'
                borderRadius='2xl'
              >
                <Text fontSize='md' color='fg' whiteSpace='pre-wrap' lineHeight='1.7'>
                  {message.content}
                </Text>
              </Box>
            ) : (
              // Assistant message: left-aligned, full width
              <VStack align='start' flex='1' gap='3'>
                <Text fontSize='md' color='fg' whiteSpace='pre-wrap' lineHeight='1.7'>
                  {message.content}
                </Text>
                
                <HStack gap='1' mt='2'>
                  <Tooltip content='Copy'>
                    <IconButton
                      variant='ghost'
                      size='xs'
                      aria-label='Copy'
                    >
                      <LuCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content='Good response'>
                    <IconButton
                      variant='ghost'
                      size='xs'
                      aria-label='Like'
                    >
                      <LuThumbsUp />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content='Bad response'>
                    <IconButton
                      variant='ghost'
                      size='xs'
                      aria-label='Dislike'
                    >
                      <LuThumbsDown />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content='Regenerate'>
                    <IconButton
                      variant='ghost'
                      size='xs'
                      aria-label='Regenerate'
                    >
                      <LuRefreshCw />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content='Share'>
                    <IconButton
                      variant='ghost'
                      size='xs'
                      aria-label='Share'
                    >
                      <LuShare />
                    </IconButton>
                  </Tooltip>
                </HStack>
              </VStack>
            )}
          </Flex>
        </Box>
      ))}
    </VStack>
  );
}
