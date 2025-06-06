import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Draggable from "react-draggable";
import {
  X,
  MoveHorizontal,
  MoveVertical,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  RefreshCw,
  RotateCw,
  RotateCcw,
  Compass,
  CornerDownLeft,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Target,
  Settings,
  Magnet,
  Plus,
  Minus,
  Minimize2,
  Maximize2,
} from "lucide-react";

interface RulerProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  initialRotation?: number;
}

const Ruler: React.FC<RulerProps> = ({
  onClose,
  initialPosition,
  initialRotation = 0,
}) => {
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [unit, setUnit] = useState<"cm" | "in" | "px">("cm");
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [bodySize, setBodySize] = useState({ width: 0, height: 0 });
  const bodyRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [rotation, setRotation] = useState(initialRotation);
  const [isRotating, setIsRotating] = useState(false);
  const [showRotationControls, setShowRotationControls] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [customAngle, setCustomAngle] = useState("");
  const [magneticSnap, setMagneticSnap] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [rulerLength, setRulerLength] = useState(600); // Enhanced length control
  const [rulerHeight, setRulerHeight] = useState(80); // Enhanced height control
  const [showControls, setShowControls] = useState(false); // Toggle controls visibility - closed by default

  const rulerBodyPadding = 3;

  // Normalize angle to 0-360 range
  const normalizeAngle = (angle: number): number => {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  };

  // Format angle for display
  const formatAngle = (angle: number): string => {
    return `${Math.round(normalizeAngle(angle))}°`;
  };

  const toggleUnit = () => {
    if (isLocked) return;
    setUnit((prevUnit) => {
      if (prevUnit === "cm") return "in";
      if (prevUnit === "in") return "px";
      return "cm";
    });
  };

  const toggleMeasurements = () => {
    if (isLocked) return;
    setShowMeasurements(!showMeasurements);
  };

  const toggleLock = () => setIsLocked(!isLocked);
  const toggleTransparency = () => setIsTransparent(!isTransparent);
  const toggleRotationControls = () =>
    setShowRotationControls(!showRotationControls);
  const toggleAdvancedControls = () =>
    setShowAdvancedControls(!showAdvancedControls);
  const toggleMagneticSnap = () => setMagneticSnap(!magneticSnap);
  const toggleGrid = () => setShowGrid(!showGrid);
  const toggleCompact = () => setIsCompact(!isCompact);
  const toggleControls = () => setShowControls(!showControls);

  // Enhanced length and height control functions
  const increaseLength = () =>
    setRulerLength((prev) => Math.min(prev + 50, 1200)); // Increased max length
  const decreaseLength = () =>
    setRulerLength((prev) => Math.max(prev - 50, 100));

  const increaseHeight = () =>
    setRulerHeight((prev) => Math.min(prev + 10, 150)); // New height controls
  const decreaseHeight = () =>
    setRulerHeight((prev) => Math.max(prev - 10, 60));

  // Rotation functions
  const resetRotation = () => {
    if (isLocked) return;
    setRotation(0);
  };

  const rotateByDegrees = (degrees: number) => {
    if (isLocked) return;
    setRotation((prev) => {
      const newRotation = prev + degrees;
      return magneticSnap ? snapToNearestIncrement(newRotation) : newRotation;
    });
  };

  const snapToAngle = (angle: number) => {
    if (isLocked) return;
    setRotation(angle);
  };

  const setCustomAngleValue = () => {
    if (isLocked || !customAngle) return;
    const angle = parseFloat(customAngle);
    if (!isNaN(angle)) {
      setRotation(angle);
      setCustomAngle("");
    }
  };

  const snapToNearestIncrement = (angle: number, increment: number = 15) => {
    return Math.round(angle / increment) * increment;
  };

  const adjustZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const calculateAngle = (
    centerX: number,
    centerY: number,
    mouseX: number,
    mouseY: number
  ) => {
    return (Math.atan2(mouseY - centerY, mouseX - centerX) * 180) / Math.PI;
  };

  // Enhanced rotation handling from simple ruler with requestAnimationFrame
  const handleRotationStart = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (isLocked || !rulerRef.current) return;

      e.preventDefault();
      e.stopPropagation();
      setIsRotating(true);

      const rulerRect = rulerRef.current.getBoundingClientRect();
      const centerX = rulerRect.left + rulerRect.width / 2;
      const centerY = rulerRect.top + rulerRect.height / 2;

      let clientX, clientY;
      if (e.nativeEvent instanceof MouseEvent) {
        clientX = e.nativeEvent.clientX;
        clientY = e.nativeEvent.clientY;
      } else if (
        e.nativeEvent instanceof TouchEvent &&
        e.nativeEvent.touches[0]
      ) {
        clientX = e.nativeEvent.touches[0].clientX;
        clientY = e.nativeEvent.touches[0].clientY;
      } else {
        return;
      }

      const initialAngle = calculateAngle(centerX, centerY, clientX, clientY);
      setStartAngle(initialAngle - rotation);
    },
    [isLocked, rulerRef, rotation]
  );

  const handleRotationMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isRotating || !rulerRef.current) return;

      e.preventDefault();

      const rulerRect = rulerRef.current.getBoundingClientRect();
      const centerX = rulerRect.left + rulerRect.width / 2;
      const centerY = rulerRect.top + rulerRect.height / 2;

      let clientX, clientY;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e instanceof TouchEvent && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }

      const currentAngle = calculateAngle(centerX, centerY, clientX, clientY);
      const newRotation = currentAngle - startAngle;
      const finalRotation = magneticSnap
        ? snapToNearestIncrement(newRotation)
        : newRotation;

      // Use requestAnimationFrame for smoother rotation
      requestAnimationFrame(() => {
        setRotation(finalRotation);
      });
    },
    [isRotating, rulerRef, startAngle, magneticSnap]
  );

  const handleRotationEnd = useCallback(() => {
    setIsRotating(false);
  }, []);

  useEffect(() => {
    if (isRotating) {
      const handleMove = (e: Event) =>
        handleRotationMove(e as MouseEvent | TouchEvent);
      const handleEnd = () => handleRotationEnd();

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
        document.body.style.userSelect = "";
      };
    } else {
      document.body.style.userSelect = "";
    }
  }, [isRotating, handleRotationMove, handleRotationEnd]);

  useEffect(() => {
    if (bodyRef.current) {
      setBodySize({
        width: bodyRef.current.offsetWidth,
        height: bodyRef.current.offsetHeight,
      });
    }
  }, [isHorizontal, unit, bodyRef.current, isCompact, rulerLength]);

  // Use rulerLength instead of bodySize for dynamic length
  const length = isHorizontal ? rulerLength : rulerLength;

  let pixelsPerUnit: number;
  let majorUnitValue: number;
  let minorUnitValue: number;
  let subMinorUnitValue: number;
  let unitLabel: string;

  if (unit === "cm") {
    pixelsPerUnit = 37.8;
    majorUnitValue = 1;
    minorUnitValue = 0.5;
    subMinorUnitValue = 0.1;
    unitLabel = "CM";
  } else if (unit === "in") {
    pixelsPerUnit = 96;
    majorUnitValue = 1;
    minorUnitValue = 0.25;
    subMinorUnitValue = 0.125;
    unitLabel = "IN";
  } else {
    pixelsPerUnit = 1;
    majorUnitValue = 100;
    minorUnitValue = 50;
    subMinorUnitValue = 10;
    unitLabel = "PX";
  }

  const numberOfMajorMarks =
    length > 0 && pixelsPerUnit > 0 && majorUnitValue > 0
      ? Math.floor(
          (length - 2 * rulerBodyPadding) / (pixelsPerUnit * majorUnitValue)
        )
      : 0;

  const renderMarks = () => {
    if (length === 0 || pixelsPerUnit === 0) return null;

    const marks = [];
    const drawableLength = length - 2 * rulerBodyPadding;

    for (let i = 0; i <= numberOfMajorMarks; i++) {
      const position = i * majorUnitValue * pixelsPerUnit;
      if (position > drawableLength + 1) break;

      // Enhanced major marks with modern styling
      marks.push(
        <div
          key={`major-${i}`}
          className="absolute"
          style={{
            ...(isHorizontal
              ? {
                  left: `${position}px`,
                  top: "0",
                  height: "100%",
                  width: "3px",
                }
              : {
                  top: `${position}px`,
                  left: "0",
                  width: "100%",
                  height: "3px",
                }),
            background:
              "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
            borderRadius: "2px",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {showMeasurements && i * majorUnitValue > 0 && (
            <span
              style={{
                position: "absolute",
                fontSize: "12px",
                fontWeight: "700",
                color: "#1f2937",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)",
                padding: "2px 6px",
                borderRadius: "5px",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
                border: "1px solid rgba(0,0,0,0.06)",
                backdropFilter: "blur(6px)",
                whiteSpace: "nowrap",
                ...(isHorizontal
                  ? { top: "4px", left: "4px", transform: "none" }
                  : {
                      left: "4px",
                      top: "4px",
                      transform: "rotate(-90deg)",
                      transformOrigin: "top left",
                    }),
              }}
            >
              {i * majorUnitValue}
            </span>
          )}
        </div>
      );

      // Enhanced minor marks
      if (i < numberOfMajorMarks) {
        if (minorUnitValue > 0) {
          for (let j = 1; j < 1 / minorUnitValue; j++) {
            const minorPosition = position + j * minorUnitValue * pixelsPerUnit;
            if (minorPosition < drawableLength - 1) {
              marks.push(
                <div
                  key={`minor-${i}-${j}`}
                  className="absolute"
                  style={{
                    ...(isHorizontal
                      ? {
                          left: `${minorPosition}px`,
                          top: "25%",
                          height: "50%",
                          width: "2px",
                        }
                      : {
                          top: `${minorPosition}px`,
                          left: "25%",
                          width: "50%",
                          height: "2px",
                        }),
                    background:
                      j % 5 === 0
                        ? "linear-gradient(135deg, #4b5563 0%, #6b7280 100%)"
                        : "linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)",
                    borderRadius: "1px",
                    boxShadow:
                      j % 5 === 0
                        ? "0 1px 2px rgba(0,0,0,0.1)"
                        : "0 1px 1px rgba(0,0,0,0.05)",
                  }}
                />
              );

              // Add half-unit labels for better readability
              if (j === 5 && showMeasurements) {
                marks.push(
                  <div
                    key={`half-${i}-${j}`}
                    style={{
                      position: "absolute",
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#6b7280",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.88) 100%)",
                      padding: "1px 4px",
                      borderRadius: "3px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      whiteSpace: "nowrap",
                      ...(isHorizontal
                        ? {
                            top: `${minorPosition}px`,
                            left: "100%",
                            transform: "translateY(-50%)",
                            marginLeft: "2px",
                          }
                        : {
                            left: `${minorPosition}px`,
                            top: "100%",
                            transform: "translateX(-50%)",
                            marginTop: "2px",
                          }),
                    }}
                  >
                    {i + 0.5}
                  </div>
                );
              }
            }
          }
        }
      }
    }
    return marks;
  };

  // Dynamic ruler size based on length and height
  const rulerSize = useMemo(() => {
    const baseHeight = rulerHeight; // Use dynamic height
    const actualHeight = isCompact ? baseHeight * 0.75 : baseHeight;
    return {
      width: rulerLength,
      height: actualHeight,
    };
  }, [rulerLength, rulerHeight, isCompact]);

  return (
    <Draggable
      handle=".ruler-draggable"
      defaultPosition={initialPosition || { x: 150, y: 150 }}
      disabled={isLocked || isRotating}
      nodeRef={rulerRef}
    >
      <div
        ref={rulerRef}
        style={{
          cursor: isLocked
            ? "not-allowed"
            : isRotating
            ? "grabbing"
            : "default",
          zIndex: 9999,
          position: "absolute",
        }}
      >
        {/* Conteneur interne pour la rotation et le zoom */}
        <div
          className={`ruler-draggable bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-slate-300 shadow-2xl flex ${
            isHorizontal ? "flex-row" : "flex-col"
          } rounded-xl overflow-visible group ${
            isTransparent ? "opacity-60" : "opacity-100"
          } backdrop-blur-sm ${
            isLocked ? "cursor-not-allowed" : "cursor-move"
          }`}
          style={{
            ...rulerSize,
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isRotating
              ? "none"
              : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Enhanced Rotation Handle */}
          {!isRotating && (
            <div
              onMouseDown={handleRotationStart}
              onTouchStart={handleRotationStart}
              style={{
                position: "absolute",
                top: isHorizontal ? "-50px" : "calc(50% - 25px)",
                left: isHorizontal ? "calc(50% - 25px)" : "-50px",
                cursor: isRotating ? "grabbing" : "grab",
                zIndex: 10001,
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className={`rotation-handle rounded-full border-3 transition-all duration-300 hover:scale-110 ${
                magneticSnap
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-emerald-500/25"
                  : "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-blue-500/25"
              } shadow-xl backdrop-blur-sm`}
              title={`Rotation: ${formatAngle(rotation)}${
                magneticSnap ? " (Snap Mode)" : ""
              }`}
            >
              <RefreshCw
                size={24}
                className="text-white drop-shadow-sm"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "center",
                  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
                }}
              />
            </div>
          )}

          {/* Simplified Header - Only Unit Control */}
          <div
            className={`ruler-header bg-gradient-to-br from-slate-600 to-slate-700 p-3 flex items-center justify-center text-xs ${
              isHorizontal ? "w-16 h-full flex-col" : "h-16 w-full flex-row"
            } rounded-l-xl overflow-hidden`}
            style={{ zIndex: 10000 }}
          >
            {/* Unit Control Only */}
            <button
              onClick={toggleUnit}
              className="bg-white/20 rounded-md px-2 py-1 hover:bg-white/30 transition-colors"
              title={`Changer vers ${
                unit === "cm"
                  ? "pouces"
                  : unit === "in"
                  ? "pixels"
                  : "centimètres"
              }`}
              disabled={isLocked}
            >
              <span className="font-bold text-white text-xs">{unitLabel}</span>
            </button>
          </div>

          {/* Enhanced Ruler Body */}
          <div
            ref={bodyRef}
            className="flex-grow relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-r-xl"
            style={{
              padding: `${rulerBodyPadding}px`,
              width: isHorizontal ? `${rulerLength - 64}px` : "100%",
              height: isHorizontal ? "100%" : `${rulerLength - 64}px`,
            }}
          >
            <div className="relative w-full h-full">{renderMarks()}</div>
          </div>

          {/* Toggle Controls Button */}
          <button
            onClick={toggleControls}
            style={{
              position: "absolute",
              top: isHorizontal ? "-40px" : "-40px",
              right: isHorizontal ? "10px" : "10px",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
              zIndex: 10002,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            title={
              showControls ? "Masquer les contrôles" : "Afficher les contrôles"
            }
          >
            <Settings size={16} />
          </button>

          {/* Enhanced Control Panel - Horizontal Top */}
          {showControls && (
            <div
              style={{
                position: "absolute",
                top: isHorizontal ? "-120px" : "-120px",
                left: isHorizontal ? "0" : "0",
                right: isHorizontal ? "0" : "0",
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(30,30,30,0.9) 100%)",
                backdropFilter: "blur(12px)",
                color: "white",
                padding: "12px 20px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                zIndex: 10001,
                border: "1px solid rgba(255,255,255,0.1)",
                minWidth: "300px",
              }}
            >
              {/* Info Display */}
              <div className="flex gap-6 mb-3 pb-3 border-b border-white/20 justify-center">
                <span>
                  <span style={{ opacity: 0.8, fontSize: "10px" }}>Angle:</span>{" "}
                  <span style={{ color: "#60a5fa", fontWeight: "700" }}>
                    {Math.round(rotation % 360)}°
                  </span>
                </span>
                <span>
                  <span style={{ opacity: 0.8, fontSize: "10px" }}>
                    Length:
                  </span>{" "}
                  <span style={{ color: "#34d399", fontWeight: "700" }}>
                    {Math.round(
                      (rulerLength /
                        (unit === "cm" ? 37.8 : unit === "in" ? 96 : 1)) *
                        10
                    ) / 10}
                  </span>
                  <span style={{ opacity: 0.9, fontSize: "11px" }}>
                    {unit === "cm" ? "cm" : unit === "in" ? '"' : "px"}
                  </span>
                </span>
                <span>
                  <span style={{ opacity: 0.8, fontSize: "10px" }}>
                    Height:
                  </span>{" "}
                  <span style={{ color: "#f59e0b", fontWeight: "700" }}>
                    {rulerHeight}px
                  </span>
                </span>
                <span>
                  <span style={{ opacity: 0.8, fontSize: "10px" }}>Mode:</span>{" "}
                  <span style={{ color: "#a78bfa", fontWeight: "700" }}>
                    {isHorizontal ? "Horizontal" : "Vertical"}
                  </span>
                </span>
              </div>

              {/* Controls Grid - Horizontal Layout */}
              <div className="flex gap-6 justify-center flex-wrap">
                {/* Length Controls */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-80">Longueur</span>
                  <div className="flex gap-1">
                    <button
                      onClick={decreaseLength}
                      className="w-6 h-6 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center"
                      title="Réduire longueur"
                      disabled={isLocked}
                    >
                      <Minus size={12} />
                    </button>
                    <button
                      onClick={increaseLength}
                      className="w-6 h-6 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                      title="Augmenter longueur"
                      disabled={isLocked}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Height Controls */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-80">Hauteur</span>
                  <div className="flex gap-1">
                    <button
                      onClick={decreaseHeight}
                      className="w-6 h-6 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center justify-center"
                      title="Réduire hauteur"
                      disabled={isLocked}
                    >
                      <Minus size={12} />
                    </button>
                    <button
                      onClick={increaseHeight}
                      className="w-6 h-6 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center justify-center"
                      title="Augmenter hauteur"
                      disabled={isLocked}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Orientation Control
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-80">Orientation</span>
                  <button
                    onClick={() => !isLocked && setIsHorizontal(!isHorizontal)}
                    className="w-12 h-6 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
                    title={isHorizontal ? "Mode vertical" : "Mode horizontal"}
                    disabled={isLocked}
                  >
                    {isHorizontal ? (
                      <MoveVertical size={12} />
                    ) : (
                      <MoveHorizontal size={12} />
                    )}
                  </button>
                </div> */}

                {/* View Controls */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-80">Affichage</span>
                  <div className="flex gap-1">
                    <button
                      onClick={toggleMeasurements}
                      className="w-6 h-6 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors flex items-center justify-center"
                      title={
                        showMeasurements
                          ? "Masquer les nombres"
                          : "Afficher les nombres"
                      }
                      disabled={isLocked}
                    >
                      {showMeasurements ? (
                        <EyeOff size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                    </button>
                    <button
                      onClick={toggleCompact}
                      className="w-6 h-6 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors flex items-center justify-center"
                      title={isCompact ? "Mode normal" : "Mode compact"}
                      disabled={isLocked}
                    >
                      {isCompact ? (
                        <Maximize2 size={12} />
                      ) : (
                        <Minimize2 size={12} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Lock & Transparency Controls */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-80">Sécurité</span>
                  <div className="flex gap-1">
                    <button
                      onClick={toggleLock}
                      className={`w-6 h-6 rounded transition-colors flex items-center justify-center ${
                        isLocked
                          ? "text-red-300 hover:text-red-200 bg-red-500/20"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                      title={isLocked ? "Déverrouiller" : "Verrouiller"}
                    >
                      {isLocked ? <Unlock size={12} /> : <Lock size={12} />}
                    </button>
                    <button
                      onClick={toggleTransparency}
                      className="w-6 h-6 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors flex items-center justify-center"
                      title={
                        isTransparent ? "Opacité 100%" : "Semi-transparent"
                      }
                    >
                      <Layers size={12} />
                    </button>
                  </div>
                </div>

                {/* Rotation Controls */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-80">Rotation</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => rotateByDegrees(-15)}
                      className="w-6 h-6 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors flex items-center justify-center"
                      title="Rotation -15°"
                      disabled={isLocked}
                    >
                      <RotateCcw size={12} />
                    </button>
                    <button
                      onClick={resetRotation}
                      className="w-6 h-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                      title="Réinitialiser rotation (0°)"
                      disabled={isLocked}
                    >
                      <Compass size={12} />
                    </button>
                    <button
                      onClick={() => rotateByDegrees(15)}
                      className="w-6 h-6 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors flex items-center justify-center"
                      title="Rotation +15°"
                      disabled={isLocked}
                    >
                      <RotateCw size={12} />
                    </button>
                  </div>
                </div>

                {/* Close Control */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-80">Fermer</span>
                  <button
                    onClick={onClose}
                    className="w-6 h-6 text-white/80 hover:text-red-300 rounded hover:bg-red-500/20 transition-colors flex items-center justify-center"
                    title="Fermer la règle"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>{" "}
        {/* Fermeture du conteneur interne pour rotation */}
      </div>
    </Draggable>
  );
};

export default Ruler;
