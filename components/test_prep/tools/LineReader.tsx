import React, { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import {
  X,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Palette,
  Minus,
  Plus,
} from "lucide-react";

interface LineReaderProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

const COLORS = [
  "bg-blue-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-pink-300",
  "bg-purple-300",
];
const DEFAULT_HEIGHT = 32; // h-8
const MIN_HEIGHT = 20; // Minimum height in px
const MAX_HEIGHT = 200; // Maximum height in px
const HEIGHT_STEP = 4; // Increment/decrement for height change

const LineReaderComponent: React.FC<LineReaderProps> = ({
  onClose,
  initialPosition,
}) => {
  const nodeRef = React.useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [color, setColor] = useState(COLORS[0]);
  const [opacity, setOpacity] = useState(0.5); // 0 to 1
  const [height, setHeight] = useState(DEFAULT_HEIGHT); // in pixels
  const [showControls, setShowControls] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const cycleColor = () => {
    const currentIndex = COLORS.indexOf(color);
    setColor(COLORS[(currentIndex + 1) % COLORS.length]);
  };

  const changeOpacity = (newOpacity: number) => {
    setOpacity(Math.max(0.1, Math.min(1, newOpacity)));
  };

  const changeHeight = (delta: number) => {
    setHeight((prevHeight) =>
      Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, prevHeight + delta))
    );
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isVisible) return;
      const draggableNode = nodeRef.current as HTMLElement | null;
      if (draggableNode && draggableNode.parentElement) {
        const currentTop = parseFloat(draggableNode.style.top || "0");
        if (event.key === "ArrowUp") {
          draggableNode.style.transform = `translate(0px, ${
            currentTop - 10
          }px)`;
        } else if (event.key === "ArrowDown") {
          draggableNode.style.transform = `translate(0px, ${
            currentTop + 10
          }px)`;
        }
      }
    },
    [isVisible]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isVisible) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      axis="y"
      handle=".line-reader-drag-handle"
      defaultPosition={initialPosition || { x: 0, y: 100 }}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`fixed left-0 right-0 ${color} shadow-lg z-[60] flex items-center group`}
        style={{
          height: `${height}px`,
          opacity: opacity,
          cursor: "default",
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Drag Handle */}
        <div className="line-reader-drag-handle flex items-center justify-center w-8 h-full bg-black bg-opacity-20 cursor-grab active:cursor-grabbing">
          <GripVertical size={20} className="text-white" />
        </div>

        {/* Controls - Visible on Hover */}
        {showControls && (
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2 flex items-center gap-2 p-1 bg-white/80 rounded-md shadow">
            {/* Color Cycle Button */}
            <button
              onClick={cycleColor}
              className="p-1 hover:bg-gray-200 rounded"
              title="Change Color"
            >
              <Palette size={16} />
            </button>

            {/* Opacity Controls */}
            <button
              onClick={() => changeOpacity(opacity - 0.1)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Decrease Opacity"
            >
              <Minus size={16} />
            </button>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => changeOpacity(parseFloat(e.target.value))}
              className="w-16 h-2 appearance-none bg-gray-300 rounded-full outline-none slider-thumb"
              title="Opacity"
            />
            <button
              onClick={() => changeOpacity(opacity + 0.1)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Increase Opacity"
            >
              <Plus size={16} />
            </button>

            {/* Height Controls */}
            <button
              onClick={() => changeHeight(-HEIGHT_STEP)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Decrease Height"
            >
              <ChevronUp size={16} />
            </button>
            <button
              onClick={() => changeHeight(HEIGHT_STEP)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Increase Height"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        <div className="flex-grow h-full" />

        {/* Close Button - Always visible on hover over the bar */}
        <button
          onClick={handleClose}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black hover:text-gray-700 p-1 bg-white/50 hover:bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Close Line Reader"
        >
          <X size={16} />
        </button>

        {/* Resize Handle (Bottom) - Simplified, might need more robust implementation for drag-to-resize */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center"
          onMouseDown={(e) => {
            // Basic resize logic, could be improved with a proper drag handler
            const startY = e.clientY;
            const startHeight = height;
            const doDrag = (moveEvent: MouseEvent) => {
              const newHeight = startHeight + (moveEvent.clientY - startY);
              setHeight(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight)));
            };
            const stopDrag = () => {
              document.removeEventListener("mousemove", doDrag);
              document.removeEventListener("mouseup", stopDrag);
            };
            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);
          }}
        >
          <Minus
            size={12}
            className="text-black opacity-30 group-hover:opacity-70"
          />
        </div>
      </div>
    </Draggable>
  );
};

export default LineReaderComponent;

// Basic CSS for slider thumb (optional, can be in a global CSS file)
// You might need to add this to your global CSS or a relevant stylesheet
/*
.slider-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #4F46E5; // Indigo color, adjust as needed
  cursor: pointer;
  border-radius: 50%;
}

.slider-thumb::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #4F46E5; // Indigo color, adjust as needed
  cursor: pointer;
  border-radius: 50%;
  border: none;
}
*/
