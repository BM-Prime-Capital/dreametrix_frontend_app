import { Plus, MessageSquare, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PageTitleH1 from "@/components/ui/page-title-h1";

interface HeaderProps {
  onOpenCompose: () => void;
  onOpenAnnounce: () => void;
  isStudent?: boolean;
}

export function Header({ onOpenCompose, onOpenAnnounce, isStudent = false }: HeaderProps) {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 px-6 py-5 rounded-xl shadow-lg overflow-hidden relative animate-fade-in">
      <div className="absolute inset-0 bg-[url('/assets/images/bg.png')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-500/80 to-pink-500/80"></div>

      <div className="flex items-center gap-3 relative z-10">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm shadow-inner border border-white/30">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <PageTitleH1
            title={isStudent ? "Student Communication" : "Communication Center"}
            className="text-white font-bold"
          />
          <p className="text-blue-100 text-sm mt-1">
            {isStudent ? "Connect with teachers and classmates" : "Connect with students, parents & colleagues"}
          </p>
        </div>
      </div>

      {/* Masquer les boutons pour les students */}
      {!isStudent && (
        <div className="flex gap-3 relative z-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-md border border-white/30 font-medium"
                onClick={onOpenCompose}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 shadow-md font-medium"
                onClick={onOpenAnnounce}
              >
                <Megaphone className="h-4 w-4 mr-2" />
                Announcement
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </div>
  );
}