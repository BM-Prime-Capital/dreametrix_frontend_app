import React from "react";
import { Lightbulb, X } from "lucide-react";

interface HintDisplayProps {
  hintText: string;
  onClose: () => void;
  position?: "top-right" | "bottom-right" | "bottom-left" | "top-left"; // Or more specific positioning
}

const HintDisplay: React.FC<HintDisplayProps> = ({
  hintText,
  onClose,
  position = "bottom-right",
}) => {
  let positionClasses = "";
  switch (position) {
    case "top-right":
      positionClasses = "top-20 right-6"; // Adjusted top to avoid header overlap
      break;
    case "bottom-right":
      positionClasses = "bottom-28 right-6"; // Adjusted bottom to avoid footer overlap
      break;
    case "bottom-left":
      positionClasses = "bottom-28 left-6";
      break;
    case "top-left":
      positionClasses = "top-20 left-6";
      break;
  }

  return (
    <div
      className={`fixed ${positionClasses} bg-amber-100 border-2 border-amber-400 rounded-lg shadow-xl w-72 z-[70] p-4 flex flex-col animate-fadeIn`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Lightbulb size={20} className="mr-2 text-amber-600" />
          <span className="font-semibold text-amber-700">Hint</span>
        </div>
        <button
          onClick={onClose}
          className="text-amber-600 hover:text-amber-800 p-0.5 rounded hover:bg-amber-200"
          title="Close Hint"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-sm text-amber-800">{hintText}</p>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HintDisplay;
