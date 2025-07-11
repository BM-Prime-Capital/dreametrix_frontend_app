import { useState, useEffect, useCallback } from "react";
import { evaluateMathematicalExpression } from "../utils/expressionEvaluator";

export const MAX_INPUT_LENGTH = 16;
export const MAX_EXPRESSION_DISPLAY_LENGTH = 42;

export interface CalculatorLogic {
  expression: string;
  currentInput: string;
  isResultDisplayed: boolean;
  errorState: boolean;
  isDegrees: boolean;
  memoryValue: number;
  displayContent: string;
  clearAll: () => void;
  handleNumberClick: (numStr: string) => void;
  handleDecimalClick: () => void;
  handleOperatorClick: (op: string) => void;
  handleEquals: () => void;
  handleParenthesis: (paren: string) => void;
  handleBackspace: () => void;
  handleUnaryOp: (opType: string) => void;
  handleConstant: (constName: string) => void;
  handleToggleSign: () => void;
  handleMemoryClear: () => void;
  handleMemoryRecall: () => void;
  handleMemoryAdd: () => void;
  handleMemorySubtract: () => void;
  setIsDegrees: (value: boolean | ((prevState: boolean) => boolean)) => void;
  // Direct setters might be needed if Calculator.tsx needs to manipulate them for reasons outside this hook
  // For now, only exposing setIsDegrees as it's directly tied to a button
}

