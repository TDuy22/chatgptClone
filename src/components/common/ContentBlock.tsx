import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { TableBlock, TableData } from './TableBlock';
import { CitationBadge } from './CitationBadge';
import type { Source } from '@/services/demo-response-service';
import { LuFileText } from 'react-icons/lu';

export interface MarkdownBlock {
  type: 'markdown';
  body: string;
  // Optional: sources specific to this block
  blockSources?: Source[];
}

export interface TableBlockType {
  type: 'table';
  data: TableData;
  blockSources?: Source[];
}

export type ContentBlockType = MarkdownBlock | TableBlockType;

interface ContentBlockProps {
  block: ContentBlockType;
  sources?: Source[];
  onCitationClick?: (citationId: number) => void;
  showSourcesBelow?: boolean; // Show aggregated sources below the last block
}

export function ContentBlock({ block, sources, onCitationClick, showSourcesBelow = true }: ContentBlockProps) {
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
      
      // Find snippet for this citation
      const citationId = match[1];
      const source = sources?.find(s => s.id === citationId);
      const snippet = source?.snippet;
      
      // Add citation badge with snippet
      parts.push(
        <CitationBadge
          key={`citation-${match[1]}-${match.index}`}
          citationId={parseInt(match[1])}
          snippet={snippet}
          onClick={onCitationClick}
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
    // Handle table cells
    td: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <TextWithCitations>{child}</TextWithCitations>;
        }
        return child;
      });
      return <td {...props}>{processedChildren}</td>;
    },
    th: ({ children, ...props }: any) => {
      const processedChildren = React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <TextWithCitations>{child}</TextWithCitations>;
        }
        return child;
      });
      return <th {...props}>{processedChildren}</th>;
    },
  };

  // Render block-specific sources (from blockSources)
  const renderBlockSources = () => {
    const blockSources = (block as MarkdownBlock).blockSources;
    if (!blockSources || blockSources.length === 0) return null;
    
    return (
      <HStack 
        gap='2' 
        mt='2' 
        flexWrap='wrap'
      >
        <Text fontSize='xs' color='gray.500' mr='1'>
          📄 Trích dẫn:
        </Text>
        {blockSources.map((source) => (
          <HStack
            key={`block-source-${source.id}`}
            as='button'
            gap='1'
            px='2'
            py='0.5'
            bg='rgba(16, 185, 129, 0.1)'
            borderRadius='md'
            border='1px solid'
            borderColor='rgba(16, 185, 129, 0.3)'
            cursor='pointer'
            _hover={{
              bg: 'rgba(16, 185, 129, 0.2)',
              borderColor: 'rgba(16, 185, 129, 0.5)',
            }}
            transition='all 0.2s'
            onClick={() => onCitationClick?.(parseInt(source.id))}
          >
            <LuFileText size={11} color='#10b981' />
            <Text fontSize='xs' color='green.400' maxW='250px' truncate>
              {source.fileName}
            </Text>
          </HStack>
        ))}
      </HStack>
    );
  };

  // Render aggregated sources (at the end of all blocks)
  const renderAggregatedSources = () => {
    if (!showSourcesBelow || !sources || sources.length === 0) return null;
    
    return (
      <HStack 
        gap='2' 
        mt='4' 
        flexWrap='wrap'
        pt='3'
        borderTopWidth='1px'
        borderTopColor='rgba(255, 255, 255, 0.1)'
      >
        <Text fontSize='xs' color='gray.400' mr='1'>
          📚 Tổng hợp nguồn tham khảo:
        </Text>
        {sources.map((source) => (
          <HStack
            key={`agg-source-${source.id}`}
            as='button'
            gap='1'
            px='2'
            py='1'
            bg='rgba(59, 130, 246, 0.1)'
            borderRadius='md'
            border='1px solid'
            borderColor='rgba(59, 130, 246, 0.3)'
            cursor='pointer'
            _hover={{
              bg: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 0.5)',
            }}
            transition='all 0.2s'
            onClick={() => onCitationClick?.(parseInt(source.id))}
          >
            <LuFileText size={12} color='#60a5fa' />
            <Text fontSize='xs' color='blue.300' maxW='200px' truncate>
              {source.fileName}
            </Text>
          </HStack>
        ))}
      </HStack>
    );
  };

  switch (block.type) {
    case 'markdown':
      return (
        <VStack align='stretch' gap='0'>
          <Box
            className='markdown-block'
            css={{
              '& p': { marginBottom: '1rem' },
              '& p:last-child': { marginBottom: '0' },
              '& strong': { fontWeight: 'bold' },
              '& em': { fontStyle: 'italic' },
              '& code': {
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.125rem 0.25rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
              },
              '& pre': {
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '0.5rem',
                overflowX: 'auto',
                marginBottom: '1rem',
              },
              '& pre code': {
                background: 'transparent',
                padding: '0',
              },
              '& ul': { 
                listStyleType: 'disc', 
                paddingLeft: '1.5rem', 
                marginLeft: '0.5rem',
                marginBottom: '1rem' 
              },
              '& ul ul': { 
                listStyleType: 'circle',
                marginTop: '0.25rem'
              },
              '& ol': { 
                listStyleType: 'decimal', 
                paddingLeft: '1.5rem', 
                marginLeft: '0.5rem',
                marginBottom: '1rem' 
              },
              '& li': { marginBottom: '0.25rem' },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 'bold',
                marginTop: '1rem',
                marginBottom: '0.5rem',
              },
              '& blockquote': {
                borderLeft: '4px solid rgba(255, 255, 255, 0.2)',
                paddingLeft: '1rem',
                marginLeft: '0',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
              },
              // Table styles (GFM)
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              },
              '& th, & td': {
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
              },
              '& th': {
                background: 'rgba(255, 255, 255, 0.1)',
                fontWeight: 'bold',
              },
              '& tr:nth-of-type(even)': {
                background: 'rgba(255, 255, 255, 0.03)',
              },
              '& tr:hover': {
                background: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {block.body}
            </ReactMarkdown>
          </Box>
          {renderBlockSources()}
          {renderAggregatedSources()}
        </VStack>
      );

    case 'table':
      return (
        <VStack align='stretch' gap='0'>
          <TableBlock data={block.data} sources={sources} onCitationClick={onCitationClick} />
          {renderBlockSources()}
          {renderAggregatedSources()}
        </VStack>
      );

    default:
      return null;
  }
}
