"use client";

import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <main className="flex flex-col gap-4 min-h-screen bg-gray-100">
        <Header />
        <div className="px-20">{children}</div>
      </main>
    </div>
  );
}
