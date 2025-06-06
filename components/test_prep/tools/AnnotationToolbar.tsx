import React from "react";
import { Highlighter, Eraser as EraserIcon, Trash2 } from "lucide-react";
import EraserTool from "./EraserTool";

export type AnnotationToolType = "highlighter" | "eraser" | null;

interface AnnotationToolbarProps {
  targetRef: React.RefObject<HTMLElement>; // Ref to the content area to be annotated
  imageRef?: React.RefObject<HTMLImageElement>; // Ref to the main image for canvas overlay
  activeTool: AnnotationToolType;
  setActiveTool: (tool: AnnotationToolType) => void;
  highlightColor: string;
  setHighlightColor: (color: string) => void;
  onClearHighlights?: () => void; // Optional callback to clear highlights
}
const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  targetRef,
  imageRef,
  activeTool,
  setActiveTool,
  highlightColor,
  setHighlightColor,
  onClearHighlights,
}) => {
  // Available colors for highlighting (all semi-transparent)
  const availableColors = [
    { name: "Yellow", value: "rgba(255, 255, 0, 0.4)" },
    { name: "Green", value: "rgba(173, 255, 47, 0.4)" },
    { name: "Blue", value: "rgba(173, 216, 230, 0.4)" },
    { name: "Pink", value: "rgba(255, 182, 193, 0.4)" },
    { name: "Purple", value: "rgba(230, 230, 250, 0.4)" },
    { name: "Orange", value: "rgba(255, 165, 0, 0.4)" },
  ];

  // Clear all highlights
  const handleClearHighlights = () => {
    if (onClearHighlights) {
      onClearHighlights();
    } else if (
      targetRef.current &&
      (targetRef.current as any).clearHighlights
    ) {
      // Fallback to legacy approach
      (targetRef.current as any).clearHighlights();
    }
  };

  return (
    <div className="annotation-toolbar bg-white border border-gray-200 p-3 rounded-lg shadow-md flex items-center space-x-3">
      {/* Tool Selection Buttons */}
      <div className="flex items-center space-x-2">
        <button
          title="Canvas Highlighter Tool"
          onClick={() =>
            setActiveTool(activeTool === "highlighter" ? null : "highlighter")
          }
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            activeTool === "highlighter"
              ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Highlighter size={20} />
        </button>

        <button
          title="Eraser Tool (for text highlights)"
          onClick={() =>
            setActiveTool(activeTool === "eraser" ? null : "eraser")
          }
          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            activeTool === "eraser"
              ? "bg-red-100 text-red-700 ring-2 ring-red-300"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <EraserIcon size={20} />
        </button>

        <button
          title="Clear All Highlights"
          onClick={handleClearHighlights}
          className="p-2 rounded-lg transition-all duration-200 hover:scale-105 text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Color Picker - visible only if highlighter is active */}
      {activeTool === "highlighter" && (
        <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-gray-200">
          <span className="text-sm font-medium text-gray-600">Color:</span>
          <div className="flex items-center space-x-1">
            {availableColors.map((colorOption) => (
              <button
                key={colorOption.name}
                title={`Highlight ${colorOption.name}`}
                onClick={() => setHighlightColor(colorOption.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  highlightColor === colorOption.value
                    ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{
                  backgroundColor: colorOption.value.replace("0.4", "0.8"), // Make preview more opaque
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tool Status */}
      {activeTool && (
        <div className="ml-3 pl-3 border-l border-gray-200">
          <span className="text-sm text-gray-500">
            {activeTool === "highlighter"
              ? "Draw on image to highlight"
              : "Click highlighted text to remove"}
          </span>
        </div>
      )}

      {/* Eraser tool is still rendered here for text highlighting */}
      {activeTool === "eraser" && (
        <EraserTool
          targetRef={targetRef}
          highlightClassName="user-highlight"
          isActive={true}
        />
      )}
    </div>
  );
};

export default AnnotationToolbar;
