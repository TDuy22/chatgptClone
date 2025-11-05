// Service để quản lý demo responses từ file JSON
export interface Source {
  id: string;
  fileName: string;
  pageNumber: number;
  fileUrl: string;
  snippet: string;
}

export interface DemoResponse {
  messageId: string;
  sender: 'bot' | 'user';
  timestamp: string;
  content: {
    answer: string;
    sources?: Source[];
  };
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
      // Chỉ lấy responses từ bot
      this.responses = data.filter((item: DemoResponse) => item.sender === 'bot');
      this.isLoaded = true;
      
      console.log('✅ Loaded', this.responses.length, 'demo responses');
    } catch (error) {
      console.error('❌ Error loading demo responses:', error);
      // Fallback responses nếu không load được file
      this.responses = [
        {
          messageId: 'fallback_1',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          content: {
            answer: 'Đây là câu trả lời mẫu từ ChatGPT. File demo-chat-response.json không load được.',
            sources: []
          }
        }
      ];
      this.isLoaded = true;
    }
  }

  getNextResponse(): string {
    if (!this.isLoaded || this.responses.length === 0) {
      return 'Đang tải dữ liệu...';
    }

    const response = this.responses[this.currentIndex];
    
    // Di chuyển đến response tiếp theo (loop lại nếu hết)
    this.currentIndex = (this.currentIndex + 1) % this.responses.length;
    
    console.log(`📝 Response ${this.currentIndex}/${this.responses.length}:`, response.content.answer.substring(0, 50) + '...');
    
    return response.content.answer;
  }

  // Method mới: Trả về full response với sources
  getNextResponseWithSources(): { answer: string; sources?: Source[] } {
    if (!this.isLoaded || this.responses.length === 0) {
      return { answer: 'Đang tải dữ liệu...', sources: [] };
    }

    const response = this.responses[this.currentIndex];
    
    // Di chuyển đến response tiếp theo (loop lại nếu hết)
    this.currentIndex = (this.currentIndex + 1) % this.responses.length;
    
    console.log(`📝 Response ${this.currentIndex}/${this.responses.length}:`, response.content.answer.substring(0, 50) + '...');
    console.log(`📚 Sources:`, response.content.sources?.length || 0);
    
    return response.content;
  }

  getCurrentResponseWithSources(): DemoResponse | null {
    if (!this.isLoaded || this.responses.length === 0) {
      return null;
    }

    // Lấy response trước đó (vừa được trả về)
    const prevIndex = this.currentIndex === 0 
      ? this.responses.length - 1 
      : this.currentIndex - 1;
    
    return this.responses[prevIndex];
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
