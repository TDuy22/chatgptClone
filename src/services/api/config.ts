/**
 * API Configuration
 * 
 * TODO: Backend team cần cung cấp:
 * - BASE_URL: URL của backend server
 * - Các endpoint paths nếu khác với mặc định
 */

export const API_CONFIG = {
  // TODO: Thay đổi khi có URL backend thật
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  ENDPOINTS: {
    // QA endpoint - Hỏi đáp
    QA: '/qa',
    
    // Indexing endpoint - Upload files
    INDEXING: '/indexing',
  },
  
  // Timeout cho requests (ms)
  TIMEOUT: 60000, // 60 seconds cho QA vì có thể mất thời gian xử lý
  
  // Max file size (bytes)
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
};

/**
 * Kiểm tra có đang dùng mock hay không
 * Set VITE_USE_MOCK=false trong .env để dùng real API
 */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK !== 'false';
