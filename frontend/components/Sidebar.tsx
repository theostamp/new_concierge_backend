// frontend/components/Sidebar.tsx
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
    <nav className="w-60 bg-white shadow-md flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Θυρωρός</h1>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center mb-4 p-2 rounded-lg transition ${
            pathname === link.href
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Image
            src={link.icon}
            alt={link.label}
            width={24}
            height={24}
            className="mr-3"
          />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
