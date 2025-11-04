import {
  Box,
  Button,
  Card,
  Grid,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { Tooltip } from './components/ui/tooltip';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  file: File;
}

export function DataManagement() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      file: file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    processFiles(files);
    
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Box flex="1" p="6" h="full" overflow="auto" minW="0">
      <VStack align="stretch" gap="6" maxW="none" w="full">
        {/* Header */}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb="2">
            Quản lý Data
          </Text>
          <Text color="fg.subtle">
            Upload, xem và quản lý các file của bạn
          </Text>
        </Box>

        {/* Upload Section */}
        <Card.Root w="full">
          <Card.Header>
            <Card.Title>Upload File</Card.Title>
          </Card.Header>
          <Card.Body>
            <VStack gap="6" align="stretch">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                display="none"
              />
              <Box 
                border="2px dashed" 
                borderColor={isDragOver ? "blue.500" : "border.muted"}
                borderRadius="lg" 
                p="8" 
                textAlign="center"
                bg={isDragOver ? "blue.50" : "transparent"}
                _hover={{ borderColor: "border.emphasized", bg: "bg.muted" }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <VStack gap="4">
                  <Box fontSize="3xl" color="fg.subtle">
                    📁
                  </Box>
                  <VStack gap="2">
                    <Text fontSize="lg" fontWeight="semibold">
                      Kéo thả file vào đây hoặc click để chọn
                    </Text>
                    <Text fontSize="sm" color="fg.subtle">
                      Hỗ trợ nhiều file cùng lúc. Tất cả các định dạng file đều được chấp nhận.
                    </Text>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Chọn File để Upload
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Files List */}
        <Card.Root w="full">
          <Card.Header>
            <HStack justify="space-between">
              <Card.Title>File đã Upload ({uploadedFiles.length})</Card.Title>
            </HStack>
          </Card.Header>
          <Card.Body>
            {uploadedFiles.length === 0 ? (
              <Box textAlign="center" py="12">
                <VStack gap="4">
                  <Box fontSize="4xl" color="fg.subtle">
                    📄
                  </Box>
                  <VStack gap="2">
                    <Text color="fg.subtle" fontSize="lg" fontWeight="semibold">
                      Chưa có file nào được upload
                    </Text>
                    <Text color="fg.subtle" fontSize="sm">
                      Sử dụng khu vực upload ở trên để thêm file của bạn
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            ) : (
              <Grid 
                templateColumns="repeat(auto-fill, minmax(320px, 1fr))" 
                gap="6" 
                w="full"
              >
                {uploadedFiles.map((file) => (
                  <Card.Root 
                    key={file.id} 
                    variant="outline"
                    _hover={{ 
                      borderColor: "border.emphasized", 
                      shadow: "md",
                      transform: "translateY(-2px)"
                    }}
                    transition="all 0.2s"
                  >
                    <Card.Body p="5">
                      <VStack align="stretch" gap="4">
                        <HStack justify="space-between" align="start">
                          <HStack gap="3" flex="1" minW="0">
                            <Box 
                              fontSize="2xl"
                              color="blue.500"
                              flexShrink={0}
                            >
                              {file.type.startsWith('image/') ? '🖼️' : 
                               file.type.includes('pdf') ? '📄' :
                               file.type.includes('text') ? '📝' :
                               file.type.includes('video') ? '🎥' :
                               file.type.includes('audio') ? '🎵' : '📁'}
                            </Box>
                            <Box flex="1" minW="0">
                              <Tooltip content={file.name}>
                                <Text
                                  fontWeight="semibold"
                                  fontSize="sm"
                                  style={{ 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap' 
                                  }}
                                >
                                  {file.name}
                                </Text>
                              </Tooltip>
                              <Text fontSize="xs" color="fg.subtle" mt="1">
                                {file.type || 'Unknown type'}
                              </Text>
                            </Box>
                          </HStack>
                          <Tooltip content="Xóa file">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteFile(file.id)}
                              _hover={{ bg: "red.50" }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                            </IconButton>
                          </Tooltip>
                        </HStack>
                        
                        <Box 
                          bg="bg.muted" 
                          borderRadius="md" 
                          p="3"
                        >
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
                              // Tạo URL để download file
                              const url = URL.createObjectURL(file.file);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = file.name;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            ⬇️ Tải xuống
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            flex="1"
                            onClick={() => {
                              // Mở file trong tab mới (nếu có thể xem được)
                              const url = URL.createObjectURL(file.file);
                              window.open(url, '_blank');
                            }}
                          >
                            👁️ Xem
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