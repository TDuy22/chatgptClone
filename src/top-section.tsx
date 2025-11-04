import { Flex, IconButton } from '@chakra-ui/react';
import { ChatGPTMenu } from './ChatGPTMenu';
import { Avatar } from './components/ui/avatar';
import { Tooltip } from './components/ui/tooltip';
import { NewChatIcon, SidebarIcon } from './icons/sidebar-icons';
import { useSidebarContext } from './sidebar-context';

export function TopSection() {
  const { sideBarVisible, toggleSidebar } = useSidebarContext();
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
            <IconButton variant='ghost'>
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
