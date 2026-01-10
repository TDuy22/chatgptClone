import {
  Button,
  Checkbox,
  Flex,
  Portal,
  Box,
  Spinner,
  Text,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { useEffect, useState } from 'react';
import { collectionsService, CollectionItem } from '@/services/collections-service';

interface CollectionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function CollectionSelector({ isOpen, onClose, selected, onChange }: CollectionSelectorProps) {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [localSelection, setLocalSelection] = useState<string[]>(selected || []);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    collectionsService.fetchCollections().then((data) => {
      setCollections(data);
      setLoading(false);
    });
  }, [isOpen]);

  useEffect(() => setLocalSelection(selected || []), [selected]);

  const toggle = (id: string) => {
    setLocalSelection((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const apply = () => {
    onChange(localSelection);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <Box position='fixed' inset='0' zIndex={99999}>
        <Box position='absolute' inset='0' bg='blackAlpha.600' onClick={onClose} />
        <Flex align='center' justify='center' h='100%'>
          <Box bg='chakra-body-bg' color='chakra-body-text' borderRadius='md' shadow='lg' minW='320px' maxW='640px' mx='4'>
            <Flex align='center' justify='space-between' px='4' py='3' borderBottomWidth='1px'>
              <Text fontWeight={700}>Chọn collection</Text>
              <CloseButton onClick={onClose} />
            </Flex>

            <Box px='4' py='4'>
              <Checkbox
                isChecked={localSelection.length === 0}
                onChange={() => {
                  if (localSelection.length === 0) {
                    // currently 'all' -> switch to explicit all ids (acts like none selected)
                    setLocalSelection(collections.map((c) => c.id));
                  } else {
                    // switch back to 'all' represented by empty array
                    setLocalSelection([]);
                  }
                }}
                mb='3'
              >
                <Text fontWeight={700}>Tất cả collections</Text>
              </Checkbox>

              {loading ? (
                <Flex justify='center' py='6'>
                  <Spinner />
                </Flex>
              ) : collections.length === 0 ? (
                <Text>Chưa có collections.</Text>
              ) : (
                <Box maxH='240px' overflowY='auto'>
                  <VStack align='stretch'>
                    {collections.map((c) => (
                      <Checkbox
                        key={c.id}
                        isChecked={localSelection.includes(c.id)}
                        onChange={() => toggle(c.id)}
                      >
                        <Text fontWeight={600}>{c.name}</Text>
                        {c.description ? <Text fontSize='sm'>{c.description}</Text> : null}
                      </Checkbox>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>

            <Flex justify='flex-end' gap='3' px='4' py='3' borderTopWidth='1px'>
              <Button variant='ghost' onClick={onClose}>Hủy</Button>
              <Button colorScheme='blue' onClick={apply}>Áp dụng</Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Portal>
  );
}
