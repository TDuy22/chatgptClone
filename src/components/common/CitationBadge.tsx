import { Badge } from '@chakra-ui/react';

interface CitationBadgeProps {
  citationId: number;
  onClick?: (id: number) => void;
}

export function CitationBadge({ citationId, onClick }: CitationBadgeProps) {
  return (
    <Badge
      as='button'
      onClick={() => onClick?.(citationId)}
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
}
