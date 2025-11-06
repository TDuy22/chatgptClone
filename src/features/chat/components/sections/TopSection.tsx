import { Flex, IconButton } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';
import { NewChatIcon, SidebarIcon } from '@/features/sidebar/icons/sidebar-icons';
import { useSidebarContext } from '@/features/sidebar/context/SidebarContext';
import { ChatGPTMenu } from '@/features/sidebar/components/ChatGPTMenu';
import { useAppContext } from '@/contexts/AppContext';

export function TopSection() {
  const { sideBarVisible, toggleSidebar } = useSidebarContext();
  const { addChatHistory, setCurrentView } = useAppContext();

  const handleNewChat = () => {
    addChatHistory();
    setCurrentView('chat');
  };
  return (
    <Flex justify='space-between' align='center' p='2'>
      {!sideBarVisible && (
        <Flex>
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
              <NewChatIcon fontSize='2xl' color='fg.muted' />
            </IconButton>
          </Tooltip>
          <ChatGPTMenu />
        </Flex>
      )}
      {sideBarVisible && <ChatGPTMenu />}

      <Avatar
        name='Esther'
        size='sm'
        colorPalette='teal'
        variant='solid'
        mr='3'
      />
    </Flex>
  );
}
