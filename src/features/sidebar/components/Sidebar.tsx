import {
  Box,
  Circle,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useAppContext } from '@/contexts/AppContext';
import { Tooltip } from '@/components/ui/tooltip';
import {
  DatabaseIcon,
  NewChatIcon,
  SidebarIcon,
} from '../icons/sidebar-icons';

import { useSidebarContext } from '../context/SidebarContext';
import { ChatHistoryList } from './ChatHistoryList';

export function Sidebar() {
  const { sideBarVisible, toggleSidebar } = useSidebarContext();
  const { currentView, setCurrentView, addChatHistory } = useAppContext();

  const handleNewChat = () => {
    addChatHistory();
    setCurrentView('chat');
  };

  return (
    <Box
      bg='bg.muted'
      w={!sideBarVisible ? '0' : '260px'}
      overflow='hidden'
      transition=' width 0.3s'
    >
      <Stack h='full' px='3' py='2'>
        <Flex justify='space-between'>
          <Tooltip
            content='Close sidebar'
            positioning={{ placement: 'right' }}
            showArrow
          >
            <IconButton variant='ghost' onClick={toggleSidebar}>
              <SidebarIcon fontSize='2xl' color='fg.muted' />
            </IconButton>
          </Tooltip>

          <Tooltip content='New chat' showArrow>
            <IconButton variant='ghost' onClick={handleNewChat}>
              <NewChatIcon fontSize='3xl' color='fg.muted' />
            </IconButton>
          </Tooltip>
        </Flex>

        <Stack px='2' gap='0' flex='1' overflowY='auto'>
          <HStack
            position='relative'
            className='group'
            _hover={{
              layerStyle: 'fill.muted',
              textDecor: 'none',
            }}
            px='3'
            h='10'
            borderRadius='lg'
            w='100%'
            whiteSpace='nowrap'
            cursor='pointer'
            onClick={handleNewChat}
            bg='transparent'
          >
            <Text fontSize='sm' fontWeight='md'>
              New chat
            </Text>
          </HStack>

          <ChatHistoryList />
        </Stack>

        <Box
          _hover={{ layerStyle: 'fill.muted' }}
          borderRadius='lg'
          px='1'
          py='2'
          cursor='pointer'
          onClick={() => setCurrentView('data-management')}
          bg={currentView === 'data-management' ? 'bg.emphasized' : 'transparent'}
        >
          <HStack whiteSpace='nowrap'>
            <Circle size='8' fontSize='lg' borderWidth='1px'>
              <DatabaseIcon />
            </Circle>
            <Stack gap='0' fontWeight='medium'>
              <Text fontSize='sm'>Data Management</Text>
              <Text fontSize='xs' color='fg.subtle'>
                Manage your data and storage
              </Text>
            </Stack>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
}
