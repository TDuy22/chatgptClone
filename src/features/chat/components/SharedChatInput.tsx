import {
  Box,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from '@/components/ui/file-button';
import { InputGroup } from '@/components/ui/input-group';
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  EnterIcon,
  UploadIcon,
} from '@/icons/other-icons';
import { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { getChatApi, getDataApi } from '@/services/api/api-factory';
import type { Citation } from '@/services/api/chat-api';
import type { Source, ContentBlock } from '@/services/demo-response-service';
import type { Collection } from '@/types/data';
import { useAppContext } from '@/contexts/AppContext';
import { LuDatabase, LuCheck, LuX, LuChevronDown } from 'react-icons/lu';

interface SharedChatInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SharedChatInput({ value: externalValue, onValueChange }: SharedChatInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { addMessage, setIsLoading } = useChatContext();
  const { selectedCollections, toggleCollection, clearSelectedCollections } = useAppContext();

  // Use external value if provided, otherwise use internal state
  const inputValue = externalValue !== undefined ? externalValue : internalValue;
  const setInputValue = onValueChange || setInternalValue;

  // Fetch collections when popover opens
  const fetchCollections = async () => {
    setIsLoadingCollections(true);
    try {
      const dataApi = getDataApi();
      const cols = await dataApi.getCollections();
      setCollections(cols);
      console.log('📁 Fetched collections:', cols);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const handleToggleCollection = (collection: Collection) => {
    toggleCollection({ id: collection.id, name: collection.name });
    console.log('📁 Toggled collection:', collection.name);
  };

  const isCollectionSelected = (collectionId: string) => {
    return selectedCollections.some(c => c.id === collectionId);
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (message === '') return;

    // Add user message (user messages don't have sources or blocks)
    addMessage(message, 'user', [], undefined);
    setInputValue('');
    setIsLoading(true);
    try {
      const chatApi = getChatApi();

      // Build request with collection_names (comma-separated for multiple)
      const collectionNames = selectedCollections.map(c => c.name);
      const req = {
        Question: message,
        // Nếu có nhiều collections, gửi tên collections
        collection: selectedCollections.length > 0 
          ? { 
              id: selectedCollections.map(c => c.id).join(','),
              name: collectionNames.join(',')  // Backend có thể parse bằng split(',')
            } 
          : undefined,
        // Thêm field riêng cho multi-select
        collection_names: collectionNames.length > 0 ? collectionNames : undefined,
      };

      console.log('📤 Sending request:', req);

      const res = await chatApi.chat(req as any);

      // Prefer new format (blocks + sources) if available, fallback to old format
      let sources: Source[] = [];
      let blocks: ContentBlock[] | undefined = undefined;

      if (res.sources && res.sources.length > 0) {
        sources = res.sources;
      } else if (res.Citation && res.Citation.length > 0) {
        sources = res.Citation.map((c: Citation, index: number) => ({
          id: (index + 1).toString(),
          fileName: c.file_name,
          pageNumber: 1,
          fileUrl: c.file_link,
          snippet: c.file_name,
        }));
      }

      if (res.blocks && res.blocks.length > 0) {
        blocks = res.blocks;
      }

      console.log('📤 API Response:', res);
      console.log('📤 Blocks:', blocks);
      console.log('📤 Sources:', sources);

      addMessage(res.Answer || 'Response', 'assistant', sources, blocks);
    } catch (e) {
      console.error('Chat error:', e);
      addMessage('Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu.', 'assistant', [], undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Display text for selected collections
  const getSelectionText = () => {
    if (selectedCollections.length === 0) {
      return 'Tất cả collections';
    }
    if (selectedCollections.length === 1) {
      return selectedCollections[0].name;
    }
    return `${selectedCollections.length} collections`;
  };

  return (
    <VStack w='full' maxW='768px' gap='2'>
      {/* Collection multi-selector */}
      <HStack w='full' justify='flex-start' px='2' flexWrap='wrap' gap='2'>
        <PopoverRoot 
          open={isPopoverOpen} 
          onOpenChange={(details) => {
            setIsPopoverOpen(details.open);
            if (details.open) fetchCollections();
          }}
        >
          <PopoverTrigger asChild>
            <HStack
              as='button'
              gap='2'
              px='3'
              py='1.5'
              bg={selectedCollections.length > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)'}
              borderRadius='full'
              border='1px solid'
              borderColor={selectedCollections.length > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.15)'}
              cursor='pointer'
              _hover={{
                bg: selectedCollections.length > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.12)',
              }}
              transition='all 0.2s'
            >
              <LuDatabase size={14} color={selectedCollections.length > 0 ? '#10b981' : '#9ca3af'} />
              <Text fontSize='xs' color={selectedCollections.length > 0 ? 'green.400' : 'gray.400'}>
                {getSelectionText()}
              </Text>
              <LuChevronDown size={12} color='#9ca3af' />
            </HStack>
          </PopoverTrigger>
          <PopoverContent
            w='280px'
            bg='gray.900'
            borderColor='rgba(255, 255, 255, 0.15)'
            borderRadius='lg'
          >
            <PopoverArrow />
            <PopoverBody p='2'>
              <VStack align='stretch' gap='1'>
                {/* Header with clear button */}
                <HStack justify='space-between' px='2' py='1'>
                  <Text fontSize='xs' color='gray.500' fontWeight='medium'>
                    Chọn collections
                  </Text>
                  {selectedCollections.length > 0 && (
                    <Text
                      as='button'
                      fontSize='xs'
                      color='red.400'
                      cursor='pointer'
                      _hover={{ textDecoration: 'underline' }}
                      onClick={clearSelectedCollections}
                    >
                      Xóa tất cả
                    </Text>
                  )}
                </HStack>

                {/* Loading state */}
                {isLoadingCollections && (
                  <Box px='3' py='2'>
                    <Text fontSize='sm' color='gray.500'>Đang tải...</Text>
                  </Box>
                )}

                {/* Empty state */}
                {!isLoadingCollections && collections.length === 0 && (
                  <Box px='3' py='2'>
                    <Text fontSize='sm' color='gray.500'>Chưa có collection nào</Text>
                  </Box>
                )}

                {/* Collection list with checkboxes */}
                {collections.map((col) => (
                  <HStack
                    key={col.id}
                    as='button'
                    w='full'
                    justify='space-between'
                    px='3'
                    py='2'
                    bg={isCollectionSelected(col.id) ? 'rgba(16, 185, 129, 0.15)' : 'transparent'}
                    borderRadius='md'
                    cursor='pointer'
                    _hover={{ bg: isCollectionSelected(col.id) ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)' }}
                    transition='all 0.15s'
                    onClick={() => handleToggleCollection(col)}
                  >
                    <Text fontSize='sm' color='fg' truncate maxW='200px'>
                      {col.name}
                    </Text>
                    <Box
                      w='18px'
                      h='18px'
                      borderRadius='sm'
                      border='2px solid'
                      borderColor={isCollectionSelected(col.id) ? '#10b981' : 'rgba(255, 255, 255, 0.3)'}
                      bg={isCollectionSelected(col.id) ? '#10b981' : 'transparent'}
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      transition='all 0.15s'
                    >
                      {isCollectionSelected(col.id) && <LuCheck size={12} color='white' />}
                    </Box>
                  </HStack>
                ))}

                {/* Info text */}
                <Box px='2' pt='2' borderTopWidth='1px' borderTopColor='rgba(255, 255, 255, 0.1)'>
                  <Text fontSize='xs' color='gray.500'>
                    {selectedCollections.length === 0 
                      ? '💡 Không chọn = tìm trong tất cả' 
                      : `✓ Đã chọn ${selectedCollections.length} collection`
                    }
                  </Text>
                </Box>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>

        {/* Show selected collection tags */}
        {selectedCollections.length > 0 && selectedCollections.length <= 3 && (
          <>
            {selectedCollections.map((col) => (
              <HStack
                key={col.id}
                gap='1'
                px='2'
                py='1'
                bg='rgba(16, 185, 129, 0.1)'
                borderRadius='full'
                border='1px solid'
                borderColor='rgba(16, 185, 129, 0.3)'
              >
                <Text fontSize='xs' color='green.400' maxW='100px' truncate>
                  {col.name}
                </Text>
                <Box
                  as='button'
                  p='0.5'
                  borderRadius='full'
                  _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                  onClick={() => toggleCollection(col)}
                >
                  <LuX size={10} color='#9ca3af' />
                </Box>
              </HStack>
            ))}
          </>
        )}
      </HStack>

      {/* Chat input */}
      <InputGroup
        w='full'
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
    </VStack>
  );
}
