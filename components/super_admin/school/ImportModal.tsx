"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUp, X } from "lucide-react";
import { Modal } from "@/components/ui//Modal";

type ImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
};

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      setIsLoading(true);
      try {
        await onImport(file);
        onClose();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Schools"
      description="Upload a CSV file containing school data. Download the template for reference."
      size="md"
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="file" className="text-right">
            CSV File
          </Label>
          <div className="col-span-3">
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {file ? file.name : "No file selected"}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="gap-2"
          >
            <FileUp className="h-4 w-4" />
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}