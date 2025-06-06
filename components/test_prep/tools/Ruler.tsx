'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Minus, RotateCw, Lock, Unlock, Settings, Eye, Grid, ZoomIn, Maximize2, Minimize2 } from 'lucide-react';

interface RulerProps {
  onClose?: () => void;
}

type Unit = 'cm' | 'inches' | 'pixels';

interface Position {
  x: number;
  y: number;
}

const Ruler: React.FC<RulerProps> = ({ onClose }) => {
  // Basic state
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 });
  const [rulerLength, setRulerLength] = useState(400);
  const [rotation, setRotation] = useState(0);
  const [unit, setUnit] = useState<Unit>('cm');
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  // Advanced features state
  const [isLocked, setIsLocked] = useState(false);
  const [transparency, setTransparency] = useState(0.9);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showRotationControls, setShowRotationControls] = useState(false);
  const [magneticSnap, setMagneticSnap] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [compactMode, setCompactMode] = useState(false);
  const [customAngle, setCustomAngle] = useState('');

  // Refs
  const rulerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
  const rotationStartRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Constants
  const PIXELS_PER_CM = 37.8;
  const PIXELS_PER_INCH = 96;
  const MIN_LENGTH = 200;
  const MAX_LENGTH = 800;
  const SNAP_ANGLES = [0, 15, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360];

  // Get pixels per unit based on current unit
  const getPixelsPerUnit = () => {
    switch (unit) {
      case 'cm': return PIXELS_PER_CM;
      case 'inches': return PIXELS_PER_INCH;
      case 'pixels': return 1;
      default: return PIXELS_PER_CM;
    }
  };

  // Snap rotation to nearest angle if magnetic snap is enabled
  const snapRotation = (angle: number) => {
    if (!magneticSnap) return angle;
    
    const snapThreshold = 5;
    for (const snapAngle of SNAP_ANGLES) {
      if (Math.abs(angle - snapAngle) <= snapThreshold) {
        return snapAngle;
      }
    }
    return angle;
  };

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [isLocked, position]);

  // Handle rotation start
  const handleRotationStart = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);
    rotationStartRef.current = rotation;
    
    const rect = rulerRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      rotationStartRef.current = rotation - startAngle;
    }
  }, [isLocked, rotation]);

  // Handle mouse move with animation frame for smooth updates
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (isDragging && !isLocked) {
        setPosition({
          x: e.clientX - dragStartRef.current.x,
          y: e.clientY - dragStartRef.current.y
        });
      }

      if (isRotating && !isLocked) {
        const rect = rulerRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
          const newRotation = snapRotation(rotationStartRef.current + angle);
          setRotation(newRotation);
        }
      }
    });
  }, [isDragging, isRotating, isLocked]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsRotating(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Add event listeners
  useEffect(() => {
    if (isDragging || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging, isRotating, handleMouseMove, handleMouseUp]);

  // Handle length adjustment
  const adjustLength = (delta: number) => {
    setRulerLength(prev => Math.max(MIN_LENGTH, Math.min(MAX_LENGTH, prev + delta)));
  };

  // Handle custom angle input
  const handleCustomAngle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const angle = parseFloat(customAngle);
      if (!isNaN(angle)) {
        setRotation(angle % 360);
        setCustomAngle('');
      }
    }
  };

  // Generate ruler graduations
  const generateGraduations = () => {
    const pixelsPerUnit = getPixelsPerUnit();
    const totalUnits = rulerLength / pixelsPerUnit;
    const graduations = [];

    for (let i = 0; i <= totalUnits; i += 0.1) {
      const position = (i * pixelsPerUnit);
      if (position > rulerLength) break;

      const isMajor = i % 1 === 0;
      const isHalf = i % 0.5 === 0 && !isMajor;
      const isMinor = i % 0.1 === 0 && !isHalf && !isMajor;

      if (isMajor || (isHalf && !compactMode) || (isMinor && !compactMode && zoomLevel > 1)) {
        graduations.push({
          position,
          value: i,
          isMajor,
          isHalf,
          isMinor
        });
      }
    }

    return graduations;
  };

  const graduations = generateGraduations();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Grid overlay */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${getPixelsPerUnit()}px ${getPixelsPerUnit()}px`
          }}
        />
      )}

      {/* Ruler container */}
      <div
        ref={rulerRef}
        className="absolute pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
          transform: `rotate(${rotation}deg)`,
          opacity: transparency,
          cursor: isLocked ? 'default' : (isDragging ? 'grabbing' : 'grab'),
          transformOrigin: 'center center',
          zIndex: 1000
        }}
      >
        {/* Main ruler body */}
        <div
          className={`relative bg-gradient-to-b from-white via-gray-50 to-gray-100 border-2 border-gray-300 shadow-lg transition-all duration-200 ${
            compactMode ? 'h-8' : 'h-12'
          }`}
          style={{ 
            width: rulerLength,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'left center'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Graduations */}
          {graduations.map((grad, index) => (
            <div key={index}>
              {/* Graduation mark */}
              <div
                className={`absolute border-l-2 transition-all duration-150 ${
                  grad.isMajor 
                    ? 'border-gray-800 h-8' 
                    : grad.isHalf 
                    ? 'border-gray-600 h-5' 
                    : 'border-gray-400 h-3'
                } ${compactMode && !grad.isMajor ? 'hidden' : ''}`}
                style={{ 
                  left: grad.position,
                  background: grad.isMajor 
                    ? 'linear-gradient(to bottom, #374151, #6b7280)' 
                    : grad.isHalf 
                    ? 'linear-gradient(to bottom, #6b7280, #9ca3af)'
                    : 'linear-gradient(to bottom, #9ca3af, #d1d5db)'
                }}
              />
              
              {/* Number labels */}
              {grad.isMajor && (
                <div
                  className="absolute text-xs font-medium text-gray-800 pointer-events-none select-none"
                  style={{
                    left: grad.position - 8,
                    top: compactMode ? -2 : 2,
                    fontSize: compactMode ? '10px' : '12px'
                  }}
                >
                  {Math.round(grad.value)}
                </div>
              )}
              
              {/* Half-unit labels for better precision */}
              {grad.isHalf && !compactMode && zoomLevel > 0.8 && (
                <div
                  className="absolute text-xs text-gray-600 pointer-events-none select-none"
                  style={{
                    left: grad.position - 4,
                    top: 6,
                    fontSize: '10px'
                  }}
                >
                  .5
                </div>
              )}
            </div>
          ))}

          {/* Unit label */}
          <div className="absolute right-2 top-1 text-xs font-semibold text-gray-700 bg-white/80 px-1 rounded">
            {unit}
          </div>
        </div>

        {/* Control buttons */}
        <div className="absolute -top-12 left-0 flex gap-1">
          {/* Length controls */}
          <button
            onClick={() => adjustLength(-20)}
            className="p-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
            disabled={rulerLength <= MIN_LENGTH}
            title="Decrease length"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => adjustLength(20)}
            className="p-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
            disabled={rulerLength >= MAX_LENGTH}
            title="Increase length"
          >
            <Plus size={14} />
          </button>

          {/* Unit selector */}
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="px-2 py-1 text-xs border rounded shadow bg-white"
          >
            <option value="cm">cm</option>
            <option value="inches">in</option>
            <option value="pixels">px</option>
          </select>

          {/* Lock toggle */}
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-1 rounded shadow transition-colors ${
              isLocked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={isLocked ? 'Unlock ruler' : 'Lock ruler'}
          >
            {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>

          {/* Advanced controls toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition-colors"
            title="Advanced controls"
          >
            <Settings size={14} />
          </button>

          {/* Rotation controls toggle */}
          <button
            onClick={() => setShowRotationControls(!showRotationControls)}
            className="p-1 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition-colors"
            title="Rotation controls"
          >
            <RotateCw size={14} />
          </button>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition-colors"
              title="Close ruler"
            >
              ×
            </button>
          )}
        </div>

        {/* Rotation controls panel */}
        {showRotationControls && (
          <div className="absolute -bottom-16 left-0 bg-white border rounded-lg shadow-lg p-3 min-w-64">
            <div className="text-xs font-semibold mb-2">Rotation Controls</div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onMouseDown={handleRotationStart}
                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Drag to rotate"
              >
                <RotateCw size={14} />
              </button>
              <span className="text-xs">{Math.round(rotation)}°</span>
              <button
                onClick={() => setRotation(0)}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Custom angle"
                value={customAngle}
                onChange={(e) => setCustomAngle(e.target.value)}
                onKeyDown={handleCustomAngle}
                className="px-2 py-1 text-xs border rounded w-20"
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={magneticSnap}
                  onChange={(e) => setMagneticSnap(e.target.checked)}
                  className="w-3 h-3"
                />
                Snap
              </label>
            </div>
          </div>
        )}

        {/* Advanced controls panel */}
        {showAdvanced && (
          <div className="absolute -bottom-20 right-0 bg-white border rounded-lg shadow-lg p-3 min-w-64">
            <div className="text-xs font-semibold mb-2">Advanced Controls</div>
            
            {/* Transparency */}
            <div className="flex items-center gap-2 mb-2">
              <Eye size={12} />
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={transparency}
                onChange={(e) => setTransparency(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-8">{Math.round(transparency * 100)}%</span>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-2 mb-2">
              <ZoomIn size={12} />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-8">{zoomLevel.toFixed(1)}x</span>
            </div>

            {/* Feature toggles */}
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-3 h-3"
                />
                <Grid size={12} />
                Grid
              </label>
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="w-3 h-3"
                />
                {compactMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                Compact
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ruler;
