import { Box, Flex, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useChatContext } from '../context/ChatContext';
import { LuThumbsUp, LuThumbsDown, LuCopy, LuRefreshCw, LuShare } from 'react-icons/lu';
import { Tooltip } from '@/components/ui/tooltip';
import { StreamingText } from '@/components/common/StreamingText';
import { useEffect, useRef } from 'react';

export function ChatMessages() {
  const { messages, setMessageStreaming } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto scroll during streaming
  useEffect(() => {
    const hasStreamingMessage = messages.some(msg => msg.isStreaming);
    if (hasStreamingMessage) {
      const interval = setInterval(() => {
        scrollToBottom();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [messages]);

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
                {message.isStreaming ? (
                  <StreamingText 
                    content={message.content}
                    onStreamComplete={() => setMessageStreaming(message.id, false)}
                  />
                ) : (
                  <Text fontSize='md' color='fg' whiteSpace='pre-wrap' lineHeight='1.7'>
                    {message.content}
                  </Text>
                )}
                
                {!message.isStreaming && (
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
                  </HStack>
                )}
              </VStack>
            )}
          </Flex>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </VStack>
  );
}
