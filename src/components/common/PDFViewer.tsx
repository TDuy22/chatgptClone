import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { LuX, LuChevronLeft, LuChevronRight, LuZoomIn, LuZoomOut } from 'react-icons/lu';
import type { SourceItem } from '@/utils/citation';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '@/styles/pdf-viewer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  source: SourceItem;
  onClose: () => void;
};

export function PDFViewer({ source, onClose }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(source.pageNumber || 1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(source.pageNumber || 1);
  }

  return (
    <Box
      position='fixed'
      right='0'
      top='0'
      h='100vh'
      w='500px'
      bg='#111827'
      borderLeft='1px solid'
      borderColor='rgba(255, 255, 255, 0.1)'
      shadow='xl'
      zIndex='1000'
    >
      <VStack h='full' gap='0'>
        {/* Header */}
        <HStack
          w='full'
          p='4'
          borderBottom='1px solid'
          borderColor='rgba(255, 255, 255, 0.1)'
          justify='space-between'
        >
          <VStack align='start' gap='1' flex='1'>
            <Text 
              fontSize='sm' 
              fontWeight='semibold' 
              color='white'
              css={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {source.fileName}
            </Text>
            <Text fontSize='xs' color='rgba(156, 163, 175, 1)'>
              Trang {pageNumber} / {numPages || '...'}
            </Text>
          </VStack>
          <IconButton
            size='sm'
            variant='ghost'
            aria-label='Close'
            onClick={onClose}
          >
            <LuX />
          </IconButton>
        </HStack>

        {/* PDF Content */}
        <Box
          flex='1'
          w='full'
          overflowY='auto'
          overflowX='hidden'
          bg='#1f2937'
          display='flex'
          justifyContent='center'
          p='4'
        >
          <Document
            file={source.fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <Box p='8' textAlign='center' color='rgba(156, 163, 175, 1)'>
                Đang tải PDF...
              </Box>
            }
            error={
              <Box p='8' textAlign='center' color='#f87171'>
                Không thể tải tài liệu
              </Box>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </Box>

        {/* Controls */}
        <HStack
          w='full'
          p='4'
          borderTop='1px solid'
          borderColor='rgba(255, 255, 255, 0.1)'
          justify='space-between'
        >
          <HStack>
            <IconButton
              size='sm'
              variant='outline'
              aria-label='Previous page'
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            >
              <LuChevronLeft />
            </IconButton>
            <IconButton
              size='sm'
              variant='outline'
              aria-label='Next page'
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            >
              <LuChevronRight />
            </IconButton>
          </HStack>

          <HStack>
            <IconButton
              size='sm'
              variant='outline'
              aria-label='Zoom out'
              disabled={scale <= 0.5}
              onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            >
              <LuZoomOut />
            </IconButton>
            <Text fontSize='sm' minW='50px' textAlign='center' color='white'>
              {Math.round(scale * 100)}%
            </Text>
            <IconButton
              size='sm'
              variant='outline'
              aria-label='Zoom in'
              disabled={scale >= 2.0}
              onClick={() => setScale(s => Math.min(2.0, s + 0.25))}
            >
              <LuZoomIn />
            </IconButton>
          </HStack>
        </HStack>

        {/* Snippet Info */}
        {source.snippet && (
          <Box
            w='full'
            p='4'
            bg='rgba(59, 130, 246, 0.1)'
            borderTop='1px solid'
            borderColor='rgba(59, 130, 246, 0.2)'
          >
            <Text fontSize='xs' color='#93c5fd' fontWeight='semibold' mb='2'>
              Đoạn trích dẫn:
            </Text>
            <Text fontSize='xs' color='#d1d5db' lineHeight='1.6'>
              {source.snippet}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
