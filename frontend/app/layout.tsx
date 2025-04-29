// frontend/app/layout.tsx
import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import "@/app/globals.css";

export const metadata = {
  title: "Ψηφιακός Θυρωρός",
  description: "PWA Διαχείριση Πολυκατοικίας",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="el">
      <body className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
