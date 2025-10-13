import "./globals.css";
import type { Metadata } from "next";
import ReduxProvider from "@/app/ReduxProvider";
import { Toaster } from "@/components/ui/toaster";

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
      <body>
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
