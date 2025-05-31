import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Crosshair,
  ChevronDown,
  ChevronUp,
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
      setRotation(finalRotation);
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
  }, [isHorizontal, unit, bodyRef.current, isCompact]);

  const length = isHorizontal ? bodySize.width : bodySize.height;

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

      // Major marks
      marks.push(
        <div
          key={`major-${i}`}
          className="absolute bg-slate-700"
          style={{
            ...(isHorizontal
              ? {
                  left: `${position}px`,
                  top: "0",
                  height: "100%",
                  width: "2px",
                }
              : {
                  top: `${position}px`,
                  left: "0",
                  width: "100%",
                  height: "2px",
                }),
          }}
        >
          {showMeasurements && i * majorUnitValue > 0 && (
            <span
              className="absolute text-xs font-medium text-slate-700 bg-white px-1 rounded"
              style={{
                ...(isHorizontal
                  ? { top: "4px", left: "4px", transform: "none" }
                  : {
                      left: "4px",
                      top: "4px",
                      transform: "rotate(-90deg)",
                      transformOrigin: "top left",
                      whiteSpace: "nowrap",
                    }),
              }}
            >
              {i * majorUnitValue}
            </span>
          )}
        </div>
      );

      // Minor and sub-minor marks
      if (i < numberOfMajorMarks) {
        if (minorUnitValue > 0) {
          for (let j = 1; j < 1 / minorUnitValue; j++) {
            const minorPosition = position + j * minorUnitValue * pixelsPerUnit;
            if (minorPosition < drawableLength - 1) {
              marks.push(
                <div
                  key={`minor-${i}-${j}`}
                  className="absolute bg-slate-500"
                  style={{
                    ...(isHorizontal
                      ? {
                          left: `${minorPosition}px`,
                          top: "25%",
                          height: "50%",
                          width: "1px",
                        }
                      : {
                          top: `${minorPosition}px`,
                          left: "25%",
                          width: "50%",
                          height: "1px",
                        }),
                  }}
                />
              );
            }
          }
        }
        if (subMinorUnitValue > 0) {
          for (let k = 1; k < 1 / subMinorUnitValue; k++) {
            if (
              minorUnitValue > 0 &&
              (k * subMinorUnitValue) % minorUnitValue === 0
            )
              continue;

            const subMinorPosition =
              position + k * subMinorUnitValue * pixelsPerUnit;
            if (subMinorPosition < drawableLength - 1) {
              marks.push(
                <div
                  key={`subminor-${i}-${k}`}
                  className="absolute bg-slate-400"
                  style={{
                    ...(isHorizontal
                      ? {
                          left: `${subMinorPosition}px`,
                          top: "40%",
                          height: "20%",
                          width: "1px",
                        }
                      : {
                          top: `${subMinorPosition}px`,
                          left: "40%",
                          width: "20%",
                          height: "1px",
                        }),
                  }}
                />
              );
            }
          }
        }
      }
    }
    return marks;
  };

  const rulerSize = isCompact
    ? isHorizontal
      ? "h-12 w-[20rem]"
      : "w-12 h-[20rem]"
    : isHorizontal
    ? "h-16 w-[28rem]"
    : "w-16 h-[28rem]";

  return (
    <Draggable
      handle=".ruler-header"
      defaultPosition={initialPosition || { x: 150, y: 150 }}
      disabled={isLocked || isRotating}
      nodeRef={rulerRef}
    >
      <div
        ref={rulerRef}
        className={`absolute bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-slate-300 shadow-2xl flex ${
          isHorizontal ? "flex-row" : "flex-col"
        } ${rulerSize} rounded-xl overflow-visible group ${
          isTransparent ? "opacity-60" : "opacity-100"
        } backdrop-blur-sm`}
        style={{
          cursor: isLocked
            ? "not-allowed"
            : isRotating
            ? "grabbing"
            : "default",
          transform: `rotate(${rotation}deg) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isRotating
            ? "none"
            : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 9999,
          position: "absolute",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Enhanced Rotation Handle */}
        {!isLocked && (
          <>
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

            {/* Modern Control Panel */}
            <div
              style={{
                position: "absolute",
                top: isHorizontal ? "-45px" : "calc(50% - 20px)",
                left: isHorizontal ? "calc(50% + 60px)" : "-100px",
                zIndex: 10000,
              }}
              className="flex gap-2"
            >
              <button
                onClick={toggleAdvancedControls}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm ${
                  showAdvancedControls
                    ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    : "bg-white/90 text-purple-600 hover:bg-purple-50"
                }`}
                title="Contrôles avancés"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={toggleRotationControls}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm ${
                  showRotationControls
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    : "bg-white/90 text-blue-600 hover:bg-blue-50"
                }`}
                title="Contrôles de rotation"
              >
                <Compass size={14} />
              </button>
            </div>

            {/* Advanced Controls Panel */}
            {showAdvancedControls && (
              <div
                style={{
                  position: "absolute",
                  top: isHorizontal ? "-140px" : "calc(50% - 70px)",
                  left: isHorizontal ? "calc(50% - 150px)" : "-300px",
                  right: isHorizontal ? "auto" : "auto",
                  zIndex: 9999,
                  maxWidth: "300px",
                }}
                className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-slate-800 text-center border-b border-slate-200 pb-2">
                    Contrôles Avancés
                  </h3>

                  {/* Zoom Controls */}
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-xs font-medium text-slate-700">
                      Zoom: {Math.round(zoom * 100)}%
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => adjustZoom(-0.1)}
                        className="p-1 bg-white hover:bg-slate-100 rounded-md shadow-sm transition-colors"
                        title="Zoom arrière"
                      >
                        <ZoomOut size={14} />
                      </button>
                      <button
                        onClick={() => setZoom(1)}
                        className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-colors text-xs font-medium"
                        title="Reset zoom"
                      >
                        100%
                      </button>
                      <button
                        onClick={() => adjustZoom(0.1)}
                        className="p-1 bg-white hover:bg-slate-100 rounded-md shadow-sm transition-colors"
                        title="Zoom avant"
                      >
                        <ZoomIn size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Magnetic Snap */}
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
                      <span className="text-xs font-medium text-slate-700 mb-1">
                        Aimant (15°)
                      </span>
                      <button
                        onClick={toggleMagneticSnap}
                        className={`p-2 rounded-lg transition-all ${
                          magneticSnap
                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg"
                            : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
                        }`}
                      >
                        <Magnet size={16} />
                      </button>
                    </div>

                    {/* Grid Toggle */}
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg">
                      <span className="text-xs font-medium text-slate-700 mb-1">
                        Grille
                      </span>
                      <button
                        onClick={toggleGrid}
                        className={`p-2 rounded-lg transition-all ${
                          showGrid
                            ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg"
                            : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
                        }`}
                      >
                        <Grid3X3 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rotation Controls Panel */}
            {showRotationControls && (
              <div
                style={{
                  position: "absolute",
                  top: isHorizontal ? "-180px" : "calc(50% - 90px)",
                  left: isHorizontal ? "calc(50% - 160px)" : "-320px",
                  right: isHorizontal ? "auto" : "auto",
                  zIndex: 9999,
                  maxWidth: "320px",
                }}
                className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20"
              >
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-slate-800 text-center border-b border-slate-200 pb-2">
                    Contrôles de Rotation
                  </h3>

                  {/* Current Angle Display */}
                  <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                    <div className="text-2xl font-bold text-slate-800 mb-1">
                      {formatAngle(rotation)}
                    </div>
                    {magneticSnap && (
                      <div className="text-xs text-emerald-600 flex items-center justify-center gap-1">
                        <Magnet size={12} />
                        Mode Aimant Actif
                      </div>
                    )}
                  </div>

                  {/* Custom Angle Input */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={customAngle}
                      onChange={(e) => setCustomAngle(e.target.value)}
                      placeholder="Angle..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                      min="0"
                      max="360"
                    />
                    <button
                      onClick={setCustomAngleValue}
                      className="px-3 py-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg"
                      title="Appliquer l'angle"
                    >
                      <Target size={14} />
                    </button>
                  </div>

                  {/* Quick Rotation Buttons */}
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => rotateByDegrees(-45)}
                      className="px-2 py-1 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 shadow-lg"
                      title="Rotation -45°"
                    >
                      <RotateCcw size={12} />
                      45°
                    </button>
                    <button
                      onClick={() => rotateByDegrees(-15)}
                      className="px-2 py-1 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 shadow-lg"
                      title="Rotation -15°"
                    >
                      <RotateCcw size={12} />
                      15°
                    </button>
                    <button
                      onClick={() => rotateByDegrees(15)}
                      className="px-2 py-1 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 shadow-lg"
                      title="Rotation +15°"
                    >
                      <RotateCw size={12} />
                      15°
                    </button>
                    <button
                      onClick={() => rotateByDegrees(45)}
                      className="px-2 py-1 bg-gradient-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all duration-200 shadow-lg"
                      title="Rotation +45°"
                    >
                      <RotateCw size={12} />
                      45°
                    </button>
                  </div>

                  {/* Preset Angles */}
                  <div className="grid grid-cols-6 gap-1">
                    {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 270, 315].map(
                      (angle) => (
                        <button
                          key={angle}
                          onClick={() => snapToAngle(angle)}
                          className={`px-1 py-1 rounded-md text-xs font-medium transition-all ${
                            Math.abs(normalizeAngle(rotation) - angle) < 2
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                          title={`Snap à ${angle}°`}
                        >
                          {angle}°
                        </button>
                      )
                    )}
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetRotation}
                    className="w-full px-3 py-2 bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-lg text-sm"
                    title="Remettre à 0°"
                  >
                    <CornerDownLeft size={14} />
                    Réinitialiser
                  </button>
                </div>
              </div>
            )}

            {/* Background Grid */}
            {showGrid && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `
                    linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            )}
          </>
        )}

        {/* Modern Header */}
        <div
          className={`ruler-header bg-gradient-to-br from-slate-600 to-slate-700 p-2 flex items-center text-xs ${
            isLocked ? "cursor-not-allowed" : "cursor-move"
          } ${
            isHorizontal
              ? "w-16 h-full flex-col justify-between"
              : "h-16 w-full flex-row justify-between"
          } rounded-l-xl overflow-hidden`}
          style={{ zIndex: 10000 }}
        >
          {/* Unit and Orientation Controls */}
          <div
            className={`flex items-center gap-1 ${
              isHorizontal ? "flex-col" : "flex-row"
            }`}
          >
            <div className="bg-white/20 rounded-md px-1 py-0.5">
              <span className="font-bold text-white text-xs">{unitLabel}</span>
            </div>
            <button
              onClick={() => !isLocked && setIsHorizontal(!isHorizontal)}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              title={isHorizontal ? "Mode vertical" : "Mode horizontal"}
              disabled={isLocked}
            >
              {isHorizontal ? (
                <MoveVertical size={12} />
              ) : (
                <MoveHorizontal size={12} />
              )}
            </button>
          </div>

          {/* Main Controls */}
          <div
            className={`flex items-center gap-0.5 ${
              isHorizontal ? "flex-col" : "flex-row flex-wrap"
            }`}
          >
            <button
              onClick={toggleUnit}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              title={`Changer vers ${
                unit === "cm"
                  ? "pouces"
                  : unit === "in"
                  ? "pixels"
                  : "centimètres"
              }`}
              disabled={isLocked}
            >
              <span className="text-xs font-bold">
                {unit === "cm" ? "IN" : unit === "in" ? "PX" : "CM"}
              </span>
            </button>

            <button
              onClick={toggleMeasurements}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              title={
                showMeasurements
                  ? "Masquer les nombres"
                  : "Afficher les nombres"
              }
              disabled={isLocked}
            >
              {showMeasurements ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>

            <button
              onClick={toggleCompact}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              title={isCompact ? "Mode normal" : "Mode compact"}
            >
              {isCompact ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            </button>

            <button
              onClick={toggleLock}
              className={`p-1 rounded-md transition-colors ${
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
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              title={isTransparent ? "Opacité 100%" : "Semi-transparent"}
            >
              <Layers size={12} />
            </button>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-red-300 p-1 rounded-md hover:bg-red-500/20 transition-colors"
              title="Fermer la règle"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Ruler Body */}
        <div
          ref={bodyRef}
          className="flex-grow relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-r-xl"
          style={{ padding: `${rulerBodyPadding}px` }}
        >
          <div className="relative w-full h-full">{renderMarks()}</div>
        </div>
      </div>
    </Draggable>
  );
};

export default Ruler;
