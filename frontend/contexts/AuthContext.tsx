// 📄 frontend/contexts/AuthContext.tsx

'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
};


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {}, // ✅ stub συνάρτηση
});

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void; // ✅ required
  loading: boolean;
};


export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        // ✅ Πρώτα εξασφαλίζουμε ότι έχουμε CSRF token
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf/`, {
          credentials: 'include',
        });
  
        // ✅ Μετά κάνουμε έλεγχο ταυτότητας
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/`, {
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
  }, []);
  


  const contextValue = useMemo(() => ({ user, loading, setUser }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
