import { Button } from '@/components/ui/button';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';
import { Box, Circle, HStack, Stack, Text } from '@chakra-ui/react';
import {
  ChatGPTMenuIcon,
  ChatGPTPlusIcon,
  CheckIcon,
  MenuIcon,
  TemporaryChatIcon,
} from './icons/other-icons';
import { Switch } from './components/ui/switch';

interface MenuItemDetailProps {
  icon: React.ReactElement;
  title: string;
  description?: string;
  element: React.ReactElement;
}

function MenuItemDetail(props: MenuItemDetailProps) {
  const { icon, title, description, element, ...rest } = props;
  return (
    <HStack w='100%' {...rest}>
      <Circle size='8' bg='bg.muted'>
        {icon}
      </Circle>
      <Stack gap='0' flex='1'>
        <Text>{title}</Text>
        <Text fontSize='xs' color='fg.muted'>
          {description}
        </Text>
      </Stack>
      <Box>{element}</Box>
    </HStack>
  );
}

export const ChatGPTMenu = () => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant='ghost'
          fontSize='lg'
          fontWeight='bold'
          color='fg.muted'
        >
          Chat GPT <MenuIcon />
        </Button>
      </MenuTrigger>
      <MenuContent minW='320px' borderRadius='2xl'>
        <MenuItem value='chatgpt-plus' py='2'>
          <MenuItemDetail
            title='ChatGPT Plus'
            icon={<ChatGPTPlusIcon />}
            description='Our smartest model & more'
            element={
              <Button variant='outline' size='xs' borderRadius='full'>
                Upgrade
              </Button>
            }
          />
        </MenuItem>

        <MenuItem value='chatgpt' py='2'>
          <MenuItemDetail
            title='ChatGPT'
            icon={<ChatGPTMenuIcon />}
            description='Great for everyday tasks'
            element={<CheckIcon fontSize='lg' />}
          />
        </MenuItem>

        <MenuSeparator />
        <MenuItem value='temporary-chat' py='2'>
          <MenuItemDetail
            title='Temporary chat'
            icon={<TemporaryChatIcon />}
            element={<Switch size='sm' />}
          />
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
