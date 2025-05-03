// 📄 frontend/contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBaseUrl } from '@/lib/config'; // ✅ χρησιμοποίησε αυτό

type User = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const baseUrl = getBaseUrl(); // ✅ Χρήση της ασφαλούς συνάρτησης

        // CSRF first
        await fetch(`${baseUrl}/csrf/`, {
          credentials: 'include',
        });

        // Then fetch user
        const res = await fetch(`${baseUrl}/users/me/`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Not authenticated');
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.warn('Authentication failed:', err);
        setUser(null);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const contextValue = useMemo(() => ({ user, loading, setUser }), [user, loading]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
