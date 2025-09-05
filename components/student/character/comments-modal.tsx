"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CharacterRating } from "@/types/character"
import { X } from "lucide-react"

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: CharacterRating | null;
}

export function CommentsModal({ isOpen, onClose, selectedItem }: CommentsModalProps) {
  if (!selectedItem) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const allComments = [];
  
  // Add good behaviors as positive comments
  selectedItem.good_statistics_character.forEach((behavior, index) => {
    allComments.push({
      id: `good-${index}`,
      type: 'positive' as const,
      text: behavior,
      date: formatDate(selectedItem.date),
    });
  });

  // Add bad behaviors as negative comments
  selectedItem.bad_statistics_character.forEach((behavior, index) => {
    allComments.push({
      id: `bad-${index}`,
      type: 'negative' as const,
      text: behavior,
      date: formatDate(selectedItem.date),
    });
  });

  // Add teacher comments
  if (selectedItem.teacher_comment_good_character.trim()) {
    allComments.push({
      id: 'teacher-good',
      type: 'positive' as const,
      text: selectedItem.teacher_comment_good_character,
      date: formatDate(selectedItem.date),
    });
  }

  if (selectedItem.teacher_comment_bad_character.trim()) {
    allComments.push({
      id: 'teacher-bad',
      type: 'negative' as const,
      text: selectedItem.teacher_comment_bad_character,
      date: formatDate(selectedItem.date),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-700">Comments</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors" 
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="border-t mb-4"></div>

          <div className="text-gray-500 mb-4">
            Class {selectedItem.class_info} - {selectedItem.period} - {formatDate(selectedItem.date)}
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {allComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No comments available for this record.</p>
              </div>
            ) : (
              allComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md font-bold ${
                      comment.type === "positive" ? "bg-[#4CAF50]" : "bg-[#FF5252]"
                    }`}
                  >
                    {comment.type === "positive" ? "+" : "-"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">{comment.date}</div>
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedItem.sanctions && selectedItem.sanctions.trim() && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Sanctions</h4>
              <p className="text-orange-700">{selectedItem.sanctions}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}