import { Text } from '@chakra-ui/react';
import { useStreamingText } from '../hooks/useStreamingText';
import { useEffect, useRef } from 'react';

interface StreamingTextProps {
  content: string;
  onStreamComplete?: () => void;
}

export function StreamingText({ content, onStreamComplete }: StreamingTextProps) {
  const { displayedText, isStreaming } = useStreamingText(content, 10);
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
    <Text fontSize='md' color='fg' whiteSpace='pre-wrap' lineHeight='1.7'>
      {displayedText || (isStreaming ? '' : content)}
      {isStreaming && (
        <Text as='span' animation='blink 1s infinite' ml='1'>
          ▊
        </Text>
      )}
    </Text>
  );
}
