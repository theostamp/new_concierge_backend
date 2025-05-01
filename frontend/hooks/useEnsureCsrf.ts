'use client';

import { useEffect, useState } from 'react';

export default function useEnsureCsrf(): boolean {
  const [csrfLoaded, setCsrfLoaded] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf/`, {
      credentials: 'include',
    })
      .then(() => setCsrfLoaded(true))
      .catch(() => setCsrfLoaded(false));
  }, []);

  return csrfLoaded;
}
