// frontend/hooks/useCsrf.ts
import { useEffect } from 'react';
import { getBaseUrl } from '@/lib/config';

export default function useCsrf() {
  useEffect(() => {
    async function fetchToken() {
      const baseUrl = getBaseUrl();
      if (!baseUrl) {
        console.error('❌ NEXT_PUBLIC_API_BASE_URL is not set');
        return;
      }
      const res = await fetch(`${baseUrl}/csrf/`, {
        credentials: 'include',
      });
      if (!res.ok) {
        console.error('❌ CSRF fetch failed:', res.status, await res.text());
        throw new Error('CSRF fetch failed');
      }
    }

    fetchToken().catch((err) => {
      // προαιρετικά log
      console.error(err);
    });
  }, []);
}
