import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';

interface DeleteSchoolDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  schoolName: string;
  isLoading?: boolean;
}

export function DeleteSchoolDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  schoolName, 
  isLoading = false 
}: DeleteSchoolDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete School"
      description={`Are you sure you want to delete "${schoolName}"? This action cannot be undone.`}
      size="sm"
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            This will permanently remove the school from the database.
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete School"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
