import {
  Center,
  Heading,
  IconButton,
  Input,
  Span,
  VStack,
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
import { Button } from '@/components/ui/button';
import { useChatContext } from '../../context/ChatContext';
import { demoResponseService } from '@/services/demo-response-service';

export function MiddleSection() {
  const [inputValue, setInputValue] = useState('');
  const { addMessage, setIsLoading } = useChatContext();

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
      
      console.log('📦 MiddleSection - Response answer:', answer.substring(0, 50) + '...');
      console.log('📦 MiddleSection - Response sources COUNT:', sources.length);
      console.log('📦 MiddleSection - Response sources:', JSON.stringify(sources, null, 2));
      console.log('📦 MiddleSection - About to call addMessage with sources:', sources);
      
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
    <Center flex='1'>
      <VStack gap='6'>
        <Heading size='3xl'>What can I help with?</Heading>
        <Center>
          <InputGroup
            minW='768px'
            startElement={
              <FileUploadRoot>
                <FileUploadTrigger asChild>
                  <UploadIcon fontSize='2xl' color='fg' />
                </FileUploadTrigger>
                <FileUploadList />
              </FileUploadRoot>
            }
            endElement={
              <IconButton
                fontSize='2xl'
                size='sm'
                borderRadius='full'
                disabled={inputValue.trim() === ''}
                onClick={handleSendMessage}
                aria-label='Send message'
              >
                <EnterIcon fontSize='2xl' />
              </IconButton>
            }
          >
            <Input
              placeholder='Message Askify'
              variant='subtle'
              size='lg'
              borderRadius='3xl'
              value={inputValue}
              onChange={handleInputValue}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Center>

        <VStack gap='4' align='stretch' maxW='768px'>
          <Heading size='lg' textAlign='center' color='fg.muted'>
            
          </Heading>
          <VStack gap='0' align='stretch'>
            <Button 
              variant='ghost' 
              p='4' 
              h='auto'
              justifyContent='flex-start'
              borderBottomWidth='1px'
              borderBottomColor='rgba(255, 255, 255, 0.1)'
              borderRadius='0'
              _hover={{ 
                bg: 'rgba(255, 255, 255, 0.05)',
                transform: 'translateX(4px)',
                borderBottomColor: 'rgba(255, 255, 255, 0.2)'
              }}
              _active={{
                bg: 'rgba(255, 255, 255, 0.1)'
              }}
              transition='all 0.2s ease-in-out'
              onClick={() => {
                setInputValue('What is artificial intelligence and how does it work?');
              }}
            >
              <Span fontSize='sm' textAlign='left' color='fg.subtle' w='full'>
                What is artificial intelligence and how does it work?
              </Span>
            </Button>
            <Button 
              variant='ghost' 
              p='4' 
              h='auto'
              justifyContent='flex-start'
              borderBottomWidth='1px'
              borderBottomColor='rgba(255, 255, 255, 0.1)'
              borderRadius='0'
              _hover={{ 
                bg: 'rgba(255, 255, 255, 0.05)',
                transform: 'translateX(4px)',
                borderBottomColor: 'rgba(255, 255, 255, 0.2)'
              }}
              _active={{
                bg: 'rgba(255, 255, 255, 0.1)'
              }}
              transition='all 0.2s ease-in-out'
              onClick={() => {
                setInputValue('How can I improve my productivity at work?');
              }}
            >
              <Span fontSize='sm' textAlign='left' color='fg.subtle' w='full'>
                How can I improve my productivity at work?
              </Span>
            </Button>
            <Button 
              variant='ghost' 
              p='4' 
              h='auto'
              justifyContent='flex-start'
              borderRadius='0'
              _hover={{ 
                bg: 'rgba(255, 255, 255, 0.05)',
                transform: 'translateX(4px)'
              }}
              _active={{
                bg: 'rgba(255, 255, 255, 0.1)'
              }}
              transition='all 0.2s ease-in-out'
              onClick={() => {
                setInputValue('What are the best practices for learning a new programming language?');
              }}
            >
              <Span fontSize='sm' textAlign='left' color='fg.subtle' w='full'>
                What are the best practices for learning a new programming language?
              </Span>
            </Button>
          </VStack>
        </VStack>
      </VStack>
    </Center>
  );
}
