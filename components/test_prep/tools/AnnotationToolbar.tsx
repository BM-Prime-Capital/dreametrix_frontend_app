import React, { useState } from "react";
import { Highlighter, Eraser as EraserIcon } from "lucide-react"; // Assuming you use lucide-react for icons
import HighlighterTool from "./HighlighterTool";
import EraserTool from "./EraserTool";

export type AnnotationToolType = "highlighter" | "eraser" | null;

interface AnnotationToolbarProps {
  targetRef: React.RefObject<HTMLElement>; // Ref to the content area to be annotated
  // Add other props as needed, e.g., available highlight colors
}

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({ targetRef }) => {
  const [activeTool, setActiveTool] = useState<AnnotationToolType>(null);
  const [highlightColor, setHighlightColor] = useState<string>("yellow"); // Default highlight color

  // Add more colors if needed
  const availableColors = [
    "yellow",
    "#ADFF2F",
    "#ADD8E6",
    "#FFB6C1",
    "#E6E6FA",
  ];

  return (
    <div className="annotation-toolbar bg-gray-100 p-2 rounded-md shadow-md flex items-center space-x-2">
      <button
        title="Highlighter Tool"
        onClick={() =>
          setActiveTool(activeTool === "highlighter" ? null : "highlighter")
        }
        className={`p-2 rounded hover:bg-gray-200 ${
          activeTool === "highlighter"
            ? "bg-blue-200 text-blue-700"
            : "text-gray-700"
        }`}
      >
        <Highlighter size={20} />
      </button>

      <button
        title="Eraser Tool"
        onClick={() => setActiveTool(activeTool === "eraser" ? null : "eraser")}
        className={`p-2 rounded hover:bg-gray-200 ${
          activeTool === "eraser"
            ? "bg-blue-200 text-blue-700"
            : "text-gray-700"
        }`}
      >
        <EraserIcon size={20} />
      </button>

      {/* Color Picker - visible only if highlighter is active or no tool is active (to set default) */}
      {(activeTool === "highlighter" || activeTool === null) && (
        <div className="flex items-center space-x-1 ml-2">
          <span className="text-sm text-gray-600">Color:</span>
          {availableColors.map((color) => (
            <button
              key={color}
              title={`Highlight ${color}`}
              onClick={() => setHighlightColor(color)}
              className={`w-6 h-6 rounded-full border-2 ${
                highlightColor === color
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Render active tool component - these components are now mostly logic-driven based on activeTool state */}
      {activeTool === "highlighter" && (
        <HighlighterTool
          targetRef={targetRef}
          color={highlightColor}
          isActive={true} // Pass isActive prop
          // onHighlight={handleHighlightEvent} // Optional: handle highlight events
        />
      )}
      {activeTool === "eraser" && (
        <EraserTool
          targetRef={targetRef}
          highlightClassName="user-highlight" // Ensure this matches HighlighterTool
          isActive={true} // Pass isActive prop
          // onErase={handleEraseEvent} // Optional: handle erase events
        />
      )}
    </div>
  );
};

export default AnnotationToolbar;
