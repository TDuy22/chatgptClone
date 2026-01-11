export interface ChatHistoryItem {
  Question: string;
  Answer: string;
}

export interface ChatRequest {
  Question: string;
  chat_history?: ChatHistoryItem[];
  collection?: {
    id?: string;
    name?: string;
  };
}

export interface Citation {
  file_id: string;
  file_name: string;
  file_link: string;
}

export interface ChatResponse {
  Answer: string;
  Citation: Citation[];
}

export interface ChatApi {
  chat(req: ChatRequest): Promise<ChatResponse>;
}
