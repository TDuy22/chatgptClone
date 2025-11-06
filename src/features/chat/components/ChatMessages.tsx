import { Box, Flex, HStack, IconButton, VStack } from '@chakra-ui/react';
import { useChatContext } from '../context/ChatContext';
import { LuThumbsUp, LuThumbsDown, LuCopy } from 'react-icons/lu';
import { Tooltip } from '@/components/ui/tooltip';
import { StreamingText } from '@/components/common/StreamingText';
import { CitationBadge } from '@/components/common/CitationBadge';
import { useEffect, useRef } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';

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

  const handleCitationClick = (citationId: number) => {
    console.log('Citation clicked:', citationId);
    // TODO: Scroll to reference or show citation details
  };

  // Custom component to render text with citations
  const TextWithCitations = ({ children }: { children: string }) => {
    const citationRegex = /\[(\d+)\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(children)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push(children.substring(lastIndex, match.index));
      }
      // Add citation badge
      parts.push(
        <CitationBadge
          key={`citation-${match[1]}-${match.index}`}
          citationId={parseInt(match[1])}
          onClick={handleCitationClick}
        />
      );
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < children.length) {
      parts.push(children.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  // Custom renderers for ReactMarkdown
  const components = {
    // Handle inline text
    p: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <TextWithCitations>{child}</TextWithCitations>;
        }
        return child;
      });
      return <p {...props}>{processedChildren}</p>;
    },
    // Handle text in list items
    li: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <TextWithCitations>{child}</TextWithCitations>;
        }
        return child;
      });
      return <li {...props}>{processedChildren}</li>;
    },
    // Handle strong/bold text
    strong: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <TextWithCitations>{child}</TextWithCitations>;
        }
        return child;
      });
      return <strong {...props}>{processedChildren}</strong>;
    },
    // Handle em/italic text
    em: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <TextWithCitations>{child}</TextWithCitations>;
        }
        return child;
      });
      return <em {...props}>{processedChildren}</em>;
    },
  };

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
                css={{
                  '& p': { marginBottom: '0.5rem' },
                  '& strong': { fontWeight: 'bold' },
                  '& em': { fontStyle: 'italic' },
                  '& code': { 
                    background: 'rgba(255, 255, 255, 0.15)', 
                    padding: '0.125rem 0.25rem', 
                    borderRadius: '0.125rem', 
                    fontSize: '0.875rem' 
                  },
                  '& ul, & ol': { marginLeft: '1.5rem', marginBottom: '0.5rem' },
                  '& li': { marginBottom: '0.25rem' },
                }}
              >
                <Box fontSize='md' color='fg' lineHeight='1.7'>
                  <ReactMarkdown components={components}>{message.content}</ReactMarkdown>
                </Box>
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
                  <Box 
                    fontSize='md' 
                    color='fg' 
                    lineHeight='1.7'
                    css={{
                      '& p': { marginBottom: '1rem' },
                      '& strong': { fontWeight: 'bold' },
                      '& em': { fontStyle: 'italic' },
                      '& code': { 
                        background: 'rgba(255, 255, 255, 0.1)', 
                        padding: '0.125rem 0.25rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.875rem' 
                      },
                      '& pre': { 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '1rem', 
                        borderRadius: '0.5rem', 
                        overflowX: 'auto',
                        marginBottom: '1rem'
                      },
                      '& pre code': {
                        background: 'transparent',
                        padding: '0'
                      },
                      '& ul, & ol': { marginLeft: '1.5rem', marginBottom: '1rem' },
                      '& li': { marginBottom: '0.5rem' },
                      '& h1, & h2, & h3, & h4, & h5, & h6': { 
                        fontWeight: 'bold', 
                        marginTop: '1rem', 
                        marginBottom: '0.5rem' 
                      },
                      '& blockquote': {
                        borderLeft: '4px solid rgba(255, 255, 255, 0.2)',
                        paddingLeft: '1rem',
                        marginLeft: '0',
                        marginBottom: '1rem',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }}
                  >
                    <ReactMarkdown components={components}>{message.content}</ReactMarkdown>
                  </Box>
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
