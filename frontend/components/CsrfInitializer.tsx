'use client';

import { useEffect } from 'react';

export default function CsrfInitializer() {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf/`, {
      credentials: 'include',
    }).catch((err) => {
      console.warn('CSRF token fetch failed:', err);
    });
  }, []);

  return null;
}
