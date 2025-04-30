'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "/icons/dashboard.png" },
  { href: "/announcements", label: "Ανακοινώσεις", icon: "/icons/announcements.png" },
  { href: "/votes", label: "Ψηφοφορίες", icon: "/icons/votes.png" },
  { href: "/requests", label: "Αιτήματα", icon: "/icons/requests.png" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-md flex flex-col p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Θυρωρός</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <Image
                src={link.icon}
                alt={link.label}
                width={20}
                height={20}
                className="flex-shrink-0"
              />
              <span>{link.label}</span>
            </Link>
  );
})}
<button
  onClick={() => document.documentElement.classList.toggle("dark")}
  className="mt-auto text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
>
  Εναλλαγή θέματος
</button>
      </nav>
    </aside>
  );
}
