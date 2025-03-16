import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "@/app/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreaMetrix",
  description: "A platform for Students and Teachers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
