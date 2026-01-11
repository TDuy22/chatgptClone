import type { ContentBlock, Source } from '../demo-response-service';

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

/**
 * Format từ backend (answers.json)
 */
export interface BackendAnswer {
  text: string;              // Markdown text
  file_citation: string[];   // Danh sách tên file
}

export interface ChatResponse {
  Answer: string;
  Citation: Citation[];
  // New format support
  blocks?: ContentBlock[];
  sources?: Source[];
}

export interface ChatApi {
  chat(req: ChatRequest): Promise<ChatResponse>;
}

/**
 * Chuyển đổi từ format backend (answers.json) sang format frontend
 */
export function transformBackendAnswers(
  answers: BackendAnswer[],
  collectionName?: string
): { blocks: ContentBlock[]; sources: Source[] } {
  const blocks: ContentBlock[] = [];
  const sources: Source[] = [];
  const seenFiles = new Set<string>(); // Tránh duplicate cho tổng hợp
  let globalSourceId = 1;

  answers.forEach((answer) => {
    // 1. Tạo blockSources riêng cho block này
    const blockSources: Source[] = [];
    
    answer.file_citation?.forEach((fileName) => {
      const sourceId = `${globalSourceId++}`;
      const source: Source = {
        id: sourceId,
        fileName: fileName,
        pageNumber: 1,
        fileUrl: collectionName 
          ? `/uploads/${collectionName}/${fileName}` 
          : `/uploads/${fileName}`,
        snippet: fileName
      };
      
      // Thêm vào blockSources
      blockSources.push(source);
      
      // Thêm vào tổng hợp sources (tránh duplicate)
      if (!seenFiles.has(fileName)) {
        seenFiles.add(fileName);
        sources.push(source);
      }
    });

    // 2. Thêm markdown block với blockSources
    if (answer.text?.trim()) {
      blocks.push({
        type: 'markdown',
        body: answer.text,
        blockSources: blockSources.length > 0 ? blockSources : undefined
      });
    }
  });

  return { blocks, sources };
}
