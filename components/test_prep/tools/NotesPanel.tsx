import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react"; // Added useRef
import Draggable from "react-draggable";
import { X, Save, Check, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Proper TypeScript types for dynamic imports
import type { Resizable } from "re-resizable";
import type ReactQuill from "react-quill";
import { ResizeDirection, ResizableProps } from "re-resizable";

// Loading component
const LoadingSpinner = ({ text }: { text: string }) => (
  <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg">
    <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full mr-2"></div>
    <p className="text-yellow-700">{text}</p>
  </div>
);

// Error boundary component
const ErrorFallback = ({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center mb-2">
      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
      <p className="text-red-700 font-medium">Failed to load component</p>
    </div>
    <p className="text-red-600 text-sm mb-2">{error.message}</p>
    <button
      onClick={resetError}
      className="text-red-600 hover:text-red-800 text-sm underline"
    >
      Try again
    </button>
  </div>
);

// Dynamically import components with proper types
const DynamicResizable = dynamic(
  () => import("re-resizable").then((mod) => mod.Resizable),
  {
    ssr: false,
    loading: () => <LoadingSpinner text="Loading resizer..." />,
  }
) as React.ComponentType<any>; // Simplified type assertion for DynamicResizable

const DynamicReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <LoadingSpinner text="Loading editor..." />,
});

// Constants for better maintainability
const NOTES_PANEL_CONFIG = {
  DEFAULT_SIZE: { width: 320, height: 250 },
  MIN_SIZE: { width: 250, height: 200 },
  MAX_SIZE: { width: 800, height: 600 },
  Z_INDEX: 60,
  HEADER_HEIGHT: 40,
  DEBOUNCE_DELAY: 1000, // 1 second
  AUTO_SAVE_DELAY: 5000, // 5 seconds
} as const;

// Save states for better user feedback
type SaveState = "idle" | "saving" | "saved" | "error";

interface PanelSize {
  width: number;
  height: number;
}

interface NotesPanelProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  notesKey?: string;
}

