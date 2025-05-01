// frontend/hooks/useCsrf.ts

'use client';

import { useEffect, useState } from 'react';

export default function useCsrf() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf/`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('CSRF fetch failed');

        await res.json();
        const token = getCookie('csrftoken');
        setCsrfToken(token);
      } catch (err) {
        console.error('CSRF error:', err);
      }
    };

    fetchToken();
  }, []);

  return csrfToken;

}

function getCookie(name: string): string | null {
  const regex = new RegExp('(^| )' + name + '=([^;]+)');
  const match = regex.exec(document.cookie);
  if (match) return match[2];
  return null;
}
