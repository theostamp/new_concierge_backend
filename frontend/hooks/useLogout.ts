// frontend/hooks/useLogout.ts

'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useCsrf from './useCsrf';

export default function useLogout() {
  const router = useRouter();
  const csrfToken = useCsrf();

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken ?? '',
        },
      });

      if (!res.ok) throw new Error('Σφάλμα αποσύνδεσης');

      toast.success('Αποσυνδεθήκατε');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return logout;
}
