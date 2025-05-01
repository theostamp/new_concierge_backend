// frontend/components/Sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import LogoutButton from '@/components/LogoutButton';
import useCsrf from '@/hooks/useCsrf';

const links = [
  { href: '/dashboard', label: 'Πίνακας Ελέγχου' },
  { href: '/announcements', label: 'Ανακοινώσεις' },
  { href: '/votes', label: 'Ψηφοφορίες' },
  { href: '/requests', label: 'Αιτήματα' },
];

export function Sidebar() {
  const pathname = usePathname();
  useCsrf(); // ✅ Ενεργοποίηση CSRF fetch

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col justify-between min-h-screen">
      <nav className="space-y-2">
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

      <div className="mt-10">
        <LogoutButton />
      </div>
    </aside>
  );
}
