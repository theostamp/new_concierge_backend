// frontend/components/Sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LogoutButton from '@/components/LogoutButton';
import useCsrf from '@/hooks/useCsrf';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { href: '/dashboard', label: 'Πίνακας Ελέγχου' },
  { href: '/announcements', label: 'Ανακοινώσεις' },
  { href: '/votes', label: 'Ψηφοφορίες' },
  { href: '/requests', label: 'Αιτήματα' },
];

export function Sidebar() {
  const pathname = usePathname();
  useCsrf();
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-md flex flex-col justify-between min-h-screen">
      {/* Πλοήγηση */}
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800',
              pathname === link.href
                ? 'bg-gray-200 dark:bg-gray-800 font-semibold'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

{/* Κάτω μέρος */}
<div className="bg-gray-50 dark:bg-gray-800 text-center text-sm text-gray-700 dark:text-gray-300 p-4">
  {user ? (
    <>
      <div className="mb-2">
        Συνδεδεμένος ως:{' '}
        <strong>
          {user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.username}
        </strong>
      </div>
      <LogoutButton />
    </>
  ) : (
    <Link
      href="/login"
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      Σύνδεση
    </Link>
  )}
</div>
  
      </aside>
    );
  }