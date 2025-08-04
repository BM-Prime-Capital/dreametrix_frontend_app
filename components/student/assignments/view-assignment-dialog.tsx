"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { Assignment } from "@/app/api/student/assignment/assignment.model";

interface ViewAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
}
export function ViewAssignmentDialog({
  isOpen,
  onClose,
  assignment,
}: ViewAssignmentDialogProps) {
  const handleDownloadFile = () => {
    if (assignment?.file) {

      //Create a link to download the file
      const link = document.createElement("a");
      link.href = assignment.file;
      link.download = `${assignment.name}.pdf`; // ou l'extension appropriée
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderFileContent = () => {
    if (!assignment?.file) {
      return (
        <div className="text-gray-500 text-center py-8">
          No file available for this assignment.
        </div>
      );
    }

    // Si c'est un PDF ou une image, on peut l'afficher
    const fileExtension = assignment.file.split(".").pop()?.toLowerCase();

    if (fileExtension === "pdf") {
      return (
        <div className="w-full h-full">
          <iframe
            src={assignment.file}
            className="w-full h-[400px] border-0"
            title={`${assignment.name} - Assignment File`}
          />
        </div>
      );
    } else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension || "")) {
      return (
        <div className="text-center">
          <img
            src={assignment.file}
            alt={assignment.name}
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      );
    } else {
      // Pour d'autres types de fichiers, afficher un lien de téléchargement
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Assignment file: {assignment.file.split("/").pop()}
          </p>
          <Button
            onClick={handleDownloadFile}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden gap-0 bg-gray-50">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-700">Assignment</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              {/*<X className="h-4 w-4" />*/}
            </Button>
          </div>
        </DialogHeader>
        <div className="px-4 pb-4 space-y-4">
          <div className="text-gray-500 text-sm">
            {assignment?.name}
            <br />
            {assignment?.kind}
          </div>

          <div className="bg-white rounded-lg p-4 min-h-[200px]">
            {renderFileContent()}
          </div>

          <div className="flex justify-center items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-purple-500"
              onClick={handleDownloadFile}
              disabled={!assignment?.file}
              title="Download Assignment File"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#25AAE1]"
              onClick={() => window.print()}
              title="Print Assignment"
            >
              <Printer className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>1/4</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