export const useCalculatorLogic = (): CalculatorLogic => {
  const [expression, setExpression] = useState<string>("");
  const [currentInput, setCurrentInput] = useState<string>("0");
  const [isResultDisplayed, setIsResultDisplayed] = useState<boolean>(false);
  const [errorState, setErrorState] = useState(false);
  const [isDegrees, setIsDegrees] = useState(true);
  const [memoryValue, setMemoryValue] = useState<number>(0);

  const clearAll = useCallback(() => {
    setExpression("");
    setCurrentInput("0");
    setIsResultDisplayed(false);
    setErrorState(false);
  }, []);

  useEffect(() => {
    if (errorState) {
      setCurrentInput("Error");
      setIsResultDisplayed(true);
    }
  }, [errorState]);

  const formatResult = useCallback((num: number): string => {
    let numStr = num.toString();
    if (numStr.length > MAX_INPUT_LENGTH) {
      numStr = num.toPrecision(MAX_INPUT_LENGTH - 4);
    }
    if (numStr.length > MAX_INPUT_LENGTH) {
      numStr = num.toExponential(MAX_INPUT_LENGTH - 6);
    }
    if (numStr.length > MAX_INPUT_LENGTH) {
      setErrorState(true);
      return "Error";
    }
    return numStr;
  }, []);

  const handleNumberClick = useCallback(
    (numStr: string) => {
      if (errorState) {
        clearAll();
      }
      if (isResultDisplayed) {
        setExpression("");
        setCurrentInput(numStr);
        setIsResultDisplayed(false);
      } else {
        if (currentInput === "0" && numStr !== ".") {
          setCurrentInput(numStr);
        } else {
          if (
            (expression + currentInput + numStr).length <=
            MAX_EXPRESSION_DISPLAY_LENGTH
          ) {
            setCurrentInput((prev) => prev + numStr);
          }
        }
      }
    },
    [errorState, clearAll, isResultDisplayed, currentInput, expression]
  );

  const handleDecimalClick = useCallback(() => {
    if (errorState) clearAll();
    if (isResultDisplayed) {
      setExpression("");
      setCurrentInput("0.");
      setIsResultDisplayed(false);
    } else {
      if (!currentInput.includes(".")) {
        if (
          (expression + currentInput + ".").length <=
          MAX_EXPRESSION_DISPLAY_LENGTH
        ) {
          setCurrentInput((prev) => prev + ".");
        }
      }
    }
  }, [errorState, clearAll, isResultDisplayed, currentInput, expression]);

  const handleOperatorClick = useCallback(
    (op: string) => {
      if (errorState) clearAll();

      if (currentInput === "0" && expression === "" && op === "-") {
        setCurrentInput("-");
        setIsResultDisplayed(false);
        return;
      }
      if (currentInput === "-" && op !== "-") {
        setCurrentInput("0");
      }

      if (currentInput !== "" && currentInput !== "-") {
        const newExpression = expression + currentInput + op;
        if (newExpression.length <= MAX_EXPRESSION_DISPLAY_LENGTH) {
          setExpression(newExpression);
          setCurrentInput("0");
          setIsResultDisplayed(false);
        }
      } else if (expression !== "") {
        const lastChar = expression.slice(-1);
        if (["+", "-", "*", "/", "^"].includes(lastChar)) {
          const newExpression = expression.slice(0, -1) + op;
          if (newExpression.length <= MAX_EXPRESSION_DISPLAY_LENGTH) {
            setExpression(newExpression);
          }
        }
      }
    },
    [errorState, clearAll, currentInput, expression]
  );

  const handleEquals = useCallback(() => {
    if (errorState) {
      clearAll();
      return;
    }
    let finalExpressionToEvaluate = expression;
    if (
      (currentInput !== "" && currentInput !== "0") ||
      (expression === "" && currentInput !== "0")
    ) {
      if (
        !(
          expression.length > 0 &&
          ["+", "-", "*", "/", "^", "("].includes(expression.slice(-1)) &&
          currentInput === "0"
        )
      ) {
        finalExpressionToEvaluate += currentInput;
      }
    }

    if (finalExpressionToEvaluate === "" || finalExpressionToEvaluate === "0") {
      if (currentInput === "0" && expression === "") {
        setCurrentInput("0");
        setIsResultDisplayed(true);
        setExpression("");
      }
      return;
    }

    const evaluationResult = evaluateMathematicalExpression(
      finalExpressionToEvaluate,
      isDegrees
    );

    if (evaluationResult.error) {
      setErrorState(true);
      setExpression(finalExpressionToEvaluate);
    } else if (
      evaluationResult.result !== null &&
      isFinite(evaluationResult.result)
    ) {
      setCurrentInput(formatResult(evaluationResult.result));
      setExpression("");
    } else {
      setErrorState(true);
      setExpression(finalExpressionToEvaluate);
    }
    setIsResultDisplayed(true);
  }, [errorState, clearAll, expression, currentInput, formatResult]);

  const handleParenthesis = useCallback(
    (paren: string) => {
      if (errorState) clearAll();

      if (isResultDisplayed) {
        setExpression(paren);
        setCurrentInput("0");
        setIsResultDisplayed(false);
        return;
      }

      setIsResultDisplayed(false);
      let baseExpression = expression;

      if (currentInput !== "" && currentInput !== "-") {
        const lastCharOfBaseExpr = baseExpression.slice(-1);
        const isCurrentInputAPlaceholderZero =
          currentInput === "0" &&
          baseExpression !== "" &&
          ["+", "-", "*", "/", "^", "("].includes(lastCharOfBaseExpr);
        if (!isCurrentInputAPlaceholderZero) {
          baseExpression += currentInput;
        }
      }

      let finalExpressionWithParen;
      if (paren === "(") {
        const lastChar = baseExpression.slice(-1);
        if (
          baseExpression !== "" &&
          (/\d/.test(lastChar) || lastChar === ")")
        ) {
          finalExpressionWithParen = baseExpression + "*" + paren;
        } else {
          finalExpressionWithParen = baseExpression + paren;
        }
      } else {
        finalExpressionWithParen = baseExpression + paren;
      }

      if (finalExpressionWithParen.length <= MAX_EXPRESSION_DISPLAY_LENGTH) {
        setExpression(finalExpressionWithParen);
        // Only reset currentInput to "0" for opening parenthesis, not closing
        if (paren === "(") {
          setCurrentInput("0");
        } else {
          // For closing parenthesis, clear currentInput but don't set to "0"
          setCurrentInput("");
        }
      }
    },
    [errorState, clearAll, isResultDisplayed, expression, currentInput]
  );

  const handleBackspace = useCallback(() => {
    if (errorState || isResultDisplayed) {
      clearAll();
      return;
    }
    if (currentInput !== "0" && currentInput !== "") {
      const newCurrentInput = currentInput.slice(0, -1);
      setCurrentInput(
        newCurrentInput === "" || newCurrentInput === "-"
          ? "0"
          : newCurrentInput
      );
    } else if (expression !== "") {
      setExpression((prev) => prev.slice(0, -1));
    }
  }, [errorState, isResultDisplayed, clearAll, currentInput, expression]);

  const handleUnaryOp = useCallback(
    (opType: string) => {
      if (errorState) {
        clearAll();
        return;
      }
      if (currentInput === "" || (currentInput === "0" && expression === ""))
        return;

      const val = parseFloat(currentInput);
      if (isNaN(val)) {
        setErrorState(true);
        return;
      }

      let result: number | null = null;
      switch (opType) {
        case "sin":
          result = isDegrees ? Math.sin((val * Math.PI) / 180) : Math.sin(val);
          break;
        case "cos":
          result = isDegrees ? Math.cos((val * Math.PI) / 180) : Math.cos(val);
          break;
        case "tan":
          if (isDegrees) {
            const angleDeg = Math.abs(val % 360);
            if (angleDeg === 90 || angleDeg === 270) {
              setErrorState(true);
              return;
            }
          } else {
            if (Math.abs(Math.cos(val)) < 1e-12) {
              setErrorState(true);
              return;
            }
          }
          result = isDegrees ? Math.tan((val * Math.PI) / 180) : Math.tan(val);
          break;
        case "log":
          if (val <= 0) {
            setErrorState(true);
            return;
          }
          result = Math.log10(val);
          break;
        case "ln":
          if (val <= 0) {
            setErrorState(true);
            return;
          }
          result = Math.log(val);
          break;
        case "sqrt":
          if (val < 0) {
            setErrorState(true);
            return;
          }
          result = Math.sqrt(val);
          break;
        case "sq":
          result = Math.pow(val, 2);
          break;
        case "inv":
          if (val === 0) {
            setErrorState(true);
            return;
          }
          result = 1 / val;
          break;
        case "%":
          result = val / 100;
          break;
        default:
          return;
      }

      if (result === null || isNaN(result) || !isFinite(result)) {
        setErrorState(true);
      } else {
        const resultString = formatResult(result);
        if (resultString === "Error") return;
        setCurrentInput(resultString);
        setIsResultDisplayed(true);
      }
    },
    [errorState, clearAll, currentInput, expression, isDegrees, formatResult]
  );

  const handleConstant = useCallback(
    (constName: string) => {
      if (errorState) clearAll();
      let valStr: string | null = null;
      switch (constName) {
        case "pi":
          valStr = formatResult(Math.PI);
          break;
        case "e":
          valStr = formatResult(Math.E);
          break;
        default:
          return;
      }
      if (valStr === "Error") return;

      if (isResultDisplayed || currentInput === "0") {
        setExpression("");
      }
      setCurrentInput(valStr);
      setIsResultDisplayed(true);
    },
    [errorState, clearAll, isResultDisplayed, currentInput, formatResult]
  );

  const handleToggleSign = useCallback(() => {
    if (errorState) return;
    if (
      currentInput !== "0" &&
      currentInput !== "Error" &&
      currentInput !== ""
    ) {
      if (currentInput.startsWith("-")) {
        setCurrentInput(currentInput.substring(1));
      } else {
        setCurrentInput("-" + currentInput);
      }
      setIsResultDisplayed(false);
    }
  }, [errorState, currentInput]);

  const handleMemoryClear = useCallback(() => setMemoryValue(0), []);
  const handleMemoryRecall = useCallback(() => {
    if (errorState) return;
    const memStr = formatResult(memoryValue);
    if (memStr === "Error") {
      setErrorState(true);
      return;
    }
    setCurrentInput(memStr);
    setExpression("");
    setIsResultDisplayed(true);
  }, [errorState, memoryValue, formatResult]);

  const handleMemoryAdd = useCallback(() => {
    if (errorState) return;
    const val = parseFloat(currentInput);
    if (!isNaN(val)) setMemoryValue((prev) => prev + val);
  }, [errorState, currentInput]);

  const handleMemorySubtract = useCallback(() => {
    if (errorState) return;
    const val = parseFloat(currentInput);
    if (!isNaN(val)) setMemoryValue((prev) => prev - val);
  }, [errorState, currentInput]);

  // Determine what to show on the display
  let displayContent = "0";
  if (errorState) {
    displayContent = "Error";
  } else if (isResultDisplayed) {
    displayContent = currentInput;
  } else {
    let currentInputDisplay = currentInput;
    const lastCharOfExpr = expression.slice(-1);
    const isPlaceholderZero =
      currentInput === "0" &&
      expression !== "" &&
      ["+", "-", "*", "/", "^", "("].includes(lastCharOfExpr);

    if (isPlaceholderZero || currentInput === "") {
      currentInputDisplay = "";
    }
    displayContent = expression + currentInputDisplay;
    if (displayContent === "") displayContent = "0";
  }
  if (displayContent.length > MAX_EXPRESSION_DISPLAY_LENGTH) {
    displayContent = displayContent.slice(
      displayContent.length - MAX_EXPRESSION_DISPLAY_LENGTH
    );
  }

  return {
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
  };
};
