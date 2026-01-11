// Service để quản lý demo responses từ file JSON
export interface Source {
  id: string;
  fileName: string;
  pageNumber: number;
  fileUrl: string;
  snippet: string;
}

export interface TableHeader {
  key: string;
  title: string;
}

export interface TableRow {
  [key: string]: string;
}

export interface TableData {
  headers: TableHeader[];
  rows: TableRow[];
}

export interface MarkdownBlock {
  type: 'markdown';
  body: string;
  blockSources?: Source[]; // Sources specific to this block
}

export interface TableBlock {
  type: 'table';
  data: TableData;
  blockSources?: Source[]; // Sources specific to this block
}

export type ContentBlock = MarkdownBlock | TableBlock;

export interface MessageContent {
  blocks: ContentBlock[];
  sources?: Source[];
}

export interface DemoResponse {
  messageId: string;
  sender: 'bot' | 'user';
  timestamp: string;
  content: MessageContent;
}

class DemoResponseService {
  private responses: DemoResponse[] = [];
  private currentIndex = 0;
  private isLoaded = false;

  async loadResponses(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('/demo-chat-response.json');
      if (!response.ok) {
        throw new Error('Failed to load demo responses');
      }
      
      const data = await response.json();
      console.log('📥 Raw data from JSON:', data);
      
      // Chỉ lấy responses từ bot
      this.responses = data.filter((item: DemoResponse) => item.sender === 'bot');
      this.isLoaded = true;
      
      console.log('✅ Loaded', this.responses.length, 'demo responses');
      console.log('📚 First response:', JSON.stringify(this.responses[0], null, 2));
      console.log('📚 First response sources:', this.responses[0]?.content?.sources);
    } catch (error) {
      console.error('❌ Error loading demo responses:', error);
      // Fallback responses nếu không load được file
      this.responses = [
        {
          messageId: 'fallback_1',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          content: {
            blocks: [
              {
                type: 'markdown',
                body: 'Đây là câu trả lời mẫu từ ChatGPT. File demo-chat-response.json không load được.'
              }
            ],
            sources: []
          }
        }
      ];
      this.isLoaded = true;
    }
  }

  /**
   * Get next response with sources.
   * Returns both content blocks and sources together to avoid index mismatch.
   */
  getNextResponseWithSources(): { blocks: ContentBlock[]; sources: Source[] } {
    if (!this.isLoaded || this.responses.length === 0) {
      return { 
        blocks: [{ type: 'markdown', body: 'Đang tải dữ liệu...' }], 
        sources: [] 
      };
    }

    const response = this.responses[this.currentIndex];
    
    console.log(`📦 getNextResponseWithSources - currentIndex: ${this.currentIndex}/${this.responses.length}`);
    console.log('📦 Response:', response);
    console.log('📦 Blocks COUNT:', response.content.blocks?.length || 0);
    console.log('📦 Blocks:', response.content.blocks);
    console.log('📦 Sources COUNT:', response.content.sources?.length || 0);
    console.log('📦 Sources:', response.content.sources);
    
    // Di chuyển đến response tiếp theo
    this.currentIndex = (this.currentIndex + 1) % this.responses.length;
    
    return {
      blocks: response.content.blocks || [],
      sources: response.content.sources || []
    };
  }

  reset(): void {
    this.currentIndex = 0;
    console.log('🔄 Reset demo response index');
  }

  getTotalResponses(): number {
    return this.responses.length;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }
}

// Singleton instance
export const demoResponseService = new DemoResponseService();
