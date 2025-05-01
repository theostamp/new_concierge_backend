// frontend/components/LogoutButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useCsrf from '@/hooks/useCsrf';

export default function LogoutButton() {
  const router = useRouter();
  const csrfToken = useCsrf(); // ✅ Φέρνει το CSRF token από το cookie

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken ?? '', // ✅ Χρήση του token
        },
      });

      if (!res.ok) throw new Error('Αποτυχία αποσύνδεσης');

      toast.success('Αποσυνδεθήκατε');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="w-full">
      Αποσύνδεση
    </Button>
  );
}
