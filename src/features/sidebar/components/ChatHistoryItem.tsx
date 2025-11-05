import { HStack, IconButton, Text } from '@chakra-ui/react';
import { useAppContext } from '@/contexts/AppContext';
import { ChatHistory } from '@/types/chat-history';
import { LuTrash2 } from 'react-icons/lu';
import { Tooltip } from '@/components/ui/tooltip';

interface ChatHistoryItemProps {
  chatHistory: ChatHistory;
}

export function ChatHistoryItem({ chatHistory }: ChatHistoryItemProps) {
  const { currentChatId, selectChatHistory, deleteChatHistory } = useAppContext();
  const isActive = currentChatId === chatHistory.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatHistory(chatHistory.id);
  };

  return (
    <HStack
      position='relative'
      className='group'
      _hover={{
        layerStyle: 'fill.muted',
      }}
      px='3'
      py='2'
      borderRadius='lg'
      w='100%'
      cursor='pointer'
      onClick={() => selectChatHistory(chatHistory.id)}
      bg={isActive ? 'bg.emphasized' : 'transparent'}
      justify='space-between'
    >
      <Text 
        fontSize='sm' 
        fontWeight='md'
        flex='1'
        overflow='hidden'
        textOverflow='ellipsis'
        whiteSpace='nowrap'
      >
        {chatHistory.title}
      </Text>
      
      <Tooltip content='Delete chat' positioning={{ placement: 'right' }} showArrow>
        <IconButton
          aria-label='Delete chat'
          size='xs'
          variant='ghost'
          display='none'
          _groupHover={{ display: 'flex' }}
          onClick={handleDelete}
        >
          <LuTrash2 />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}
