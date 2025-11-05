import { Box, Text } from '@chakra-ui/react';
import { useStreamingText } from '@/hooks/useStreamingText';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingTextProps {
  content: string;
  onStreamComplete?: () => void;
}

export function StreamingText({ content, onStreamComplete }: StreamingTextProps) {
  const { displayedText, isStreaming } = useStreamingText(content, 20);
  const hasCalledCompleteRef = useRef(false);

  console.log('StreamingText render:', { 
    contentLength: content.length, 
    displayedLength: displayedText.length, 
    isStreaming 
  });

  useEffect(() => {
    if (!isStreaming && !hasCalledCompleteRef.current && displayedText) {
      hasCalledCompleteRef.current = true;
      onStreamComplete?.();
    }
  }, [isStreaming, displayedText, onStreamComplete]);

  return (
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
      <ReactMarkdown>{displayedText || (isStreaming ? '' : content)}</ReactMarkdown>
      {isStreaming && (
        <Text as='span' animation='blink 1s infinite' ml='1'>
          ▊
        </Text>
      )}
    </Box>
  );
}
