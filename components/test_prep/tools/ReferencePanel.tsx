import React, { useRef, useState, useEffect } from "react"; // ADDED useState, useEffect
import Draggable from "react-draggable";
import { X, BookOpen } from "lucide-react"; // Removed Expand, Minimize as we'll use a corner handle

interface ReferencePanelProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  // Props to load specific reference content can be added later
  // e.g., referenceId?: string;
  referenceData?: ReferenceContent; // ADDED: Prop to pass reference data
}

// ADDED: Interface for reference content
interface ReferenceContent {
  title: string;
  text?: string;
  imageUrl?: string;
  altText?: string;
}

const ReferencePanelComponent: React.FC<ReferencePanelProps> = ({
  onClose,
  initialPosition,
  referenceData,
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 600, height: 450 }); // Default larger size
  const [isResizing, setIsResizing] = useState(false);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Use passed referenceData or a default placeholder
  const referenceContent: ReferenceContent = referenceData || {
    title: "Sample Reference Material",
    text: "This is a placeholder for reference content. It could be formulas, definitions, tables, or any other helpful information related to the test question. The panel is now resizable.",
    imageUrl: `https://via.placeholder.com/${size.width - 50}x${
      size.height - 150
    }.png?text=Reference+Image`,
    altText: "Sample reference image",
  };

  const handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent Draggable from starting
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !nodeRef.current) return;
      const panelRect = nodeRef.current.getBoundingClientRect();
      setSize({
        width: Math.max(300, e.clientX - panelRect.left),
        height: Math.max(200, e.clientY - panelRect.top),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <Draggable
      nodeRef={nodeRef} // Pass the ref here
      handle=".reference-panel-header"
      defaultPosition={initialPosition || { x: 150, y: 75 }} // Adjusted for larger size
      bounds="parent"
      cancel=".reference-panel-resize-handle" // Prevent dragging when clicking resize handle
    >
      <div
        ref={nodeRef} // This ref is for Draggable
        className="fixed bg-pink-100 border-2 border-pink-400 rounded-lg shadow-2xl z-[60] flex flex-col overflow-hidden" // overflow-hidden is important
        style={{
          cursor: "default",
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <div className="reference-panel-header bg-pink-200 p-2 flex justify-between items-center rounded-t-lg cursor-move select-none">
          <div className="flex items-center">
            <BookOpen size={18} className="mr-2 text-pink-700" />
            <span className="font-semibold text-pink-800">Reference</span>
          </div>
          <button
            onClick={onClose}
            className="text-pink-700 hover:text-pink-900 p-0.5 rounded hover:bg-pink-300"
            title="Close Reference Panel"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 flex-grow overflow-y-auto flex flex-col">
          {" "}
          {/* Added flex flex-col */}
          <h3 className="text-lg font-semibold text-pink-700 mb-2">
            {referenceContent.title}
          </h3>
          {referenceContent.text && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
              {referenceContent.text}
            </p>
          )}
          {referenceContent.imageUrl && (
            <div className="mt-2 flex-grow flex items-center justify-center">
              {" "}
              {/* Image container takes remaining space */}
              <img
                src={referenceContent.imageUrl}
                alt={referenceContent.altText || "Reference image"}
                className="max-w-full max-h-full object-contain rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>
        {/* Resize Handle */}
        <div
          ref={resizeHandleRef} // Ref for the resize handle itself
          className="reference-panel-resize-handle"
          onMouseDown={handleMouseDownResize}
          style={{
            width: "16px",
            height: "16px",
            backgroundColor: "rgba(128, 128, 128, 0.5)", // Semi-transparent grey
            position: "absolute",
            right: "0px",
            bottom: "0px",
            cursor: "nwse-resize",
            zIndex: 61, // Ensure it's on top
            borderTopLeftRadius: "4px", // Optional: makes it look a bit more like a handle
          }}
        />
      </div>
    </Draggable>
  );
};

export default ReferencePanelComponent;
