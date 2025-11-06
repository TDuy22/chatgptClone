import { Box, Flex, IconButton, Text, VStack } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';
import { Source } from '@/services/demo-response-service';
import { useState, useRef, useEffect } from 'react';

interface PDFViewerProps {
  source: Source | null;
  onClose: () => void;
}

export function PDFViewer({ source, onClose }: PDFViewerProps) {
  const [width, setWidth] = useState(800);
  const [isResizing, setIsResizing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(800);

  console.log('📄 PDFViewer render:', source);
  
  // Trigger animation on mount
  useEffect(() => {
    if (source) {
      // Small delay to ensure CSS transition works
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
  }, [source]);

  if (!source) {
    return null;
  }

  // Construct PDF URL with page parameter
  const pdfUrl = `/${source.fileUrl}#page=${source.pageNumber}&view=FitH`;
  console.log('📄 PDF URL:', pdfUrl);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      // Calculate new width based on mouse movement
      const delta = startXRef.current - e.clientX;
      const newWidth = Math.min(Math.max(400, startWidthRef.current + delta), 1200);
      
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        setWidth(newWidth);
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent text selection and set cursor globally
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none'; // Prevent iframe from capturing events

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    };
  }, [isResizing]);

  return (
    <Box
      w={`${width}px`}
      h='100vh'
      bg='gray.900'
      borderLeft='1px solid'
      borderColor='rgba(255, 255, 255, 0.1)'
      boxShadow='dark-lg'
      flexShrink='0'
      position='relative'
      transform={isVisible ? 'translateX(0)' : 'translateX(100%)'}
      opacity={isVisible ? 1 : 0}
      transition='transform 0.3s ease-out, opacity 0.3s ease-out'
    >
      {/* Overlay to prevent iframe from capturing mouse events while resizing */}
      {isResizing && (
        <Box
          position='absolute'
          top='0'
          left='0'
          right='0'
          bottom='0'
          zIndex='999'
          bg='transparent'
        />
      )}
      
      {/* Resize Handle */}
      <Box
        position='absolute'
        left='-4px'
        top='0'
        bottom='0'
        w='8px'
        cursor='ew-resize'
        onMouseDown={handleMouseDown}
        bg='transparent'
        _hover={{
          bg: 'rgba(59, 130, 246, 0.3)',
        }}
        _active={{
          bg: 'rgba(59, 130, 246, 0.5)',
        }}
        transition='background 0.2s'
        zIndex='10'
      >
        {/* Visual indicator line */}
        <Box
          position='absolute'
          left='50%'
          top='0'
          bottom='0'
          w='2px'
          bg='rgba(255, 255, 255, 0.1)'
          transform='translateX(-50%)'
          _groupHover={{
            bg: 'rgba(59, 130, 246, 0.6)',
          }}
        />
      </Box>
      
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
        <Box flex='1' overflow='hidden' display='flex' flexDirection='column'>
          {/* PDF Viewer - Full height with bottom padding */}
          <Box 
            flex='1'
            bg='rgba(255, 255, 255, 0.02)' 
            borderRadius='md' 
            overflow='hidden'
            m='3'
            mb='5'
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
