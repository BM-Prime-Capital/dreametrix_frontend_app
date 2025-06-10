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
  Move3D,
  Settings,
} from "lucide-react";

interface LineReaderProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  containerWidth?: number; // Width of the question container
}

const COLORS = [
  { bg: "bg-gradient-to-r from-blue-400 to-blue-600", name: "Ocean Blue" },
  { bg: "bg-gradient-to-r from-emerald-400 to-emerald-600", name: "Emerald" },
  { bg: "bg-gradient-to-r from-amber-400 to-amber-600", name: "Golden" },
  { bg: "bg-gradient-to-r from-rose-400 to-rose-600", name: "Rose" },
  { bg: "bg-gradient-to-r from-purple-400 to-purple-600", name: "Purple" },
  { bg: "bg-gradient-to-r from-indigo-400 to-indigo-600", name: "Indigo" },
  { bg: "bg-gradient-to-r from-cyan-400 to-cyan-600", name: "Cyan" },
];
const DEFAULT_HEIGHT = 100;
const MIN_HEIGHT = 24;
const MAX_HEIGHT = 140;
const HEIGHT_STEP = 4;

const LineReaderComponent: React.FC<LineReaderProps> = ({
  onClose,
  initialPosition,
  containerWidth = 800, // Default width if not provided
}) => {
  const nodeRef = React.useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [colorIndex, setColorIndex] = useState(0);
  const [opacity, setOpacity] = useState(0.9);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [showControls, setShowControls] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const currentColor = COLORS[colorIndex];

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 200);
  };

  const cycleColor = () => {
    setIsAnimating(true);
    setColorIndex((prev) => (prev + 1) % COLORS.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const changeOpacity = (newOpacity: number) => {
    setOpacity(Math.max(0.2, Math.min(1, newOpacity)));
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
      defaultPosition={initialPosition || { x: 0, y: 100 }}
      bounds="parent"
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
    >
      <div
        ref={nodeRef}
        className={`absolute left-0 ${
          currentColor.bg
        } shadow-2xl z-[60] flex items-center group transition-all duration-300 ease-in-out ${
          isAnimating ? "scale-105" : "scale-100"
        } ${showControls ? "shadow-2xl" : "shadow-lg"} ${
          isDragging ? "scale-105 shadow-3xl" : "scale-100"
        } backdrop-blur-sm border border-white/20`}
        style={{
          width: `${containerWidth}px`,
          height: `${height}px`,
          opacity: isDragging ? opacity * 0.9 : opacity,
          cursor: isDragging ? "grabbing" : "grab",
          borderRadius: "12px",
          transform: `scale(${isDragging ? 1.05 : isAnimating ? 1.02 : 1}) ${
            isDragging ? "rotate(1deg)" : "rotate(0deg)"
          }`,
          filter: isDragging ? "brightness(1.1)" : "brightness(1)",
          transition: isDragging ? "none" : "all 0.3s ease-in-out",
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Animated background overlay */}
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-300 ${
            isDragging
              ? "bg-gradient-to-r from-white/20 via-white/10 to-white/20"
              : "bg-gradient-to-r from-white/10 via-transparent to-white/10"
          }`}
        />

        {/* Drag Handle with modern design - now optional visual indicator */}
        <div
          className={`flex items-center justify-center w-12 h-full bg-black/20 backdrop-blur-sm transition-all duration-200 rounded-l-xl ${
            isDragging ? "bg-black/40" : "hover:bg-black/30"
          }`}
        >
          <Move3D
            size={20}
            className={`text-white drop-shadow-lg transition-all duration-200 ${
              isDragging ? "scale-110" : ""
            }`}
          />
        </div>

        {/* Modern Controls Panel */}
        {showControls && (
          <div className="absolute top-1/2 left-16 transform -translate-y-1/2 flex items-center gap-3 p-3 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200/50 animate-in slide-in-from-left-2 duration-300">
            {/* Color Cycle Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={cycleColor}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group/btn"
                title={`Color: ${currentColor.name}`}
              >
                <Palette
                  size={16}
                  className="text-gray-600 group-hover/btn:text-indigo-600"
                />
                <span className="text-xs font-medium text-gray-600">
                  {currentColor.name}
                </span>
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Opacity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeOpacity(opacity - 0.1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                title="Decrease Opacity"
              >
                <Minus size={14} className="text-gray-600" />
              </button>

              <div className="relative">
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => changeOpacity(parseFloat(e.target.value))}
                  className="w-20 h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full outline-none appearance-none cursor-pointer opacity-slider"
                  title={`Opacity: ${Math.round(opacity * 100)}%`}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
                  {Math.round(opacity * 100)}%
                </div>
              </div>

              <button
                onClick={() => changeOpacity(opacity + 0.1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                title="Increase Opacity"
              >
                <Plus size={14} className="text-gray-600" />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Height Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeHeight(-HEIGHT_STEP)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                title="Decrease Height"
              >
                <ChevronUp size={14} className="text-gray-600" />
              </button>

              <span className="text-xs font-medium text-gray-500 min-w-[3rem] text-center">
                {height}px
              </span>

              <button
                onClick={() => changeHeight(HEIGHT_STEP)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                title="Increase Height"
              >
                <ChevronDown size={14} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}

        {/* Main reading area */}
        <div className="flex-grow h-full flex items-center justify-center">
          <div
            className={`text-white/20 text-sm font-medium tracking-wider transition-all duration-200 ${
              isDragging ? "text-white/40 scale-110" : ""
            }`}
          >
            {isDragging ? "DRAGGING..." : "READING GUIDE"}
          </div>
        </div>

        {/* Enhanced Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:text-red-200 p-2 bg-black/20 hover:bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          title="Close Line Reader"
        >
          <X size={16} />
        </button>

        {/* Enhanced Resize Handle */}
        <div
          className="absolute bottom-0 left-12 right-4 h-3 cursor-ns-resize flex items-center justify-center rounded-b-xl hover:bg-white/20 transition-all duration-200 group/resize"
          onMouseDown={(e) => {
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
          title="Drag to resize height"
        >
          <div className="flex gap-1">
            <div className="w-8 h-1 bg-white/40 rounded-full group-hover/resize:bg-white/60 transition-colors duration-200" />
            <div className="w-8 h-1 bg-white/40 rounded-full group-hover/resize:bg-white/60 transition-colors duration-200" />
            <div className="w-8 h-1 bg-white/40 rounded-full group-hover/resize:bg-white/60 transition-colors duration-200" />
          </div>
        </div>

        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
            isDragging
              ? "bg-gradient-to-r from-transparent via-white/15 to-transparent shadow-2xl"
              : "bg-gradient-to-r from-transparent via-white/5 to-transparent"
          }`}
        />

        {/* Dragging indicator overlay */}
        {isDragging && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 pointer-events-none animate-pulse" />
        )}
      </div>
    </Draggable>
  );
};

export default LineReaderComponent;

// Enhanced CSS for the modern slider and animations
// Add this to your global CSS or a relevant stylesheet
/*
@keyframes slide-in-from-left-2 {
  from {
    transform: translateX(-8px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-in {
  animation-duration: 150ms;
  animation-fill-mode: both;
}

.slide-in-from-left-2 {
  animation-name: slide-in-from-left-2;
}

.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(59, 130, 246, 0.3);
}

.opacity-slider {
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #e5e7eb, #9ca3af);
  border-radius: 9999px;
  outline: none;
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.opacity-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.opacity-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  cursor: pointer;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.opacity-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.duration-300 {
  transition-duration: 300ms;
}
*/
