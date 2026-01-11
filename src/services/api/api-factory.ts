import { MockDataApi } from './mock-data-api';
import { MockChatApi } from './mock-chat-api';
import type { DataApi } from './data-api';
import type { ChatApi } from './chat-api';

let dataApiInstance: DataApi | null = null;
let chatApiInstance: ChatApi | null = null;

export function getDataApi(): DataApi {
  // For now, always use mock (Option A). Later, switch based on env flag.
  if (!dataApiInstance) {
    dataApiInstance = new MockDataApi();
  }
  return dataApiInstance;
}

export function getChatApi(): ChatApi {
  if (!chatApiInstance) {
    chatApiInstance = new MockChatApi();
  }
  return chatApiInstance;
}
