import "./globals.css";
import type { Metadata } from "next";
import ReduxProvider from "@/app/ReduxProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

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
        <SonnerToaster position="top-right" />
      </body>
    </html>
  );
}
