import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../../app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreaMetrix - School Dashboard",
  description: "School Management Dashboard",
};

export default function SchoolAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
