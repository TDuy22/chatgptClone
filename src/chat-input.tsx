import {
  Box,
  Center,
  IconButton,
  Input,
} from '@chakra-ui/react';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from './components/ui/file-button';
import { InputGroup } from './components/ui/input-group';
import {
  EnterIcon,
  UploadIcon,
} from './icons/other-icons';
import { useState } from 'react';
import { useChatContext } from './chat-context';

export function ChatInput() {
  const [inputValue, setInputValue] = useState('');
  const { addMessage, setIsLoading } = useChatContext();

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with streaming effect
    setTimeout(() => {
      const mockResponses = [
        'Chào bạn! Mình đây. Hôm nay bạn muốn mình hỗ trợ gì—viết kịch bản vlog, chữa bài Hóa, hay debug code/React?',
        'Đây là câu trả lời mẫu từ ChatGPT với hiệu ứng streaming text. Bạn có thể thay thế bằng API thực tế để tạo trải nghiệm tương tác tốt hơn.',
        'Tôi đã hiểu câu hỏi của bạn. Đây là câu trả lời chi tiết với hiệu ứng gõ chữ từng ký tự một, giống như ChatGPT thực sự đang suy nghĩ và trả lời.',
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      addMessage(randomResponse, 'assistant');
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
    <Box pb='6' pt='4' px='4' bg='transparent'>
      <Center>
        <InputGroup
          maxW='768px'
          w='full'
          startElement={
            <FileUploadRoot>
              <FileUploadTrigger asChild>
                <Box cursor='pointer' _hover={{ opacity: 0.8 }}>
                  <UploadIcon fontSize='xl' color='fg.muted' />
                </Box>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>
          }
          endElement={
            <IconButton
              fontSize='xl'
              size='sm'
              borderRadius='lg'
              disabled={inputValue.trim() === ''}
              onClick={handleSendMessage}
              aria-label='Send message'
              bg={inputValue.trim() === '' ? 'transparent' : 'rgba(255, 255, 255, 0.1)'}
              _hover={{
                bg: inputValue.trim() === '' ? 'transparent' : 'rgba(255, 255, 255, 0.15)',
              }}
            >
              <EnterIcon fontSize='lg' />
            </IconButton>
          }
        >
          <Input
            placeholder='Message ChatGPT'
            variant='subtle'
            size='lg'
            borderRadius='3xl'
            value={inputValue}
            onChange={handleInputValue}
            onKeyDown={handleKeyDown}
            bg='rgba(255, 255, 255, 0.05)'
            borderColor='rgba(255, 255, 255, 0.1)'
            _focus={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              bg: 'rgba(255, 255, 255, 0.08)',
            }}
            _hover={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
          />
        </InputGroup>
      </Center>
    </Box>
  );
}
