import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import {
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  History,
  Settings,
} from "lucide-react";
import {
  getCalculatorButtons,
  CalculatorButtonConfig,
} from "./calculatorButtons";
import {
  useCalculatorLogic,
  MAX_EXPRESSION_DISPLAY_LENGTH,
} from "../../../hooks/useCalculatorLogic";

interface CalculatorProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
}

const Calculator: React.FC<CalculatorProps> = ({
  onClose,
  initialPosition,
}) => {
  const draggableNodeRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [animateButton, setAnimateButton] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const {
    expression,
    currentInput,
    isResultDisplayed,
    errorState,
    isDegrees,
    memoryValue,
    displayContent,
    clearAll,
    handleNumberClick,
    handleDecimalClick,
    handleOperatorClick,
    handleEquals,
    handleParenthesis,
    handleBackspace,
    handleUnaryOp,
    handleConstant,
    handleToggleSign,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleMemorySubtract,
    setIsDegrees,
  } = useCalculatorLogic();

  // Enhanced equals handler with history
  const handleEqualsWithHistory = () => {
    const currentExpression = `${expression}${currentInput}`;
    if (currentExpression && !errorState) {
      setHistory((prev) => [
        ...prev.slice(-9),
        `${currentExpression} = ${displayContent}`,
      ]);
    }
    handleEquals();
  };

  // Simple sound effect function
  const playSound = (type: "click" | "error" | "success") => {
    if (!soundEnabled) return;

    // Using Web Audio API for simple beeps
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case "click":
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case "error":
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        break;
      case "success":
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        break;
    }

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Animation helper
  const animateButtonPress = (buttonId: string) => {
    setAnimateButton(buttonId);
    setTimeout(() => setAnimateButton(null), 150);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return; // Don't interfere with input fields
      }

      e.preventDefault();

      if (e.key >= "0" && e.key <= "9") {
        handleNumberClick(e.key);
        playSound("click");
      } else if (e.key === ".") {
        handleDecimalClick();
        playSound("click");
      } else if (["+", "-", "*", "/"].includes(e.key)) {
        handleOperatorClick(e.key);
        playSound("click");
      } else if (e.key === "Enter" || e.key === "=") {
        handleEqualsWithHistory();
        playSound("success");
      } else if (e.key === "Escape") {
        clearAll();
        playSound("click");
      } else if (e.key === "Backspace") {
        handleBackspace();
        playSound("click");
      } else if (e.key === "(" || e.key === ")") {
        handleParenthesis(e.key);
        playSound("click");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    handleNumberClick,
    handleDecimalClick,
    handleOperatorClick,
    handleEquals,
    clearAll,
    handleBackspace,
    handleParenthesis,
  ]);

  // Get button configurations
  const buttons = getCalculatorButtons(isDegrees);

  const handleButtonClick = (btn: CalculatorButtonConfig) => {
    animateButtonPress(btn.id);

    if (
      errorState &&
      btn.id !== "clear" &&
      btn.id !== "del" &&
      btn.id !== "mc"
    ) {
      if (btn.id === "clear") clearAll();
      else if (btn.id === "del") handleBackspace();
      else if (btn.id === "mc") handleMemoryClear();
      playSound("error");
      return;
    }

    playSound(btn.id === "equals" ? "success" : "click");

    switch (btn.type) {
      case "number":
        if (btn.label === ".") handleDecimalClick();
        else handleNumberClick(btn.label);
        break;
      case "operator":
        handleOperatorClick(btn.symbol || btn.label);
        break;
      case "action":
        if (btn.id === "clear") clearAll();
        else if (btn.id === "equals") handleEqualsWithHistory();
        else if (btn.id === "del") handleBackspace();
        else if (btn.id === "toggle_sign") handleToggleSign();
        break;
      case "unary":
        handleUnaryOp(btn.id);
        break;
      case "constant":
        handleConstant(btn.id);
        break;
      case "paren":
        handleParenthesis(btn.label);
        break;
      case "mode":
        if (btn.id === "degrad") setIsDegrees(!isDegrees);
        break;
      case "memory":
        if (btn.id === "mc") handleMemoryClear();
        else if (btn.id === "mr") handleMemoryRecall();
        else if (btn.id === "m_plus") handleMemoryAdd();
        else if (btn.id === "m_minus") handleMemorySubtract();
        break;
      default:
        break;
    }
  };

  return (
    <Draggable
      handle=".calculator-drag-handle"
      defaultPosition={initialPosition}
      nodeRef={draggableNodeRef}
      cancel=".no-drag"
      bounds={{
        left: 0,
        top: 0,
        right: window.innerWidth - 350,
        bottom: window.innerHeight - 100,
      }}
      scale={1}
      grid={[1, 1]}
      defaultClassNameDragging="dragging"
      defaultClassNameDragged="dragged"
      enableUserSelectHack={false}
      allowAnyClick={false}
      disabled={false}
      axis="both"
      offsetParent={document.body}
    >
      <div
        ref={draggableNodeRef}
        className={`calculator-drag-handle fixed bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1 rounded-xl shadow-2xl text-white z-50 select-none transition-none border-2 border-slate-600 hover:border-slate-500 backdrop-blur-md cursor-move ${
          isMinimized ? "w-80 h-16" : isCompact ? "w-72" : "w-80"
        } ${isMinimized ? "animate-pulse" : ""}`}
        style={{
          minWidth: isMinimized ? "320px" : isCompact ? "288px" : "320px",
          maxWidth: "90vw",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)", // Hardware acceleration
        }}
      >
        {/* Enhanced Header */}
        <div className="h-8 mb-3 flex justify-between items-center px-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full opacity-80"></div>
            <span className="font-bold text-slate-300 ml-2">Calculator</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="no-drag text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-700/50"
              title="Settings"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="no-drag text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-700/50"
              title="History"
            >
              <History size={16} />
            </button>
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="no-drag text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-700/50"
              title={isCompact ? "Expand" : "Compact"}
            >
              {isCompact ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="no-drag text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-700/50"
              title={isMinimized ? "Restore" : "Minimize"}
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onClose}
              className="no-drag text-slate-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-slate-700/50"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="px-3 pb-3">
            {/* Settings Panel */}
            {showSettings && (
              <div className="no-drag bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 mb-3 border border-slate-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">
                    Settings
                  </span>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500 focus:ring-1"
                    />
                    Sound Effects
                  </label>
                </div>
              </div>
            )}

            {/* History Panel */}
            {showHistory && (
              <div className="no-drag bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 mb-3 max-h-32 overflow-y-auto border border-slate-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 font-medium">
                    History
                  </span>
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                {history.length === 0 ? (
                  <p className="text-xs text-slate-500">No history yet</p>
                ) : (
                  <div className="space-y-1">
                    {history.slice(-5).map((entry, index) => (
                      <div
                        key={index}
                        className="text-xs text-slate-300 font-mono break-all"
                      >
                        {entry}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Display */}
            <div className="no-drag bg-slate-900/80 backdrop-blur-sm text-right p-4 rounded-lg mb-4 border border-slate-600 relative overflow-hidden">
              {/* Status indicators */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      isDegrees
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-orange-500/20 text-orange-300"
                    }`}
                  >
                    {isDegrees ? "DEG" : "RAD"}
                  </span>
                  {memoryValue !== 0 && (
                    <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">
                      M
                    </span>
                  )}
                  {errorState && (
                    <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300">
                      ERR
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {expression && !isResultDisplayed && (
                    <span className="opacity-70">{expression}</span>
                  )}
                </div>
              </div>

              {/* Main display */}
              <div className="text-2xl font-mono font-medium text-white min-h-[2rem] flex items-center justify-end">
                <span
                  className={`transition-all duration-200 ${
                    errorState
                      ? "text-red-400"
                      : isResultDisplayed
                      ? "text-green-400"
                      : "text-white"
                  }`}
                >
                  {displayContent}
                </span>
              </div>
            </div>

            {/* Enhanced Button Grid */}
            <div
              className={`no-drag grid gap-2 ${
                isCompact ? "grid-cols-4" : "grid-cols-5"
              } ${isCompact ? "grid-rows-6" : "grid-rows-8"}`}
            >
              {(isCompact ? buttons.slice(5) : buttons).map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleButtonClick(btn)}
                  className={`no-drag p-3 rounded-lg text-sm font-semibold transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm
                    ${
                      animateButton === btn.id
                        ? "scale-95 shadow-inner"
                        : "hover:scale-105 active:scale-95"
                    }
                    ${
                      btn.className ||
                      "bg-slate-700/80 hover:bg-slate-600/80 focus:ring-slate-400 text-white border border-slate-600/50"
                    }
                    ${
                      errorState &&
                      btn.id !== "clear" &&
                      btn.id !== "del" &&
                      btn.id !== "mc"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:shadow-lg hover:-translate-y-0.5"
                    }
                  `}
                  disabled={
                    errorState &&
                    btn.id !== "clear" &&
                    btn.id !== "del" &&
                    btn.id !== "mc"
                  }
                  title={btn.label}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Quick Access Footer */}
            <div className=" mt-3 flex justify-center">
              <div className="text-xs text-slate-500 bg-slate-800/30 px-3 py-1 rounded-full border border-slate-700/50">
                <span className="hidden sm:inline">
                  Press ESC to clear • Enter for equals •{" "}
                </span>
                <span className="text-slate-400">
                  {isCompact ? "Compact" : "Full"} Mode
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default Calculator;

// Minor style refinement for display if needed:
// In the display div: className="... font-mono" (for a more classic calculator look)
// Button text size: text-sm or text-base depending on preference. Using text-sm for more compact look.
