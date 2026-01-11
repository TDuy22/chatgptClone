import type { ChatApi, ChatRequest, ChatResponse, BackendAnswer } from './chat-api';
import { transformBackendAnswers } from './chat-api';
import { API_CONFIG } from './config';

/**
 * Real Chat API - Gọi backend thật
 * 
 * Backend endpoint: POST /qa
 * Request: FormData với collection_name và question
 * Response: List[{text: string, file_citation: string[]}]
 */
export class RealChatApi implements ChatApi {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  async chat(req: ChatRequest): Promise<ChatResponse> {
    const collectionName = req.collection?.name || req.collection?.id || '';
    const question = req.Question || '';

    console.log('🚀 Calling QA API:', {
      url: `${this.baseURL}${API_CONFIG.ENDPOINTS.QA}`,
      collection_name: collectionName,
      question: question
    });

    // Backend yêu cầu FormData, không phải JSON
    const formData = new FormData();
    formData.append('collection_name', collectionName);
    formData.append('question', question);

    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.QA}`, {
        method: 'POST',
        body: formData,
        // Không set Content-Type header khi dùng FormData
        // Browser sẽ tự động set đúng boundary
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ QA API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // Backend trả về: List[{text: string, file_citation: string[]}]
      const backendAnswers: BackendAnswer[] = await response.json();
      
      console.log('✅ QA API Response:', backendAnswers);

      // Transform backend format to frontend format
      const { blocks, sources } = transformBackendAnswers(backendAnswers, collectionName);

      // Build combined answer text for backward compatibility
      const answerText = blocks
        .filter(b => b.type === 'markdown')
        .map(b => (b as { type: 'markdown'; body: string }).body)
        .join('\n\n');

      return { 
        Answer: answerText,
        Citation: sources.map(s => ({
          file_id: s.id,
          file_name: s.fileName,
          file_link: s.fileUrl
        })),
        blocks,
        sources
      };

    } catch (error) {
      console.error('❌ QA API Error:', error);
      throw error;
    }
  }
}