// Debounce hook for auto-save functionality
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NotesPanel: React.FC<NotesPanelProps> = ({
  onClose,
  initialPosition,
  notesKey = "testPrepGlobalNotes",
}) => {
  const [notes, setNotes] = useState<string>("");
  const [currentSize, setCurrentSize] = useState<PanelSize>(
    NOTES_PANEL_CONFIG.DEFAULT_SIZE
  );
  const [isClient, setIsClient] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const draggableNodeRef = useRef<HTMLDivElement>(null);
  // Removed resizeHandleRef here as it will be part of the handleComponent

  // Debounced notes for auto-save
  const debouncedNotes = useDebounce(notes, NOTES_PANEL_CONFIG.DEBOUNCE_DELAY);

  // Initialize component and load saved data
  useEffect(() => {
    setIsClient(true);
    try {
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) {
        setNotes(savedNotes);
      }
      const savedSize = localStorage.getItem(`${notesKey}_size`);
      if (savedSize) {
        const parsedSize = JSON.parse(savedSize);
        setCurrentSize(parsedSize);
      }
    } catch (error) {
      console.error("Failed to load notes or size from localStorage:", error);
      setError("Failed to load saved notes");
    }
  }, [notesKey]);

  // Auto-save functionality
  useEffect(() => {
    if (debouncedNotes && isClient && saveState !== "saving") {
      handleAutoSave();
    }
  }, [debouncedNotes, isClient]);

  const handleAutoSave = useCallback(async () => {
    if (!notes.trim()) return;

    setSaveState("saving");
    try {
      localStorage.setItem(notesKey, notes);
      localStorage.setItem(`${notesKey}_size`, JSON.stringify(currentSize));
      setSaveState("saved");
      setError(null);

      // Reset saved state after 2 seconds
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (error) {
      console.error("Auto-save failed:", error);
      setSaveState("error");
      setError("Auto-save failed");
    }
  }, [notes, currentSize, notesKey]);

  const handleManualSave = useCallback(async () => {
    setSaveState("saving");
    try {
      localStorage.setItem(notesKey, notes);
      localStorage.setItem(`${notesKey}_size`, JSON.stringify(currentSize));
      setSaveState("saved");
      setError(null);

      // Reset saved state after 3 seconds
      setTimeout(() => setSaveState("idle"), 3000);
    } catch (error) {
      console.error("Manual save failed:", error);
      setSaveState("error");
      setError("Failed to save notes");
    }
  }, [notes, currentSize, notesKey]);

  const onResizeStop = useCallback(
    (
      event: MouseEvent | TouchEvent,
      direction: ResizeDirection,
      refToElement: HTMLElement,
      delta: {
        width: number;
        height: number;
      }
    ) => {
      setCurrentSize((prev) => ({
        width: Math.max(
          NOTES_PANEL_CONFIG.MIN_SIZE.width,
          Math.min(NOTES_PANEL_CONFIG.MAX_SIZE.width, prev.width + delta.width)
        ),
        height: Math.max(
          NOTES_PANEL_CONFIG.MIN_SIZE.height,
          Math.min(
            NOTES_PANEL_CONFIG.MAX_SIZE.height,
            prev.height + delta.height
          )
        ),
      }));
    },
    []
  );

  // Memoized quill configuration
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
    ],
    []
  );

  // Save state indicator component
  const SaveStateIndicator = () => {
    switch (saveState) {
      case "saving":
        return (
          <div className="flex items-center text-yellow-600 text-xs">
            <div className="animate-spin h-3 w-3 border border-yellow-600 border-t-transparent rounded-full mr-1"></div>
            Saving...
          </div>
        );
      case "saved":
        return (
          <div className="flex items-center text-green-600 text-xs">
            <Check size={12} className="mr-1" />
            Saved
          </div>
        );
      case "error":
        return (
          <div className="flex items-center text-red-600 text-xs">
            <AlertCircle size={12} className="mr-1" />
            Error
          </div>
        );
      default:
        return null;
    }
  };

  // Render null or a placeholder if not on the client yet, to ensure client-only components are not rendered server-side
  if (!isClient) {
    return (
      <div className="fixed bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-2xl w-80 z-[60] p-4">
        <p>Loading notes...</p>
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={draggableNodeRef} // Pass the ref to Draggable
      handle=".notes-panel-header"
      defaultPosition={initialPosition || { x: 300, y: 150 }}
      bounds="parent"
      cancel=".react-resizable-handle, .ql-editor, .ql-toolbar, .notes-panel-resize-indicator" // Updated cancel class
    >
      <div
        ref={draggableNodeRef}
        className={`fixed bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-2xl z-[${NOTES_PANEL_CONFIG.Z_INDEX}] flex flex-col overflow-hidden`}
        style={{
          width: currentSize.width,
          height: currentSize.height,
          cursor: "default",
        }}
      >
        <DynamicResizable
          size={{ width: currentSize.width, height: currentSize.height }}
          minWidth={NOTES_PANEL_CONFIG.MIN_SIZE.width}
          minHeight={NOTES_PANEL_CONFIG.MIN_SIZE.height}
          maxWidth={NOTES_PANEL_CONFIG.MAX_SIZE.width}
          maxHeight={NOTES_PANEL_CONFIG.MAX_SIZE.height}
          onResizeStop={onResizeStop}
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: true, // Only enable bottom-right resize
            bottomLeft: false,
            topLeft: false,
          }}
          handleComponent={{
            bottomRight: (
              <div
                className="notes-panel-resize-indicator" // Keep className for Draggable cancel
                style={{
                  width: "16px",
                  height: "16px",
                  position: "absolute", // Required by re-resizable for its positioning logic
                  // right: "0px", // Let re-resizable control exact position
                  // bottom: "0px",// Let re-resizable control exact position
                  cursor: "nwse-resize",
                  zIndex: NOTES_PANEL_CONFIG.Z_INDEX + 2, // Ensure it's above panel and other potential elements
                  backgroundColor: "rgba(255, 0, 0, 0.7)", // Bright red, semi-transparent
                  // Removed backgroundImage for now to test basic visibility
                  border: "1px solid rgba(0,0,0,0.5)", // Added a border for more visibility
                }}
              />
            ),
          }}
        >
          {/* Header */}
          <div className="notes-panel-header bg-yellow-200 p-2 flex justify-between items-center rounded-t-lg cursor-move h-10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-yellow-800">Notes</span>
              <SaveStateIndicator />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleManualSave}
                className="text-yellow-700 hover:text-yellow-900 p-0.5 rounded hover:bg-yellow-300 transition-colors"
                title="Save Notes"
                disabled={saveState === "saving"}
                aria-label="Save notes manually"
              >
                <Save size={18} />
              </button>
              <button
                onClick={onClose}
                className="text-yellow-700 hover:text-yellow-900 p-0.5 rounded hover:bg-yellow-300 transition-colors"
                title="Close Notes"
                aria-label="Close notes panel"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-2 text-red-700 text-xs flex-shrink-0">
              {error}
            </div>
          )}

          {/* Editor Area */}
          <div
            className="p-0 flex-grow flex flex-col overflow-hidden" // Added overflow-hidden
            style={{
              // Calculate height dynamically based on header and error message presence
              height: `calc(100% - ${NOTES_PANEL_CONFIG.HEADER_HEIGHT}px${
                error ? " - 30px" : ""
              })`,
            }}
          >
            <DynamicReactQuill
              theme="snow"
              value={notes}
              onChange={setNotes}
              placeholder="Type your notes here..."
              modules={quillModules}
              formats={quillFormats}
              className="flex-grow flex flex-col h-full bg-white notes-quill-editor"
              style={{ height: "100%" }} // Ensure Quill takes full calculated height
            />
          </div>
        </DynamicResizable>
      </div>
    </Draggable>
  );
};

export default NotesPanel;
