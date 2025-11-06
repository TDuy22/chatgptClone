import { Box, Text } from '@chakra-ui/react';
import { useStreamingText } from '@/hooks/useStreamingText';
import { useEffect, useRef } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CitationBadge } from './CitationBadge';

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
      <ReactMarkdown components={components}>{displayedText || (isStreaming ? '' : content)}</ReactMarkdown>
      {isStreaming && (
        <Text as='span' animation='blink 1s infinite' ml='1'>
          ▊
        </Text>
      )}
    </Box>
  );
}
