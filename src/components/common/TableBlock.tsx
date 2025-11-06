import { Box, Table } from '@chakra-ui/react';
import React from 'react';
import { CitationBadge } from './CitationBadge';
import type { Source } from '@/services/demo-response-service';

export interface TableHeader {
  key: string;
  title: string;
}

export interface TableRow {
  [key: string]: string;
}

export interface TableData {
  headers: TableHeader[];
  rows: TableRow[];
}

interface TableBlockProps {
  data: TableData;
  sources?: Source[];
  onCitationClick?: (citationId: number) => void;
}

export function TableBlock({ data, sources, onCitationClick }: TableBlockProps) {
  // Function to render cell content with citations
  const renderCellContent = (content: string) => {
    const citationRegex = /\[(\d+)\]/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(content)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
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
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  return (
    <Box my='4' overflowX='auto'>
      <Table.Root
        size='sm'
        variant='outline'
        css={{
          borderCollapse: 'collapse',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
        }}
      >
        <Table.Header>
          <Table.Row bg='rgba(255, 255, 255, 0.05)'>
            {data.headers.map((header) => (
              <Table.ColumnHeader
                key={header.key}
                px='4'
                py='3'
                fontWeight='semibold'
                borderBottom='1px solid rgba(255, 255, 255, 0.1)'
                textAlign='left'
              >
                {header.title}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.rows.map((row, rowIndex) => (
            <Table.Row
              key={rowIndex}
              css={{
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.02)',
                },
              }}
            >
              {data.headers.map((header) => (
                <Table.Cell
                  key={`${rowIndex}-${header.key}`}
                  px='4'
                  py='3'
                  borderBottom='1px solid rgba(255, 255, 255, 0.05)'
                >
                  {renderCellContent(row[header.key] || '')}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
