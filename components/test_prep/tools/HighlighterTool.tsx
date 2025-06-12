import React, { useRef, useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import {
  X,
  Minimize2,
  Maximize2,
  Palette,
  Circle,
  Square,
  PenTool,
  MousePointer,
  Eraser,
  Download,
  Upload,
  RotateCcw,
  Settings,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HighlighterToolProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  targetImageRef?: React.RefObject<HTMLImageElement>;
  highlights?: Highlight[];
  onHighlightsChange?: (highlights: Highlight[]) => void;
  onClearHighlights?: () => void;
}

interface DrawingPoint {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  tool: string;
  color: string;
  opacity: number;
  strokeWidth: number;
  points: DrawingPoint[];
  isComplete: boolean;
}

interface Highlight {
  id: string;
  type: "rectangle" | "circle" | "freehand";
  color: string;
  opacity: number;
  strokeWidth: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: DrawingPoint[];
}

const PREDEFINED_COLORS = [
  "#FFD700", // Yellow (most common for highlighting)
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Light Yellow
  "#DDA0DD", // Plum
  "#FFB347", // Orange
  "#98D8C8", // Mint
  "#F7DC6F", // Light Gold
];

const QUICK_PRESETS = [
  { name: "Important", color: "#FFD700", opacity: 0.7, strokeWidth: 3 },
  { name: "Question", color: "#FF6B6B", opacity: 0.6, strokeWidth: 2 },
  { name: "Answer", color: "#96CEB4", opacity: 0.8, strokeWidth: 4 },
  { name: "Note", color: "#45B7D1", opacity: 0.5, strokeWidth: 2 },
];

const HighlighterTool: React.FC<HighlighterToolProps> = ({
  onClose,
  initialPosition = { x: 50, y: 50 },
  targetImageRef,
  highlights: externalHighlights,
  onHighlightsChange,
  onClearHighlights,
}) => {
  const draggableNodeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [isMinimized, setIsMinimized] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentTool, setCurrentTool] = useState<string>("rectangle");
  const [currentColor, setCurrentColor] = useState("#FFD700");
  const [opacity, setOpacity] = useState(0.7);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<DrawingPoint[]>([]);
  const [internalHighlights, setInternalHighlights] = useState<Highlight[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState<DrawingPoint | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<DrawingPoint>({ x: 0, y: 0 });

  // Use external highlights if provided, otherwise use internal state
  const highlights = externalHighlights || internalHighlights;

  // Function to update highlights - use callback if provided, otherwise update internal state
  const updateHighlights = useCallback(
    (newHighlights: Highlight[]) => {
      if (onHighlightsChange) {
        onHighlightsChange(newHighlights);
      } else {
        setInternalHighlights(newHighlights);
      }
    },
    [onHighlightsChange]
  );

  // Function to clear highlights - use callback if provided, otherwise clear internal state
  const clearHighlights = useCallback(() => {
    if (onClearHighlights) {
      onClearHighlights();
    } else {
      setInternalHighlights([]);
    }
  }, [onClearHighlights]);

  // Create overlay immediately and update position
  useEffect(() => {
    if (targetImageRef?.current && !overlayRef.current) {
      const img = targetImageRef.current;
      const rect = img.getBoundingClientRect();

      console.log("Creating overlay immediately - Image rect:", rect);

      // Create overlay immediately with current image position
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.left = `${rect.left}px`;
      overlay.style.top = `${rect.top}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.pointerEvents = "auto";
      overlay.style.zIndex = "1000";
      overlay.style.cursor = getCursorForTool(currentTool);
      overlay.style.backgroundColor = "rgba(255,255,0,0.1)"; // Subtle yellow overlay for visibility

      // Create canvas with current dimensions
      const canvas = document.createElement("canvas");
      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";

      overlay.appendChild(canvas);
      document.body.appendChild(overlay);

      // Store references
      overlayRef.current = overlay;
      canvasRef.current = canvas;
      setCanvasSize({ width: rect.width, height: rect.height });

      console.log("Overlay created immediately at:", {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });

      // Function to update overlay position
      const updateOverlayPosition = () => {
        const newRect = img.getBoundingClientRect();
        console.log("Updating overlay position - New rect:", newRect);

        if (overlayRef.current && canvasRef.current) {
          const overlay = overlayRef.current;
          const canvas = canvasRef.current;

          overlay.style.left = `${newRect.left}px`;
          overlay.style.top = `${newRect.top}px`;
          overlay.style.width = `${newRect.width}px`;
          overlay.style.height = `${newRect.height}px`;

          // Update canvas size if dimensions changed
          const dimensionsChanged =
            canvas.width !== newRect.width || canvas.height !== newRect.height;

          if (dimensionsChanged) {
            canvas.width = newRect.width;
            canvas.height = newRect.height;
            setCanvasSize({ width: newRect.width, height: newRect.height });
          }

          // Always redraw highlights after position/size update
          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            drawOnCanvas();
          });
        }
      };

      // Throttled version of updateOverlayPosition for scroll events
      let scrollTimer: NodeJS.Timeout | null = null;
      const throttledUpdatePosition = () => {
        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(updateOverlayPosition, 16); // ~60fps
      };

      // Set up event listeners for position updates
      window.addEventListener("resize", updateOverlayPosition);
      window.addEventListener("scroll", throttledUpdatePosition, {
        passive: true,
      });

      // Also listen for image load events in case image isn't fully loaded
      if (!img.complete) {
        img.addEventListener("load", updateOverlayPosition);
      }

      return () => {
        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }
        window.removeEventListener("resize", updateOverlayPosition);
        window.removeEventListener("scroll", throttledUpdatePosition);
        img.removeEventListener("load", updateOverlayPosition);

        // Clean up overlay
        if (overlayRef.current && overlayRef.current.parentNode) {
          overlayRef.current.parentNode.removeChild(overlayRef.current);
        }
        overlayRef.current = null;
        canvasRef.current = null;
      };
    }
  }, [targetImageRef, currentTool]);

  const getCursorForTool = (tool: string): string => {
    switch (tool) {
      case "rectangle":
      case "circle":
        return "crosshair";
      case "freehand":
        return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 17.5L12 8.5L21 17.5' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/svg%3E\") 12 12, auto";
      case "select":
        return "pointer";
      case "eraser":
        return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect x='6' y='12' width='12' height='8' rx='2' stroke='%23000' fill='%23fff'/%3E%3C/svg%3E\") 12 12, auto";
      default:
        return "default";
    }
  };

  const getCanvasCoordinates = (event: MouseEvent): DrawingPoint | null => {
    if (!canvasRef.current || !overlayRef.current) return null;

    const rect = overlayRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const findHighlightAtPoint = (point: DrawingPoint): Highlight | null => {
    // Search from the last (top) highlight to the first (bottom)
    for (let i = highlights.length - 1; i >= 0; i--) {
      const highlight = highlights[i];

      switch (highlight.type) {
        case "rectangle":
          if (highlight.width && highlight.height) {
            if (
              point.x >= highlight.x &&
              point.x <= highlight.x + highlight.width &&
              point.y >= highlight.y &&
              point.y <= highlight.y + highlight.height
            ) {
              return highlight;
            }
          }
          break;
        case "circle":
          if (highlight.radius) {
            const distance = Math.sqrt(
              Math.pow(point.x - highlight.x, 2) +
                Math.pow(point.y - highlight.y, 2)
            );
            if (distance <= highlight.radius) {
              return highlight;
            }
          }
          break;
        case "freehand":
          if (highlight.points && highlight.points.length > 1) {
            // Check if point is near any line segment of the freehand path
            const tolerance = Math.max(highlight.strokeWidth, 10);
            for (let j = 1; j < highlight.points.length; j++) {
              const p1 = highlight.points[j - 1];
              const p2 = highlight.points[j];

              // Calculate distance from point to line segment
              const distance = distanceToLineSegment(point, p1, p2);
              if (distance <= tolerance) {
                return highlight;
              }
            }
          }
          break;
      }
    }
    return null;
  };

  const distanceToLineSegment = (
    point: DrawingPoint,
    p1: DrawingPoint,
    p2: DrawingPoint
  ): number => {
    const A = point.x - p1.x;
    const B = point.y - p1.y;
    const C = p2.x - p1.x;
    const D = p2.y - p1.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    if (lenSq === 0) return Math.sqrt(A * A + B * B);

    let param = dot / lenSq;

    if (param < 0) {
      return Math.sqrt(A * A + B * B);
    } else if (param > 1) {
      const dx = point.x - p2.x;
      const dy = point.y - p2.y;
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      const dx = point.x - (p1.x + param * C);
      const dy = point.y - (p1.y + param * D);
      return Math.sqrt(dx * dx + dy * dy);
    }
  };

  const startDrawing = useCallback(
    (event: MouseEvent) => {
      console.log("Starting drawing with tool:", currentTool);
      const coords = getCanvasCoordinates(event);
      if (!coords) {
        console.log("No coordinates found");
        return;
      }
      console.log("Drawing coordinates:", coords);

      // Handle select tool - do nothing for drawing
      if (currentTool === "select") {
        console.log("Select tool - no drawing action");
        return;
      }

      // Handle eraser tool - find and delete highlight
      if (currentTool === "eraser") {
        const hitHighlight = findHighlightAtPoint(coords);
        if (hitHighlight) {
          console.log("Erasing highlight:", hitHighlight.id);
          updateHighlights(highlights.filter((h) => h.id !== hitHighlight.id));
        } else {
          console.log("No highlight found to erase at this point");
        }
        return;
      }

      setIsDrawing(true);
      setStartPoint(coords);

      if (currentTool === "freehand") {
        setCurrentPath([coords]);
        console.log("Started freehand drawing");

        // Draw initial point
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.arc(coords.x, coords.y, strokeWidth / 2, 0, 2 * Math.PI);
            ctx.fillStyle = currentColor;
            ctx.fill();
          }
        }
      }
    },
    [
      currentTool,
      opacity,
      currentColor,
      strokeWidth,
      highlights,
      updateHighlights,
    ]
  );

  const draw = useCallback(
    (event: MouseEvent) => {
      if (!isDrawing || !startPoint) return;

      // Skip drawing for select and eraser tools
      if (currentTool === "select" || currentTool === "eraser") {
        return;
      }

      const coords = getCanvasCoordinates(event);
      if (!coords) return;

      if (currentTool === "freehand") {
        setCurrentPath((prev) => {
          const newPath = [...prev, coords];
          console.log("Drawing path length:", newPath.length);

          // Draw immediately on canvas
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx && newPath.length > 1) {
              ctx.globalAlpha = opacity;
              ctx.strokeStyle = currentColor;
              ctx.lineWidth = strokeWidth;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";

              const prevPoint = newPath[newPath.length - 2];
              const currentPoint = newPath[newPath.length - 1];

              ctx.beginPath();
              ctx.moveTo(prevPoint.x, prevPoint.y);
              ctx.lineTo(currentPoint.x, currentPoint.y);
              ctx.stroke();
            }
          }

          return newPath;
        });
      } else if (currentTool === "rectangle" || currentTool === "circle") {
        // Preview shape while dragging - redraw canvas with preview
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Clear and redraw all existing highlights
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw all saved highlights
            highlights.forEach((highlight) => {
              ctx.globalAlpha = highlight.opacity;
              ctx.strokeStyle = highlight.color;
              ctx.fillStyle = highlight.color;
              ctx.lineWidth = highlight.strokeWidth;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";

              switch (highlight.type) {
                case "rectangle":
                  if (highlight.width && highlight.height) {
                    ctx.fillRect(
                      highlight.x,
                      highlight.y,
                      highlight.width,
                      highlight.height
                    );
                    ctx.strokeRect(
                      highlight.x,
                      highlight.y,
                      highlight.width,
                      highlight.height
                    );
                  }
                  break;
                case "circle":
                  if (highlight.radius) {
                    ctx.beginPath();
                    ctx.arc(
                      highlight.x,
                      highlight.y,
                      highlight.radius,
                      0,
                      2 * Math.PI
                    );
                    ctx.fill();
                    ctx.stroke();
                  }
                  break;
                case "freehand":
                  if (highlight.points && highlight.points.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(highlight.points[0].x, highlight.points[0].y);
                    for (let i = 1; i < highlight.points.length; i++) {
                      ctx.lineTo(highlight.points[i].x, highlight.points[i].y);
                    }
                    ctx.stroke();
                  }
                  break;
              }
            });

            // Draw preview shape
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = currentColor;
            ctx.fillStyle = currentColor;
            ctx.lineWidth = strokeWidth;

            if (currentTool === "rectangle") {
              const width = coords.x - startPoint.x;
              const height = coords.y - startPoint.y;
              const x = Math.min(startPoint.x, coords.x);
              const y = Math.min(startPoint.y, coords.y);
              ctx.fillRect(x, y, Math.abs(width), Math.abs(height));
              ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
            } else if (currentTool === "circle") {
              const radius = Math.sqrt(
                Math.pow(coords.x - startPoint.x, 2) +
                  Math.pow(coords.y - startPoint.y, 2)
              );
              ctx.beginPath();
              ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      }
    },
    [
      isDrawing,
      startPoint,
      currentTool,
      opacity,
      currentColor,
      strokeWidth,
      highlights,
    ]
  );

  const stopDrawing = useCallback(
    (event: MouseEvent) => {
      if (!isDrawing || !startPoint) return;

      // Skip processing for select and eraser tools
      if (currentTool === "select" || currentTool === "eraser") {
        setIsDrawing(false);
        setStartPoint(null);
        return;
      }

      console.log("Stopping drawing");

      const coords = getCanvasCoordinates(event);
      if (!coords) return;

      setIsDrawing(false);
      setStartPoint(null);

      if (currentTool === "freehand" && currentPath.length > 0) {
        const newHighlight: Highlight = {
          id: Date.now().toString(),
          type: "freehand",
          color: currentColor,
          opacity,
          strokeWidth,
          x: 0,
          y: 0,
          points: [...currentPath, coords],
        };
        updateHighlights([...highlights, newHighlight]);
        console.log(
          "Added freehand highlight, total highlights:",
          highlights.length + 1
        );
        setCurrentPath([]);
      } else if (currentTool === "rectangle") {
        const width = coords.x - startPoint.x;
        const height = coords.y - startPoint.y;
        if (Math.abs(width) > 5 && Math.abs(height) > 5) {
          // Minimum size threshold
          const newHighlight: Highlight = {
            id: Date.now().toString(),
            type: "rectangle",
            color: currentColor,
            opacity,
            strokeWidth,
            x: Math.min(startPoint.x, coords.x),
            y: Math.min(startPoint.y, coords.y),
            width: Math.abs(width),
            height: Math.abs(height),
          };
          updateHighlights([...highlights, newHighlight]);
          console.log(
            "Added rectangle highlight, total highlights:",
            highlights.length + 1
          );
        }
      } else if (currentTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(coords.x - startPoint.x, 2) +
            Math.pow(coords.y - startPoint.y, 2)
        );
        if (radius > 5) {
          // Minimum radius threshold
          const newHighlight: Highlight = {
            id: Date.now().toString(),
            type: "circle",
            color: currentColor,
            opacity,
            strokeWidth,
            x: startPoint.x,
            y: startPoint.y,
            radius,
          };
          updateHighlights([...highlights, newHighlight]);
          console.log(
            "Added circle highlight, total highlights:",
            highlights.length + 1
          );
        }
      }
    },
    [
      isDrawing,
      startPoint,
      currentTool,
      currentPath,
      currentColor,
      opacity,
      strokeWidth,
      highlights,
      updateHighlights,
    ]
  );

  const drawOnCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all highlights
    highlights.forEach((highlight) => {
      const isSelected = selectedHighlight?.id === highlight.id;

      ctx.globalAlpha = highlight.opacity;
      ctx.strokeStyle = highlight.color;
      ctx.fillStyle = highlight.color;
      ctx.lineWidth = highlight.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      switch (highlight.type) {
        case "rectangle":
          if (highlight.width && highlight.height) {
            ctx.fillRect(
              highlight.x,
              highlight.y,
              highlight.width,
              highlight.height
            );
            ctx.strokeRect(
              highlight.x,
              highlight.y,
              highlight.width,
              highlight.height
            );

            // Draw selection handles for selected rectangle
            if (isSelected) {
              drawSelectionHandles(ctx, highlight);
            }
          }
          break;
        case "circle":
          if (highlight.radius) {
            ctx.beginPath();
            ctx.arc(highlight.x, highlight.y, highlight.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            // Draw selection handles for selected circle
            if (isSelected) {
              drawSelectionHandles(ctx, highlight);
            }
          }
          break;
        case "freehand":
          if (highlight.points && highlight.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(highlight.points[0].x, highlight.points[0].y);
            for (let i = 1; i < highlight.points.length; i++) {
              ctx.lineTo(highlight.points[i].x, highlight.points[i].y);
            }
            ctx.stroke();

            // Draw selection indicator for selected freehand
            if (isSelected) {
              drawFreehandSelection(ctx, highlight);
            }
          }
          break;
      }
    });

    // Draw current path if drawing
    if (currentPath.length > 0 && currentTool === "freehand") {
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  }, [
    highlights,
    selectedHighlight,
    currentPath,
    currentColor,
    opacity,
    strokeWidth,
    currentTool,
  ]);

  // Function to draw selection handles
  const drawSelectionHandles = (
    ctx: CanvasRenderingContext2D,
    highlight: Highlight
  ) => {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#007bff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    const handleSize = 6;

    if (highlight.type === "rectangle" && highlight.width && highlight.height) {
      // Draw corner handles
      const corners = [
        { x: highlight.x, y: highlight.y }, // top-left
        { x: highlight.x + highlight.width, y: highlight.y }, // top-right
        { x: highlight.x + highlight.width, y: highlight.y + highlight.height }, // bottom-right
        { x: highlight.x, y: highlight.y + highlight.height }, // bottom-left
      ];

      corners.forEach((corner) => {
        ctx.fillRect(
          corner.x - handleSize / 2,
          corner.y - handleSize / 2,
          handleSize,
          handleSize
        );
        ctx.strokeRect(
          corner.x - handleSize / 2,
          corner.y - handleSize / 2,
          handleSize,
          handleSize
        );
      });
    } else if (highlight.type === "circle" && highlight.radius) {
      // Draw handles at cardinal points
      const handles = [
        { x: highlight.x, y: highlight.y - highlight.radius }, // top
        { x: highlight.x + highlight.radius, y: highlight.y }, // right
        { x: highlight.x, y: highlight.y + highlight.radius }, // bottom
        { x: highlight.x - highlight.radius, y: highlight.y }, // left
      ];

      handles.forEach((handle) => {
        ctx.beginPath();
        ctx.arc(handle.x, handle.y, handleSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });
    }

    ctx.restore();
  };

  // Function to draw freehand selection
  const drawFreehandSelection = (
    ctx: CanvasRenderingContext2D,
    highlight: Highlight
  ) => {
    if (!highlight.points || highlight.points.length === 0) return;

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);

    // Draw bounding box
    const minX = Math.min(...highlight.points.map((p) => p.x));
    const maxX = Math.max(...highlight.points.map((p) => p.x));
    const minY = Math.min(...highlight.points.map((p) => p.y));
    const maxY = Math.max(...highlight.points.map((p) => p.y));

    ctx.strokeRect(minX - 5, minY - 5, maxX - minX + 10, maxY - minY + 10);

    ctx.restore();
  };

  // Function to move selected highlight
  const moveSelectedHighlight = (deltaX: number, deltaY: number) => {
    if (!selectedHighlight) return;

    const updatedHighlights = highlights.map((highlight) => {
      if (highlight.id === selectedHighlight.id) {
        const moved = { ...highlight };
        moved.x += deltaX;
        moved.y += deltaY;

        // Move points for freehand
        if (moved.type === "freehand" && moved.points) {
          moved.points = moved.points.map((point) => ({
            x: point.x + deltaX,
            y: point.y + deltaY,
          }));
        }

        return moved;
      }
      return highlight;
    });
    updateHighlights(updatedHighlights);

    // Update selected highlight reference
    setSelectedHighlight((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      updated.x += deltaX;
      updated.y += deltaY;
      if (updated.type === "freehand" && updated.points) {
        updated.points = updated.points.map((point) => ({
          x: point.x + deltaX,
          y: point.y + deltaY,
        }));
      }
      return updated;
    });
  };

  // Function to delete selected highlight
  const deleteSelectedHighlight = () => {
    if (!selectedHighlight) return;

    updateHighlights(highlights.filter((h) => h.id !== selectedHighlight.id));
    setSelectedHighlight(null);
  };

  // Handle keyboard events for selected highlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedHighlight) return;

      switch (e.key) {
        case "Delete":
        case "Backspace":
          e.preventDefault();
          deleteSelectedHighlight();
          break;
        case "ArrowUp":
          e.preventDefault();
          moveSelectedHighlight(0, -1);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveSelectedHighlight(0, 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveSelectedHighlight(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          moveSelectedHighlight(1, 0);
          break;
        case "Escape":
          e.preventDefault();
          setSelectedHighlight(null);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedHighlight]);

  // Redraw canvas when highlights change
  useEffect(() => {
    drawOnCanvas();
  }, [highlights, drawOnCanvas]);

  // Attach event listeners to overlay once it's created
  useEffect(() => {
    if (overlayRef.current && canvasRef.current) {
      const overlay = overlayRef.current;
      const canvas = canvasRef.current;

      console.log("Attaching event listeners to overlay");

      // Enhanced event handlers with proper tool handling
      const handleMouseDown = (e: MouseEvent) => {
        console.log("Mouse down event on overlay, tool:", currentTool);
        e.preventDefault();
        e.stopPropagation();

        const coords = getCanvasCoordinates(e);
        if (!coords) return;

        // Handle select tool - select and potentially start dragging
        if (currentTool === "select") {
          const hitHighlight = findHighlightAtPoint(coords);
          if (hitHighlight) {
            console.log("Selected highlight:", hitHighlight.id);
            setSelectedHighlight(hitHighlight);
            setIsDragging(true);

            // Calculate drag offset
            setDragOffset({
              x: coords.x - hitHighlight.x,
              y: coords.y - hitHighlight.y,
            });
          } else {
            // Clicked on empty space, deselect
            console.log("Deselected highlight");
            setSelectedHighlight(null);
          }
          return;
        }

        // Handle eraser tool
        if (currentTool === "eraser") {
          const hitHighlight = findHighlightAtPoint(coords);
          if (hitHighlight) {
            console.log("Erasing highlight:", hitHighlight.id);
            updateHighlights(
              highlights.filter((h) => h.id !== hitHighlight.id)
            );
            // Clear selection if we erased the selected highlight
            if (selectedHighlight?.id === hitHighlight.id) {
              setSelectedHighlight(null);
            }
          }
          return;
        }

        // Start drawing for other tools
        setIsDrawing(true);
        setStartPoint(coords);
        // Clear selection when starting to draw
        setSelectedHighlight(null);

        if (currentTool === "freehand") {
          setCurrentPath([coords]);
          // Draw initial point
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.arc(coords.x, coords.y, strokeWidth / 2, 0, 2 * Math.PI);
            ctx.fillStyle = currentColor;
            ctx.fill();
          }
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // If select tool and dragging a highlight
        if (currentTool === "select" && isDragging && selectedHighlight) {
          const coords = getCanvasCoordinates(e);
          if (!coords) return;
          // Compute new top-left for highlight
          const newX = coords.x - dragOffset.x;
          const newY = coords.y - dragOffset.y;
          const dx = newX - selectedHighlight.x;
          const dy = newY - selectedHighlight.y;
          moveSelectedHighlight(dx, dy);
          return;
        }

        if (!isDrawing || !startPoint) return;

        // Skip for non-drawing tools
        if (currentTool === "select" || currentTool === "eraser") return;

        const coords = getCanvasCoordinates(e);
        if (!coords) return;

        if (currentTool === "freehand") {
          setCurrentPath((prev) => {
            const newPath = [...prev, coords];

            // Draw segment immediately
            const ctx = canvas.getContext("2d");
            if (ctx && newPath.length > 1) {
              ctx.globalAlpha = opacity;
              ctx.strokeStyle = currentColor;
              ctx.lineWidth = strokeWidth;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";

              const prevPoint = newPath[newPath.length - 2];
              ctx.beginPath();
              ctx.moveTo(prevPoint.x, prevPoint.y);
              ctx.lineTo(coords.x, coords.y);
              ctx.stroke();
            }
            return newPath;
          });
        } else {
          // Preview shapes (rectangle/circle)
          const ctx = canvas.getContext("2d");
          if (ctx) {
            // Clear and redraw everything for preview
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redraw existing highlights
            highlights.forEach((highlight) => {
              ctx.globalAlpha = highlight.opacity;
              ctx.strokeStyle = highlight.color;
              ctx.fillStyle = highlight.color;
              ctx.lineWidth = highlight.strokeWidth;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";

              if (
                highlight.type === "rectangle" &&
                highlight.width &&
                highlight.height
              ) {
                ctx.fillRect(
                  highlight.x,
                  highlight.y,
                  highlight.width,
                  highlight.height
                );
                ctx.strokeRect(
                  highlight.x,
                  highlight.y,
                  highlight.width,
                  highlight.height
                );
              } else if (highlight.type === "circle" && highlight.radius) {
                ctx.beginPath();
                ctx.arc(
                  highlight.x,
                  highlight.y,
                  highlight.radius,
                  0,
                  2 * Math.PI
                );
                ctx.fill();
                ctx.stroke();
              } else if (
                highlight.type === "freehand" &&
                highlight.points &&
                highlight.points.length > 1
              ) {
                ctx.beginPath();
                ctx.moveTo(highlight.points[0].x, highlight.points[0].y);
                for (let i = 1; i < highlight.points.length; i++) {
                  ctx.lineTo(highlight.points[i].x, highlight.points[i].y);
                }
                ctx.stroke();
              }
            });

            // Draw preview shape
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = currentColor;
            ctx.fillStyle = currentColor;
            ctx.lineWidth = strokeWidth;

            if (currentTool === "rectangle") {
              const width = coords.x - startPoint.x;
              const height = coords.y - startPoint.y;
              const x = Math.min(startPoint.x, coords.x);
              const y = Math.min(startPoint.y, coords.y);
              ctx.fillRect(x, y, Math.abs(width), Math.abs(height));
              ctx.strokeRect(x, y, Math.abs(width), Math.abs(height));
            } else if (currentTool === "circle") {
              const radius = Math.sqrt(
                Math.pow(coords.x - startPoint.x, 2) +
                  Math.pow(coords.y - startPoint.y, 2)
              );
              ctx.beginPath();
              ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        console.log("Mouse up event on overlay");
        e.preventDefault();
        e.stopPropagation();

        // If select tool was dragging, stop dragging
        if (currentTool === "select" && isDragging) {
          setIsDragging(false);
          return;
        }

        if (!isDrawing || !startPoint) return;

        // Skip for non-drawing tools
        if (currentTool === "select" || currentTool === "eraser") {
          setIsDrawing(false);
          setStartPoint(null);
          return;
        }

        const coords = getCanvasCoordinates(e);
        if (!coords) return;

        setIsDrawing(false);
        setStartPoint(null);

        // Create highlight based on tool
        if (currentTool === "freehand" && currentPath.length > 0) {
          const newHighlight: Highlight = {
            id: Date.now().toString(),
            type: "freehand",
            color: currentColor,
            opacity,
            strokeWidth,
            x: 0,
            y: 0,
            points: [...currentPath, coords],
          };
          updateHighlights([...highlights, newHighlight]);
          setCurrentPath([]);
        } else if (currentTool === "rectangle") {
          const width = coords.x - startPoint.x;
          const height = coords.y - startPoint.y;
          if (Math.abs(width) > 5 && Math.abs(height) > 5) {
            const newHighlight: Highlight = {
              id: Date.now().toString(),
              type: "rectangle",
              color: currentColor,
              opacity,
              strokeWidth,
              x: Math.min(startPoint.x, coords.x),
              y: Math.min(startPoint.y, coords.y),
              width: Math.abs(width),
              height: Math.abs(height),
            };
            updateHighlights([...highlights, newHighlight]);
          }
        } else if (currentTool === "circle") {
          const radius = Math.sqrt(
            Math.pow(coords.x - startPoint.x, 2) +
              Math.pow(coords.y - startPoint.y, 2)
          );
          if (radius > 5) {
            const newHighlight: Highlight = {
              id: Date.now().toString(),
              type: "circle",
              color: currentColor,
              opacity,
              strokeWidth,
              x: startPoint.x,
              y: startPoint.y,
              radius,
            };
            updateHighlights([...highlights, newHighlight]);
          }
        }
      };

      // Handle mouse leave and global mouse up
      const handleMouseLeave = (e: MouseEvent) => {
        if (isDrawing) {
          handleMouseUp(e);
        }
      };

      const handleGlobalMouseUp = (e: MouseEvent) => {
        if (isDrawing) {
          console.log("Global mouse up - stopping drawing");
          handleMouseUp(e);
        }
      };

      // Attach event listeners
      overlay.addEventListener("mousedown", handleMouseDown);
      overlay.addEventListener("mousemove", handleMouseMove);
      overlay.addEventListener("mouseup", handleMouseUp);
      overlay.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      console.log("Event listeners attached to overlay");

      // Cleanup function
      return () => {
        console.log("Cleaning up event listeners");
        overlay.removeEventListener("mousedown", handleMouseDown);
        overlay.removeEventListener("mousemove", handleMouseMove);
        overlay.removeEventListener("mouseup", handleMouseUp);
        overlay.removeEventListener("mouseleave", handleMouseLeave);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [
    overlayRef.current,
    canvasRef.current,
    currentTool,
    currentColor,
    opacity,
    strokeWidth,
    highlights,
    isDrawing,
    startPoint,
    currentPath,
    updateHighlights,
    selectedHighlight,
    isDragging,
    dragOffset,
  ]);

  // Update cursor when tool changes
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.style.cursor = getCursorForTool(currentTool);
      console.log("Updated cursor for tool:", currentTool);
    }
  }, [currentTool]);

  const applyQuickPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setCurrentColor(preset.color);
    setOpacity(preset.opacity);
    setStrokeWidth(preset.strokeWidth);
  };

  const undoLastHighlight = () => {
    if (highlights.length > 0) {
      updateHighlights(highlights.slice(0, -1));
    }
  };

  const clearAllHighlights = () => {
    clearHighlights();
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const exportHighlights = () => {
    const dataStr = JSON.stringify(highlights, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `highlights_${Date.now()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importHighlights = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHighlights = JSON.parse(e.target?.result as string);
        updateHighlights(importedHighlights);
      } catch (error) {
        console.error("Error importing highlights:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Draggable
        nodeRef={draggableNodeRef}
        defaultPosition={initialPosition}
        handle=".highlighter-drag-handle"
        bounds="parent"
      >
        <div
          ref={draggableNodeRef}
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-[1001] min-w-[320px]"
          style={{ maxWidth: "90vw", maxHeight: "90vh" }}
        >
          {/* Header */}
          <div className="highlighter-drag-handle flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg cursor-move">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="font-medium text-sm">Highlighter Tool</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3 h-3" />
                ) : (
                  <Minimize2 className="w-3 h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Quick Presets */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Quick Presets
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyQuickPreset(preset)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Zap className="w-3 h-3" />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tool Selection */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Drawing Tools
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { tool: "rectangle", icon: Square, label: "Rectangle" },
                    { tool: "circle", icon: Circle, label: "Circle" },
                    { tool: "freehand", icon: PenTool, label: "Freehand" },
                    { tool: "select", icon: MousePointer, label: "Select" },
                    { tool: "eraser", icon: Eraser, label: "Eraser" },
                  ].map(({ tool, icon: Icon, label }) => (
                    <Button
                      key={tool}
                      variant={currentTool === tool ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentTool(tool)}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Colors</h4>
                <div className="grid grid-cols-5 gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        currentColor === color
                          ? "border-gray-800 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-full h-8 rounded border border-gray-300"
                />
              </div>

              {/* Settings */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {showAdvanced ? "Hide" : "Show"} Advanced Settings
                </Button>

                {showAdvanced && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Opacity: {Math.round(opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={opacity}
                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Stroke Width: {strokeWidth}px
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={strokeWidth}
                        onChange={(e) =>
                          setStrokeWidth(parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undoLastHighlight}
                  disabled={highlights.length === 0}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllHighlights}
                  disabled={highlights.length === 0}
                  className="flex items-center gap-2"
                >
                  <Eraser className="w-3 h-3" />
                  Clear All
                </Button>
              </div>

              {/* Export/Import */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportHighlights}
                  disabled={highlights.length === 0}
                  className="flex items-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Export
                </Button>
                <label className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-3 h-3" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importHighlights}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Stats */}
              <div className="text-xs text-gray-500 text-center">
                {highlights.length} highlight
                {highlights.length !== 1 ? "s" : ""} created
              </div>
            </div>
          )}
        </div>
      </Draggable>
    </>
  );
};

export default HighlighterTool;
