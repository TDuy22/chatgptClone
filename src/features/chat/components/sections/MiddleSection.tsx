import {
  Center,
  Heading,
  Span,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SharedChatInput } from '../SharedChatInput';

export function MiddleSection() {
  const [inputValue, setInputValue] = useState('');

  return (
    <Center flex='1'>
      <VStack gap='6' w='full' maxW='900px' px='4'>
        <Heading size='3xl'>What can I help with?</Heading>
        <Center w='full'>
          <SharedChatInput value={inputValue} onValueChange={setInputValue} />
        </Center>

        <VStack gap='4' align='stretch' maxW='768px' w='full'>
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
