import {
  Box,
  Button,
  Card,
  Grid,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getDataApi } from '@/services/api/api-factory';
import type { Collection, FileItem } from '@/types/data';
import { useAppContext } from '@/contexts/AppContext';
import { Tooltip } from '@/components/ui/tooltip';

export function DataManagement() {
  const dataApi = useMemo(() => getDataApi(), []);
  const { selectedCollection, setSelectedCollection } = useAppContext();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState<boolean>(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingCollections(true);
        const cols = await dataApi.getCollections();
        setCollections(cols);
        // determine selected collection: prefer context, else first
        const preferredId = selectedCollection?.id && cols.some(c => c.id === selectedCollection.id)
          ? selectedCollection.id
          : cols[0]?.id || '';
        setSelectedCollectionId(preferredId);
        if (preferredId && (!selectedCollection || selectedCollection.id !== preferredId)) {
          const col = cols.find(c => c.id === preferredId)!;
          setSelectedCollection({ id: col.id, name: col.name });
        }
      } finally {
        setIsLoadingCollections(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!selectedCollectionId) {
        setFiles([]);
        return;
      }
      try {
        setIsLoadingFiles(true);
        const list = await dataApi.getFiles(selectedCollectionId);
        setFiles(list);
      } finally {
        setIsLoadingFiles(false);
      }
    };
    fetchFiles();
  }, [selectedCollectionId, dataApi]);

  const handleCreateCollection = async () => {
    const name = newCollectionName.trim();
    if (!name) return;
    const created = await dataApi.createCollection(name);
    setCollections(prev => [created, ...prev]);
    setNewCollectionName('');
    setSelectedCollectionId(created.id);
    setSelectedCollection({ id: created.id, name: created.name });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCollectionId(id);
    const col = collections.find(c => c.id === id);
    if (col) setSelectedCollection({ id: col.id, name: col.name });
  };

  const handleFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files;
    if (!chosen || chosen.length === 0) return;
    // Add to staging area instead of uploading immediately
    const next = Array.from(chosen);
    setPendingFiles((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearPending = () => {
    setPendingFiles([]);
  };

  const handleUploadPending = async () => {
    if (!selectedCollectionId || pendingFiles.length === 0) return;
    try {
      setIsUploading(true);
      await dataApi.uploadFiles({ files: pendingFiles, collectionId: selectedCollectionId });
      setPendingFiles([]);
      const list = await dataApi.getFiles(selectedCollectionId);
      setFiles(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Box flex="1" p="6" h="full" overflow="auto" minW="0">
      <VStack align="stretch" gap="6" maxW="none" w="full">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb="2">
            Quản lý Data
          </Text>
          <Text color="fg.subtle">Upload, xem và quản lý các file của bạn theo Collection</Text>
        </Box>

        {/* Collections Section */}
        <Card.Root w="full">
          <Card.Header>
            <Card.Title>Collections</Card.Title>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap="4">
              <HStack gap="4" align="center">
                <Box maxW="320px" w="320px">
                  <select
                    value={selectedCollectionId}
                    onChange={handleSelectChange}
                    disabled={isLoadingCollections}
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      background: '#1a1a1a',
                      color: '#e5e5e5',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {collections.map((c) => (
                      <option 
                        key={c.id} 
                        value={c.id}
                        style={{ 
                          background: '#1a1a1a', 
                          color: '#e5e5e5',
                          padding: '8px',
                        }}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Box>

                <HStack gap="2">
                  <Input
                    placeholder="Tên collection mới"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    maxW="320px"
                  />
                  <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
                    Tạo Collection
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Upload Section */}
        <Card.Root w="full">
          <Card.Header>
            <Card.Title>Upload File</Card.Title>
          </Card.Header>
          <Card.Body>
            <VStack gap="6" align="stretch">
              {/* Hidden native file input */}
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFilesChosen}
                display="none"
              />

              {/* Centered trigger inside a dashed container */}
              <Box
                border="1px dashed"
                borderColor="border.muted"
                borderRadius="md"
                p="2"
                minH="80px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                _hover={{ borderColor: 'border.emphasized', bg: 'bg.muted' }}
                transition="all 0.2s"
                cursor={!selectedCollectionId || isUploading ? 'not-allowed' : 'pointer'}
                onClick={() => {
                  if (!selectedCollectionId || isUploading) return;
                  fileInputRef.current?.click();
                }}
              >
                <Button
                  colorScheme="blue"
                  size="xs"
                  disabled={!selectedCollectionId || isUploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectedCollectionId || isUploading) return;
                    fileInputRef.current?.click();
                  }}
                >
                  Chọn File để Upload
                </Button>
              </Box>

              {!selectedCollectionId && (
                <Text color="fg.subtle">Hãy chọn hoặc tạo một collection trước khi upload</Text>
              )}
              {isUploading && <Text color="fg.subtle">Đang upload...</Text>}

              {pendingFiles.length > 0 && (
                <VStack align="stretch" gap="3">
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Danh sách sẽ upload ({pendingFiles.length})</Text>
                    <Text fontSize="sm" color="fg.subtle">
                      Tổng dung lượng: {formatFileSize(pendingFiles.reduce((sum, f) => sum + f.size, 0))}
                    </Text>
                  </HStack>
                  <VStack align="stretch" gap="2">
                    {pendingFiles.map((f, idx) => (
                      <HStack key={`${f.name}-${idx}`} justify="space-between">
                        <Box minW={0} flex="1">
                          <Text fontSize="sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</Text>
                          <Text fontSize="xs" color="fg.subtle">{f.type || 'Unknown'} • {formatFileSize(f.size)}</Text>
                        </Box>
                        <HStack gap="2">
                          <Button size="xs" variant="ghost" onClick={() => handleRemovePending(idx)}>Xoá</Button>
                        </HStack>
                      </HStack>
                    ))}
                  </VStack>
                  <HStack justify="flex-end" gap="2">
                    <Button size="sm" variant="outline" onClick={handleClearPending} disabled={isUploading}>Clear</Button>
                    <Button size="sm" colorScheme="blue" onClick={handleUploadPending} disabled={!selectedCollectionId || isUploading || pendingFiles.length === 0}>
                      Upload {pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''}
                    </Button>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Files List */}
        <Card.Root w="full">
          <Card.Header>
            <HStack justify="space-between">
              <Card.Title>File trong Collection ({files.length})</Card.Title>
            </HStack>
          </Card.Header>
          <Card.Body>
            {isLoadingFiles ? (
              <Box textAlign="center" py="12"><Text>Đang tải files...</Text></Box>
            ) : files.length === 0 ? (
              <Box textAlign="center" py="12">
                <VStack gap="4">
                  <Box fontSize="4xl" color="fg.subtle">📄</Box>
                  <VStack gap="2">
                    <Text color="fg.subtle" fontSize="lg" fontWeight="semibold">Chưa có file nào</Text>
                    <Text color="fg.subtle" fontSize="sm">Hãy upload file vào collection đã chọn</Text>
                  </VStack>
                </VStack>
              </Box>
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap="6" w="full">
                {files.map((file) => (
                  <Card.Root key={file.id} variant="outline" _hover={{ borderColor: 'border.emphasized', shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s">
                    <Card.Body p="5">
                      <VStack align="stretch" gap="4">
                        <HStack justify="space-between" align="start">
                          <HStack gap="3" flex="1" minW="0">
                            <Box fontSize="2xl" color="blue.500" flexShrink={0}>
                              {file.type.startsWith('image/') ? '🖼️' : file.type.includes('pdf') ? '📄' : file.type.includes('text') ? '📝' : file.type.includes('video') ? '🎥' : file.type.includes('audio') ? '🎵' : '📁'}
                            </Box>
                            <Box flex="1" minW="0">
                              <Tooltip content={file.name}>
                                <Text fontWeight="semibold" fontSize="sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Text>
                              </Tooltip>
                              <Text fontSize="xs" color="fg.subtle" mt="1">{file.type || 'Unknown type'}</Text>
                            </Box>
                          </HStack>
                        </HStack>

                        <Box bg="bg.muted" borderRadius="md" p="3">
                          <VStack align="stretch" gap="2">
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="fg.subtle" fontWeight="medium">Kích thước:</Text>
                              <Text fontSize="xs" fontWeight="semibold">{formatFileSize(file.size)}</Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="xs" color="fg.subtle" fontWeight="medium">Upload:</Text>
                              <Text fontSize="xs" fontWeight="semibold">{formatDate(file.uploadDate)}</Text>
                            </HStack>
                          </VStack>
                        </Box>

                        <HStack gap="2">
                          <Button
                            size="sm"
                            variant="outline"
                            flex="1"
                            onClick={() => {
                              // Try direct url if available
                              if (file.url) {
                                const a = document.createElement('a');
                                a.href = file.url;
                                a.download = file.name;
                                a.click();
                                return;
                              }
                            }}
                          >
                            Tải xuống
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            flex="1"
                            onClick={async () => {
                              try {
                                const link = file.url || (await dataApi.getViewfileLink(file.id));
                                window.open(link, '_blank');
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                          >
                             Xem
                          </Button>
                        </HStack>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                ))}
              </Grid>
            )}
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}
