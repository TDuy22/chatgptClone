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

  // Construct PDF URL with page parameter
  // Using nameddest or page fragment identifier
  const pdfUrl = `/${source.fileUrl}#page=${source.pageNumber}&view=FitH`;
  console.log('📄 PDF URL:', pdfUrl);

  return (
    <Box
      w='600px'
      h='100vh'
      bg='gray.900'
      borderLeft='1px solid'
      borderColor='rgba(255, 255, 255, 0.1)'
      boxShadow='dark-lg'
      flexShrink='0'
      animation='slideIn 0.3s ease-in-out'
      css={{
        '@keyframes slideIn': {
          from: {
            transform: 'translateX(100%)',
            opacity: 0,
          },
          to: {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
      }}
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
            mb='4'
          >
            <Text fontSize='xs' color='fg.muted' mb='2' fontWeight='semibold'>
              RELEVANT EXCERPT
            </Text>
            <Text fontSize='sm' color='fg' lineHeight='1.7'>
              {source.snippet}
            </Text>
          </Box>

          {/* PDF Viewer */}
          <Box 
            bg='rgba(255, 255, 255, 0.02)' 
            borderRadius='md' 
            overflow='hidden'
            h='calc(100vh - 250px)'
          >
            <iframe
              key={`${source.id}-${source.pageNumber}`}
              src={pdfUrl}
              width='100%'
              height='100%'
              style={{
                border: 'none',
                display: 'block',
              }}
              title={`${source.fileName} - Page ${source.pageNumber}`}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
