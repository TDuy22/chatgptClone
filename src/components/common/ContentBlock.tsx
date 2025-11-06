import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box } from '@chakra-ui/react';
import { TableBlock, TableData } from './TableBlock';
import { CitationBadge } from './CitationBadge';
import type { Source } from '@/services/demo-response-service';

export interface MarkdownBlock {
  type: 'markdown';
  body: string;
}

export interface TableBlockType {
  type: 'table';
  data: TableData;
}

export type ContentBlockType = MarkdownBlock | TableBlockType;

interface ContentBlockProps {
  block: ContentBlockType;
  sources?: Source[];
  onCitationClick?: (citationId: number) => void;
}

export function ContentBlock({ block, sources, onCitationClick }: ContentBlockProps) {
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
  };

  switch (block.type) {
    case 'markdown':
      return (
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
            '& ul, & ol': { marginLeft: '1.5rem', marginBottom: '1rem' },
            '& li': { marginBottom: '0.5rem' },
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
          }}
        >
          <ReactMarkdown components={components}>{block.body}</ReactMarkdown>
        </Box>
      );

    case 'table':
      return <TableBlock data={block.data} sources={sources} onCitationClick={onCitationClick} />;

    default:
      return null;
  }
}
