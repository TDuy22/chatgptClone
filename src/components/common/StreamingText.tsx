import { Text, VStack } from '@chakra-ui/react';
import { useStreamingText } from '@/hooks/useStreamingText';
import { useEffect, useRef } from 'react';
import { useChatContext } from '@/features/chat/context/ChatContext';
import { ContentBlock } from './ContentBlock';
import type { ContentBlock as ContentBlockType, Source } from '@/services/demo-response-service';

interface StreamingTextProps {
  blocks: ContentBlockType[];
  sources?: Source[];
  onStreamComplete?: () => void;
  messageId?: string;
}

export function StreamingText({ blocks, sources, onStreamComplete, messageId }: StreamingTextProps) {
  const { displayedBlocks, currentBlockIndex, isStreaming } = useStreamingText(blocks, 20);
  const hasCalledCompleteRef = useRef(false);
  const { setSelectedSource, messages } = useChatContext();

  console.log('StreamingText render:', { 
    blocksCount: blocks.length,
    displayedBlocksCount: displayedBlocks.length, 
    currentBlockIndex,
    isStreaming 
  });

  useEffect(() => {
    if (!isStreaming && !hasCalledCompleteRef.current && displayedBlocks.length > 0) {
      hasCalledCompleteRef.current = true;
      onStreamComplete?.();
    }
  }, [isStreaming, displayedBlocks, onStreamComplete]);

  const handleCitationClick = (citationId: number) => {
    console.log('🔍 Citation clicked in streaming:', citationId, 'messageId:', messageId);
    console.log('📋 All messages:', messages);
    
    // Find the source from messages
    for (const message of messages) {
      console.log('🔎 Checking message:', message.id, 'role:', message.role, 'has sources:', !!message.sources);
      if (message.role === 'assistant' && message.sources && (!messageId || message.id === messageId)) {
        console.log('📚 Message sources:', message.sources);
        const source = message.sources.find(s => s.id === citationId.toString());
        if (source) {
          console.log('✅ Found source:', source);
          setSelectedSource(source);
          return;
        }
      }
    }
    
    console.warn('❌ Source not found for citation:', citationId);
  };

  return (
    <VStack 
      align='stretch'
      gap='0'
      fontSize='md' 
      color='fg' 
      lineHeight='1.7'
    >
      {displayedBlocks.map((block, index) => (
        <ContentBlock 
          key={`block-${messageId}-${index}`} 
          block={block}
          sources={sources}
          onCitationClick={handleCitationClick}
        />
      ))}
      {isStreaming && (
        <Text as='span' animation='blink 1s infinite'>
          ▊
        </Text>
      )}
    </VStack>
  );
}
