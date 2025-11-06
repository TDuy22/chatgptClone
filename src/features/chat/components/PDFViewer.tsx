import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';
import { Source } from '@/services/demo-response-service';

interface PDFViewerProps {
  source: Source | null;
  onClose: () => void;
}

export function PDFViewer({ source, onClose }: PDFViewerProps) {
  console.log('📄 PDFViewer render:', source);
  
  if (!source) {
    return null;
  }

  return (
    <Box
      position='fixed'
      right='0'
      top='0'
      bottom='0'
      w='600px'
      bg='gray.900'
      borderLeft='1px solid'
      borderColor='rgba(255, 255, 255, 0.1)'
      zIndex='1000'
      boxShadow='dark-lg'
    >
      <VStack align='stretch' h='full' gap='0'>
        {/* Header */}
        <Flex
          px='4'
          py='3'
          borderBottom='1px solid'
          borderColor='rgba(255, 255, 255, 0.1)'
          alignItems='center'
          justifyContent='space-between'
          bg='rgba(255, 255, 255, 0.02)'
        >
          <VStack align='start' gap='1' flex='1'>
            <Text fontSize='sm' fontWeight='semibold' color='fg'>
              {source.fileName}
            </Text>
            <Text fontSize='xs' color='fg.muted'>
              Page {source.pageNumber}
            </Text>
          </VStack>
          
          <IconButton
            aria-label='Close'
            size='sm'
            variant='ghost'
            onClick={onClose}
          >
            <LuX />
          </IconButton>
        </Flex>

        {/* PDF Content Area */}
        <Box flex='1' overflowY='auto' p='4'>
          {/* Snippet Preview */}
          <Box
            bg='rgba(255, 255, 255, 0.05)'
            p='4'
            borderRadius='md'
            borderLeft='4px solid'
            borderColor='blue.500'
          >
            <Text fontSize='xs' color='fg.muted' mb='2' fontWeight='semibold'>
              RELEVANT EXCERPT
            </Text>
            <Text fontSize='sm' color='fg' lineHeight='1.7'>
              {source.snippet}
            </Text>
          </Box>

          {/* PDF Viewer Placeholder */}
          <Box mt='4' p='6' bg='rgba(255, 255, 255, 0.02)' borderRadius='md' textAlign='center'>
            <Text fontSize='sm' color='fg.muted'>
              PDF Viewer will be integrated here
            </Text>
            <Text fontSize='xs' color='fg.muted' mt='2'>
              File: {source.fileUrl}
            </Text>
            <Text fontSize='xs' color='fg.muted'>
              Page: {source.pageNumber}
            </Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
