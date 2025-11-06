import { Badge } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';

interface CitationBadgeProps {
  citationId: number;
  snippet?: string;
  onClick?: (id: number) => void;
}

export function CitationBadge({ citationId, snippet, onClick }: CitationBadgeProps) {
  const handleClick = () => {
    console.log('🎯 CitationBadge clicked:', citationId);
    onClick?.(citationId);
  };

  const badge = (
    <Badge
      as='button'
      onClick={handleClick}
      colorScheme='blue'
      borderRadius='full'
      px='2'
      py='0.5'
      fontSize='xs'
      fontWeight='semibold'
      cursor='pointer'
      mx='0.5'
      verticalAlign='middle'
      bg='rgba(59, 130, 246, 0.2)'
      color='blue.300'
      border='1px solid'
      borderColor='rgba(59, 130, 246, 0.4)'
      _hover={{ 
        bg: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgba(59, 130, 246, 0.6)',
        transform: 'scale(1.05)'
      }}
      transition='all 0.2s'
    >
      {citationId}
    </Badge>
  );

  if (!snippet) {
    return badge;
  }

  return (
    <Tooltip
      content={snippet}
      positioning={{ placement: 'top' }}
      openDelay={200}
      closeDelay={100}
      showArrow
      contentProps={{
        css: {
          maxWidth: '400px',
          padding: '12px 16px',
          fontSize: '13px',
          lineHeight: '1.6',
          backgroundColor: 'rgba(30, 30, 30, 0.98)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          color: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      {badge}
    </Tooltip>
  );
}
