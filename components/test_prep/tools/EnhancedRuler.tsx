import React, { useState, useRef, useMemo } from "react";
import Draggable from "react-draggable";
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  RotateCw,
  RotateCcw,
  Compass,
  Settings,
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
  // Ruler is always rendered horizontally; rotation handles other angles
  const isHorizontal = true;
  const [unit, setUnit] = useState<"cm" | "in" | "px">("cm");
  const [showMeasurements, setShowMeasurements] = useState(true);
  const rulerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [rotation, setRotation] = useState(initialRotation);
  const magneticSnap = true; // always snap rotation to clean increments
  const zoom = 1; // fixed zoom for simple physical look
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [rulerLength, setRulerLength] = useState(700); // Enhanced length control
  const [rulerHeight, setRulerHeight] = useState(80); // Default thinner ruler height
  const [showControls, setShowControls] = useState(false); // Toggle controls visibility - closed by default

  const rulerBodyPadding = 3;

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

  const snapToNearestIncrement = (angle: number, increment: number = 15) => {
    return Math.round(angle / increment) * increment;
  };

  // Use rulerLength instead of bodySize for dynamic length
  const length = isHorizontal ? rulerLength : rulerLength;

  let pixelsPerUnit: number;
  let majorUnitValue: number;
  let minorUnitValue: number;
  let unitLabel: string;

  if (unit === "cm") {
    pixelsPerUnit = 37.8;
    majorUnitValue = 1;
    // 0.1 cm spacing to show 10 graduations between each centimeter
    minorUnitValue = 0.1;
    unitLabel = "CM";
  } else if (unit === "in") {
    pixelsPerUnit = 96;
    majorUnitValue = 1;
    // 1/8 inch spacing to show more graduations between each inch
    minorUnitValue = 0.125;
    unitLabel = "IN";
  } else {
    pixelsPerUnit = 1;
    majorUnitValue = 100;
    minorUnitValue = 50;
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

      // Major marks styled like etched metal
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
              "linear-gradient(180deg, #4b5563 0%, #111827 40%, #4b5563 100%)",
            borderRadius: "1px",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.4)",
          }}
        >
          {showMeasurements && i * majorUnitValue > 0 && (
            <span
              style={{
                position: "absolute",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.02em",
                color: "#111827",
                textShadow:
                  "0 1px 0 rgba(255,255,255,0.7), 0 -1px 0 rgba(0,0,0,0.4)",
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
              const isMidBetweenMajor = j % 5 === 0; // e.g. 0.5 cm when minor step = 0.1
              marks.push(
                <div
                  key={`minor-${i}-${j}`}
                  className="absolute"
                  style={{
                    ...(isHorizontal
                      ? {
                          left: `${minorPosition}px`,
                          top: isMidBetweenMajor ? "18%" : "30%",
                          height: isMidBetweenMajor ? "64%" : "40%",
                          width: "2px",
                        }
                      : {
                          top: `${minorPosition}px`,
                          left: isMidBetweenMajor ? "18%" : "30%",
                          width: isMidBetweenMajor ? "64%" : "40%",
                          height: "2px",
                        }),
                    background:
                      isMidBetweenMajor
                        ? "linear-gradient(180deg, #4b5563 0%, #111827 60%, #4b5563 100%)"
                        : "linear-gradient(180deg, #d1d5db 0%, #9ca3af 60%, #e5e7eb 100%)",
                    borderRadius: "1px",
                    boxShadow:
                      isMidBetweenMajor
                        ? "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.35)"
                        : "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.25)",
                  }}
                />
              );
            }
          }
        }
      }
    }
    // Center reference line
    if (drawableLength > 0) {
      const centerPosition = drawableLength / 2;
      marks.push(
        <div
          key="center-reference"
          className="absolute"
          style={{
            left: `${centerPosition}px`,
            top: "0",
            height: "100%",
            width: "2px",
            background:
              "linear-gradient(180deg, rgba(239,68,68,0.7) 0%, rgba(185,28,28,0.9) 60%, rgba(239,68,68,0.7) 100%)",
            boxShadow: "0 0 4px rgba(248,113,113,0.6)",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
      );
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
      disabled={isLocked}
      nodeRef={rulerRef}
    >
      <div
        ref={rulerRef}
        style={{
          cursor: isLocked
            ? "not-allowed"
            : "default",
          zIndex: 9999,
          position: "absolute",
        }}
      >
        {/* Inner container for rotation and zoom */}
        <div
          className={`ruler-draggable flex ${
            isHorizontal ? "flex-row" : "flex-col"
          } overflow-visible group ${
            isTransparent ? "opacity-60" : "opacity-100"
          } ${isLocked ? "cursor-not-allowed" : "cursor-move"}`}
          style={{
            ...rulerSize,
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            // Metallic silver/gray appearance with realistic shadows and slight brushed texture
            background:
              "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 25%, #9ca3af 50%, #d1d5db 75%, #e5e7eb 100%)",
            border: "1px solid #6b7280",
            borderRadius: "4px",
            boxShadow: `
              0 4px 8px rgba(0, 0, 0, 0.2),
              0 2px 4px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(0, 0, 0, 0.05)
            `,
          }}
        >
          {/* Simplified Header - Only Unit Control */}
          <div
            className={`ruler-header p-3 flex items-center justify-center text-xs ${
              isHorizontal ? "w-16 h-full flex-col" : "h-16 w-full flex-row"
            } overflow-hidden`}
            style={{ 
              zIndex: 10000,
              background: "linear-gradient(135deg, #4b5563 0%, #374151 50%, #4b5563 100%)",
              borderRight: isHorizontal ? "2px solid #1f2937" : "none",
              borderBottom: !isHorizontal ? "2px solid #1f2937" : "none",
              boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)"
            }}
          >
            {/* Unit Control Only */}
            <button
              onClick={toggleUnit}
              className="bg-white/10 rounded px-2 py-1 hover:bg-white/20 transition-colors border border-white/20"
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

          {/* Ruler body */}
          <div
            className="flex-grow relative overflow-hidden"
            style={{
              padding: `${rulerBodyPadding}px`,
              width: isHorizontal ? `${rulerLength - 64}px` : "100%",
              height: isHorizontal ? "100%" : `${rulerLength - 64}px`,
              background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)",
              boxShadow: "inset 0 0 2px rgba(0, 0, 0, 0.1)"
            }}
            ref={bodyRef}
            onMouseMove={(e) => {
              if (!bodyRef.current) return;
              const rect = bodyRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left - rulerBodyPadding;
              if (x < 0 || x > rect.width - rulerBodyPadding * 2) {
                setHoverPosition(null);
                setHoverValue(null);
                return;
              }
              const value = x / pixelsPerUnit;
              setHoverPosition(x + rulerBodyPadding);
              setHoverValue(value);
            }}
            onMouseLeave={() => {
              setHoverPosition(null);
              setHoverValue(null);
            }}
          >
            <div className="relative w-full h-full">
              {renderMarks()}
              {/* Hover measurement helper */}
              {hoverPosition !== null && hoverValue !== null && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: hoverPosition,
                      top: 0,
                      height: "100%",
                      width: "1px",
                      background: "rgba(59,130,246,0.9)",
                      boxShadow: "0 0 4px rgba(59,130,246,0.6)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: hoverPosition + 4,
                      top: 4,
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(15,23,42,0.9)",
                      color: "#f9fafb",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {unit === "cm"
                      ? `${hoverValue.toFixed(1)} cm`
                      : unit === "in"
                      ? `${hoverValue.toFixed(2)} in`
                      : `${Math.round(hoverValue)} px`}
                  </div>
                </>
              )}
            </div>
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
