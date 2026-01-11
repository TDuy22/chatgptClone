import type { ChatApi, ChatRequest, ChatResponse, BackendAnswer } from './chat-api';
import { transformBackendAnswers } from './chat-api';

// reuse same localStorage keys as mock-data-api
const COLLECTIONS_KEY = 'mock_collections';
const FILES_KEY_PREFIX = 'mock_files_';

interface StoredCollection { id: string; name: string; createdAt: string }
interface StoredFile { id: string; name: string; size: number; type: string; uploadDate: string; dataUrl: string }

function loadCollections(): StoredCollection[] {
  const raw = localStorage.getItem(COLLECTIONS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}
function loadFiles(collectionId: string): StoredFile[] {
  const raw = localStorage.getItem(`${FILES_KEY_PREFIX}${collectionId}`);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export class MockChatApi implements ChatApi {
  async chat(req: ChatRequest): Promise<ChatResponse> {
    // Simulate loading from answers.json format
    let backendAnswers: BackendAnswer[] = [];
    
    try {
      // Try to load from answers.json for demo
      const response = await fetch('/answers.json');
      if (response.ok) {
        const data = await response.json();
        // Take first 2 answers as demo response
        backendAnswers = Array.isArray(data) ? data.slice(0, 2) : [];
      }
    } catch (error) {
      console.log('Using fallback response');
    }

    // Fallback if no answers loaded
    if (backendAnswers.length === 0) {
      // Build citations from selected collection if available
      const fileCitations: string[] = [];
      if (req.collection?.id || req.collection?.name) {
        const cols = loadCollections();
        const col = req.collection.id
          ? cols.find((c) => c.id === req.collection!.id)
          : cols.find((c) => c.name?.toLowerCase() === (req.collection!.name || '').toLowerCase());
        if (col) {
          const files = loadFiles(col.id).slice(0, 3);
          fileCitations.push(...files.map(f => f.name));
        }
      }

      backendAnswers = [
        {
          text: req.Question?.trim()
            ? `### Câu trả lời cho: "${req.Question}"\n\nĐây là câu trả lời mẫu từ MockChatApi. Khi kết nối backend thật, nội dung sẽ được lấy từ hệ thống RAG.`
            : '### Câu trả lời mẫu\n\nĐây là câu trả lời mẫu từ MockChatApi.',
          file_citation: fileCitations
        }
      ];
    }

    // Transform backend format to frontend format
    const collectionName = req.collection?.name || req.collection?.id;
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
  }
}
