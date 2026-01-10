export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
}

class CollectionsService {
  async fetchCollections(): Promise<CollectionItem[]> {
    try {
      const res = await fetch('/api/collections');
      // If server returned something but not JSON (for example an HTML error page), handle gracefully
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          try {
            const data = await res.json();
            console.log('📥 collections fetched from /api/collections:', data);
            return data as CollectionItem[];
          } catch (parseErr) {
            console.warn('⚠️ /api/collections returned non-JSON or malformed JSON, falling back. content-type:', ct, parseErr);
          }
        } else {
          console.warn('⚠️ /api/collections returned non-JSON content-type:', ct);
        }
      } else {
        console.warn('⚠️ /api/collections responded with status', res.status);
      }

      // fallback to demo file served from public/
      console.warn('⚠️ Falling back to /demo-collections.json');
      const demoRes = await fetch('/demo-collections.json');
      if (demoRes.ok) {
        const ct2 = demoRes.headers.get('content-type') || '';
        if (ct2.includes('application/json')) {
          try {
            const demoData = await demoRes.json();
            console.log('📥 collections fetched from demo-collections.json:', demoData);
            return demoData as CollectionItem[];
          } catch (parseErr) {
            console.error('❌ demo-collections.json is not valid JSON', parseErr);
          }
        } else {
          console.error('❌ demo-collections.json fetch returned non-json content-type:', ct2);
        }
      } else {
        console.error('❌ Failed to fetch /demo-collections.json, status', demoRes.status);
      }
      throw new Error('No collections available');
    } catch (err) {
      console.error('❌ Error fetching collections', err);
      return [];
    }
  }
}

export const collectionsService = new CollectionsService();
