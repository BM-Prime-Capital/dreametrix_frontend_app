"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  School as SchoolIcon,
  Edit,
  Trash,
  Loader2,
} from "lucide-react";
import { School } from "@/types";
import { Modal } from "@/components/ui/Modal";

export function SchoolDetailModal({
  isOpen,
  onClose,
  school,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  school: School;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <SchoolIcon className="h-5 w-5 text-blue-500" />
          {school.name}
        </div>
      }
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <SchoolIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">{school.name}</h3>
              <Badge
                variant={
                  school.status === "active"
                    ? "default"
                    : school.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
              </Badge>
            </div>

            {/* School details grid remains the same */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* ... detail items ... */}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}