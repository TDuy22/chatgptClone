import type { ChatApi, ChatRequest, ChatResponse, Citation } from './chat-api';

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
    // simple heuristic answer
    const answer = req.Question?.trim()
      ? `Bạn vừa hỏi: "${req.Question}". Đây là câu trả lời mẫu từ MockChatApi.`
      : 'Đây là câu trả lời mẫu từ MockChatApi.';

    // build citations from selected collection if available
    const citations: Citation[] = [];
    if (req.collection?.id || req.collection?.name) {
      const cols = loadCollections();
      const col = req.collection.id
        ? cols.find((c) => c.id === req.collection!.id)
        : cols.find((c) => c.name?.toLowerCase() === (req.collection!.name || '').toLowerCase());
      if (col) {
        const files = loadFiles(col.id).slice(0, 3); // include up to 3 files
        for (const f of files) {
          citations.push({ file_id: f.id, file_name: f.name, file_link: f.dataUrl });
        }
      }
    }

    return { Answer: answer, Citation: citations };
  }
}
