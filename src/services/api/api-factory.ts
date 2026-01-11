import { MockDataApi } from './mock-data-api';
import { MockChatApi } from './mock-chat-api';
import { RealDataApi } from './real-data-api';
import { RealChatApi } from './real-chat-api';
import { USE_MOCK_API } from './config';
import type { DataApi } from './data-api';
import type { ChatApi } from './chat-api';

let dataApiInstance: DataApi | null = null;
let chatApiInstance: ChatApi | null = null;

/**
 * Get Data API instance
 * - Mock: Sử dụng localStorage, không gọi server
 * - Real: Gọi backend server thật
 */
export function getDataApi(): DataApi {
  if (!dataApiInstance) {
    if (USE_MOCK_API) {
      console.log('📦 Using MockDataApi');
      dataApiInstance = new MockDataApi();
    } else {
      console.log('🚀 Using RealDataApi');
      dataApiInstance = new RealDataApi();
    }
  }
  return dataApiInstance;
}

/**
 * Get Chat API instance
 * - Mock: Trả về data từ answers.json, không gọi server
 * - Real: Gọi backend server thật với FormData
 */
export function getChatApi(): ChatApi {
  if (!chatApiInstance) {
    if (USE_MOCK_API) {
      console.log('💬 Using MockChatApi');
      chatApiInstance = new MockChatApi();
    } else {
      console.log('🚀 Using RealChatApi');
      chatApiInstance = new RealChatApi();
    }
  }
  return chatApiInstance;
}

/**
 * Reset API instances (useful for testing or switching modes)
 */
export function resetApiInstances(): void {
  dataApiInstance = null;
  chatApiInstance = null;
}

