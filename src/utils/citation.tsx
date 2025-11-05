import React from 'react';
import { Box } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';

export type SourceItem = {
  id: string;
  fileName: string;
  pageNumber?: number;
  fileUrl?: string;
  snippet?: string;
};

// Component để render text với citations đã được parse
export function TextWithCitations({ 
  text, 
  sources, 
  onClick 
}: { 
  text: string; 
  sources: SourceItem[]; 
  onClick: (source: SourceItem) => void;
}) {
  console.log('🔍 Parsing text for citations:', text.substring(0, 100));
  console.log('📚 Available sources:', sources);
  
  const regex = /\[(\d+)\]/g;
  const parts: Array<string | { id: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    parts.push({ id: match[1] });
    lastIndex = regex.lastIndex;
    console.log('✅ Found citation:', match[1]);
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  console.log('📝 Total parts:', parts.length);

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === 'string') {
          // Render markdown cho text thông thường - dùng span để không xuống dòng
          return (
            <Box 
              key={i} 
              as='span' 
              display='inline'
              css={{
                '& p': { display: 'inline', margin: 0 },
                '& strong': { fontWeight: 'bold' },
                '& em': { fontStyle: 'italic' },
                '& code': { 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  padding: '0.125rem 0.25rem', 
                  borderRadius: '0.25rem', 
                  fontSize: '0.875rem' 
                },
              }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <span>{children}</span>,
                  br: () => <br />,
                }}
              >
                {part}
              </ReactMarkdown>
            </Box>
          );
        }
        
        const source = sources.find(s => s.id === part.id);
        const label = `[${part.id}]`;
        
        console.log('🎯 Rendering citation button:', label, 'hasSource:', !!source);
        
        return (
          <Tooltip 
            key={i} 
            content={source?.snippet ?? 'Nguồn không tìm thấy'}
            positioning={{ placement: 'top' }}
          >
            <Box
              as='button'
              ml='1'
              mr='1'
              px='2'
              py='1'
              borderRadius='md'
              bg={source ? 'rgba(59, 130, 246, 0.2)' : 'rgba(107, 114, 128, 0.2)'}
              color={source ? '#93c5fd' : '#9ca3af'}
              cursor={source ? 'pointer' : 'not-allowed'}
              fontWeight='semibold'
              fontSize='xs'
              display='inline-flex'
              alignItems='center'
              border='1px solid'
              borderColor={source ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}
              transition='all 0.2s'
              _hover={source ? { 
                bg: 'rgba(59, 130, 246, 0.35)', 
                transform: 'translateY(-1px)',
                borderColor: 'rgba(59, 130, 246, 0.5)',
              } : {}}
              _active={source ? {
                transform: 'translateY(0)',
                bg: 'rgba(59, 130, 246, 0.4)',
              } : {}}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('�️ Citation clicked!', label, source);
                if (source) {
                  onClick(source);
                }
              }}
            >
              {label}
            </Box>
          </Tooltip>
        );
      })}
    </>
  );
}

// Deprecated - giữ lại để backwards compatibility
export function renderTextWithCitations(
  text: string, 
  sources: SourceItem[], 
  onClick: (source: SourceItem) => void
) {
  if (!text) return text;
  
  console.log('🔍 Parsing text for citations:', text.substring(0, 100));
  console.log('📚 Available sources:', sources);
  
  const regex = /\[(\d+)\]/g;
  const parts: Array<string | { id: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }
    parts.push({ id: match[1] });
    lastIndex = regex.lastIndex;
    console.log('✅ Found citation:', match[1]);
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  console.log('📝 Total parts:', parts.length);

  return parts.map((part, i) => {
    if (typeof part === 'string') {
      return <React.Fragment key={i}>{part}</React.Fragment>;
    }
    
    const source = sources.find(s => s.id === part.id);
    const label = `[${part.id}]`;
    
    return (
      <Tooltip 
        key={i} 
        content={source?.snippet ?? 'Nguồn không tìm thấy'}
        positioning={{ placement: 'top' }}
      >
        <Box
          as='span'
          ml='0.5'
          mr='0.5'
          px='1.5'
          py='0.5'
          borderRadius='md'
          bg={source ? 'rgba(59, 130, 246, 0.2)' : 'rgba(107, 114, 128, 0.2)'}
          color={source ? '#93c5fd' : '#9ca3af'}
          cursor={source ? 'pointer' : 'not-allowed'}
          fontWeight='semibold'
          fontSize='sm'
          transition='all 0.2s'
          _hover={source ? { 
            bg: 'rgba(59, 130, 246, 0.3)', 
            transform: 'translateY(-1px)',
            shadow: 'sm'
          } : {}}
          onClick={(e) => {
            e.stopPropagation();
            if (source) onClick(source);
          }}
        >
          {label}
        </Box>
      </Tooltip>
    );
  });
}
