'use client';

import { useEffect } from 'react';
import useLogout from '@/hooks/useLogout';

export default function LogoutPage() {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <p className="text-center mt-10 text-gray-500">🚪 Αποσυνδέεστε...</p>
  );
}
