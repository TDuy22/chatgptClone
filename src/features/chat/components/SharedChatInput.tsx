import {
  IconButton,
  Input,
} from '@chakra-ui/react';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from '@/components/ui/file-button';
import { InputGroup } from '@/components/ui/input-group';
import {
  EnterIcon,
  UploadIcon,
} from '@/icons/other-icons';
import { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { demoResponseService } from '@/services/demo-response-service';

interface SharedChatInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SharedChatInput({ value: externalValue, onValueChange }: SharedChatInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const { addMessage, setIsLoading } = useChatContext();

  // Use external value if provided, otherwise use internal state
  const inputValue = externalValue !== undefined ? externalValue : internalValue;
  const setInputValue = onValueChange || setInternalValue;

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (message === '') return;

    // Add user message (user messages don't have sources)
    addMessage(message, 'user', []);
    setInputValue('');
    setIsLoading(true);

    // Get response from demo JSON file
    setTimeout(() => {
      // Get answer and sources together (avoid index mismatch)
      const { answer, sources } = demoResponseService.getNextResponseWithSources();
      
      console.log('📦 SharedChatInput - Response answer:', answer.substring(0, 50) + '...');
      console.log('📦 SharedChatInput - Response sources COUNT:', sources.length);
      console.log('📦 SharedChatInput - Response sources:', JSON.stringify(sources, null, 2));
      console.log('📦 SharedChatInput - About to call addMessage with sources:', sources);
      
      // Add assistant message with sources
      addMessage(answer, 'assistant', sources);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <InputGroup
      w='full'
      maxW='768px'
      startElement={
        <FileUploadRoot>
          <FileUploadTrigger asChild>
            <UploadIcon fontSize='2xl' color='fg' cursor='pointer' _hover={{ opacity: 0.8 }} />
          </FileUploadTrigger>
          <FileUploadList />
        </FileUploadRoot>
      }
      endElement={
        <IconButton
          size='md'
          borderRadius='full'
          disabled={inputValue.trim() === ''}
          onClick={handleSendMessage}
          aria-label='Send message'
          bg={inputValue.trim() === '' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}
          _hover={{
            bg: inputValue.trim() === '' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
          }}
          _disabled={{
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          <EnterIcon fontSize='xl' />
        </IconButton>
      }
    >
      <Input
        placeholder='Message Askify'
        variant='subtle'
        size='xl'
        h='14'
        borderRadius='3xl'
        value={inputValue}
        onChange={handleInputValue}
        onKeyDown={handleKeyDown}
        borderWidth='1px'
        borderColor='rgba(255, 255, 255, 0.15)'
        _focus={{
          borderColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: 'none',
        }}
        _hover={{
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }}
      />
    </InputGroup>
  );
}
