// components/Support/SupportSidebarLinks.tsx
import Link from "next/link";
import { HelpCircle, FilePlus, FolderOpen } from "lucide-react";

export default function SupportSidebarLinks() {
  return (
    <aside className="space-y-3">
      <Link href="/support/faq" className="flex items-center gap-2 text-blue-700 hover:underline">
        <HelpCircle className="w-4 h-4" /> FAQ
      </Link>
      <Link href="/support/new" className="flex items-center gap-2 text-blue-700 hover:underline">
        <FilePlus className="w-4 h-4" /> Nouveau ticket
      </Link>
      <Link href="/support/my-tickets" className="flex items-center gap-2 text-blue-700 hover:underline">
        <FolderOpen className="w-4 h-4" /> Mes tickets
      </Link>
    </aside>
  );
}
