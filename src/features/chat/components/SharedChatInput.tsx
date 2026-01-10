import {
  IconButton,
  Input,
  HStack,
  Icon,
  useDisclosure,
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
import { CollectionSelector } from './CollectionSelector';
import { collectionsService } from '@/services/collections-service';
import { ChatGPTPlusIcon } from '@/icons/other-icons';

interface SharedChatInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function SharedChatInput({ value: externalValue, onValueChange }: SharedChatInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const { addMessage, setIsLoading } = useChatContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  // Use external value if provided, otherwise use internal state
  const inputValue = externalValue !== undefined ? externalValue : internalValue;
  const setInputValue = onValueChange || setInternalValue;

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

    // Build payload to send to backend
    // If no collections selected => interpret as all
    const collectionsPayload = selectedCollections.length === 0 ? ['*'] : selectedCollections;
    const payload = {
      collections: collectionsPayload,
      content: message,
    };
    console.log('📤 Prepared payload for backend:', JSON.stringify(payload, null, 2));

    // Try POSTing to backend. Try same-origin first, then localhost:4010 as a fallback for local mock server.
    const tryPost = async (url: string) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Non-OK response ' + res.status);
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error('Non-JSON response');
        const data = await res.json();
        return data;
      } catch (err) {
        console.warn('POST to', url, 'failed:', err);
        return null;
      }
    };

    let responseJson = await tryPost('/api/chat');
    if (!responseJson) {
      responseJson = await tryPost('http://localhost:4010/api/chat');
    }

    if (responseJson) {
      // Normalize response into blocks and sources
      const blocks = responseJson.content?.blocks || [];
      const sources = responseJson.content?.sources || [];

      const content = blocks
        .filter((b: any) => b.type === 'markdown')
        .map((b: any) => b.body)
        .join('\n\n');

      addMessage(content || 'Response', 'assistant', sources, blocks);
      setIsLoading(false);
      return;
    }

    // Fallback to demo responses if backend failed
    setTimeout(() => {
      const { blocks, sources } = demoResponseService.getNextResponseWithSources();
      const content = blocks
        .filter((b) => b.type === 'markdown')
        .map((b) => (b as any).body)
        .join('\n\n');
      addMessage(content || 'Response', 'assistant', sources, blocks);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 768, position: 'relative' }}>
      {selectedCollections.length === 1 && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: '#2b6cb0', fontWeight: 600 }}>Đang chat trong: </span>
          <span style={{ color: '#9ad0ff', fontWeight: 600 }}>{collections.find((c: any) => c.id === selectedCollections[0])?.name || '...'}</span>
        </div>
      )}

      <InputGroup
        w='full'
        maxW='768px'
        startElement={
          <HStack spacing={3} align='center'>
            <div style={{ position: 'relative' }}>
              <IconButton
                aria-label='Open collections'
                size='sm'
                borderRadius='full'
                onClick={async () => {
                  console.log('➕ plus clicked');
                  const next = !dropdownOpen;
                  setDropdownOpen(next);
                  if (next) {
                    setLoadingCollections(true);
                    const data = await collectionsService.fetchCollections();
                    setCollections(data);
                    setLoadingCollections(false);
                  }
                }}
                bg='transparent'
                color='white'
                _hover={{ bg: 'rgba(255,255,255,0.04)' }}
              >
                <ChatGPTPlusIcon boxSize='5' />
              </IconButton>

              {dropdownOpen && (
                <div style={{ position: 'absolute', left: 0, bottom: 'calc(100% + 8px)', zIndex: 2000 }}>
                  <div style={{ minWidth: 220, background: 'rgba(15, 15, 15, 0.95)', color: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.6)'}}>
                    <div style={{ padding: '8px 12px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)'}}>Tất cả (Mặc định)</div>
                    {loadingCollections ? (
                      <div style={{ padding: 12 }}>Đang tải...</div>
                    ) : collections.length === 0 ? (
                      <div style={{ padding: 12 }}>Chưa có collections.</div>
                    ) : (
                      <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {collections.map((c: any) => (
                          <div key={c.id} onClick={() => { setSelectedCollections([c.id]); setDropdownOpen(false); }} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            {c.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <FileUploadRoot>
              <FileUploadTrigger asChild>
                <UploadIcon fontSize='2xl' color='fg' cursor='pointer' _hover={{ opacity: 0.8 }} />
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>
          </HStack>
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
    </div>
  );
}

