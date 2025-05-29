// Mathematical expression evaluator for the calculator
// Safely evaluates mathematical expressions with support for various functions

export interface EvaluationResult {
  result: number;
  error?: string;
}

export const evaluateMathematicalExpression = (
  expression: string,
  isDegrees: boolean = true
): EvaluationResult => {
  try {
    // Remove spaces and validate the expression
    const cleanExpression = expression.replace(/\s+/g, "");

    if (!cleanExpression || cleanExpression === "") {
      return { result: 0 };
    }

    // Replace mathematical symbols with JavaScript equivalents
    let processedExpression = cleanExpression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString());

    // Handle percentage operations (convert % to /100)
    processedExpression = processedExpression.replace(
      /(\d+(?:\.\d+)?)%/g,
      "($1/100)"
    );

    // Handle powers (x^y becomes Math.pow(x,y))
    processedExpression = processedExpression.replace(
      /(\d+(?:\.\d+)?|\([^)]+\))\^(\d+(?:\.\d+)?|\([^)]+\))/g,
      "Math.pow($1,$2)"
    );

    // Handle trigonometric functions
    const angleConverter = isDegrees ? "(Math.PI/180)*" : "";

    processedExpression = processedExpression
      .replace(/sin\(/g, `Math.sin(${angleConverter}`)
      .replace(/cos\(/g, `Math.cos(${angleConverter}`)
      .replace(/tan\(/g, `Math.tan(${angleConverter}`)
      .replace(/asin\(/g, `Math.asin(`)
      .replace(/acos\(/g, `Math.acos(`)
      .replace(/atan\(/g, `Math.atan(`);

    // Handle other mathematical functions
    processedExpression = processedExpression
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/floor\(/g, "Math.floor(")
      .replace(/ceil\(/g, "Math.ceil(")
      .replace(/round\(/g, "Math.round(");

    // Validate that the expression only contains allowed characters
    const allowedPattern = /^[0-9+\-*/().\s,MathpiePowlogsincoatqrfblceu]+$/i;
    if (!allowedPattern.test(processedExpression)) {
      return { result: 0, error: "Invalid characters in expression" };
    }

    // Check for balanced parentheses
    let parenCount = 0;
    for (const char of processedExpression) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (parenCount < 0) {
        return { result: 0, error: "Mismatched parentheses" };
      }
    }
    if (parenCount !== 0) {
      return { result: 0, error: "Mismatched parentheses" };
    }

    // Use Function constructor for safer evaluation than eval()
    const result = Function(`"use strict"; return (${processedExpression})`)();

    // Check for invalid results
    if (typeof result !== "number" || !isFinite(result)) {
      return { result: 0, error: "Invalid calculation result" };
    }

    // Round to avoid floating point precision issues
    return { result: Number(result.toPrecision(15)) };
  } catch (error) {
    return { result: 0, error: "Calculation error" };
  }
};

// Helper functions for specific calculator operations
export const performUnaryOperation = (
  value: number,
  operation: string,
  isDegrees: boolean = true
): EvaluationResult => {
  try {
    let result: number;

    switch (operation) {
      case "sin":
        result = Math.sin(isDegrees ? (value * Math.PI) / 180 : value);
        break;
      case "cos":
        result = Math.cos(isDegrees ? (value * Math.PI) / 180 : value);
        break;
      case "tan":
        result = Math.tan(isDegrees ? (value * Math.PI) / 180 : value);
        break;
      case "asin":
        result = Math.asin(value);
        if (isDegrees) result = (result * 180) / Math.PI;
        break;
      case "acos":
        result = Math.acos(value);
        if (isDegrees) result = (result * 180) / Math.PI;
        break;
      case "atan":
        result = Math.atan(value);
        if (isDegrees) result = (result * 180) / Math.PI;
        break;
      case "log":
        result = Math.log10(value);
        break;
      case "ln":
        result = Math.log(value);
        break;
      case "sqrt":
        result = Math.sqrt(value);
        break;
      case "sq":
        result = value * value;
        break;
      case "inv":
        result = 1 / value;
        break;
      case "percent":
        result = value / 100;
        break;
      case "abs":
        result = Math.abs(value);
        break;
      case "floor":
        result = Math.floor(value);
        break;
      case "ceil":
        result = Math.ceil(value);
        break;
      case "round":
        result = Math.round(value);
        break;
      default:
        return { result: 0, error: `Unknown operation: ${operation}` };
    }

    if (typeof result !== "number" || !isFinite(result)) {
      return { result: 0, error: "Invalid operation result" };
    }

    return { result: Number(result.toPrecision(15)) };
  } catch (error) {
    return { result: 0, error: "Operation error" };
  }
};

// Get mathematical constants
export const getConstantValue = (constantName: string): number => {
  switch (constantName) {
    case "pi":
      return Math.PI;
    case "e":
      return Math.E;
    default:
      return 0;
  }
};

// Format number for display
export const formatDisplayNumber = (
  num: number,
  maxLength: number = 15
): string => {
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  const numStr = num.toString();

  // If the number is too long, use scientific notation
  if (numStr.length > maxLength) {
    if (absNum >= 1e15 || absNum < 1e-6) {
      return num.toExponential(6);
    } else {
      return num.toPrecision(8);
    }
  }

  // Remove trailing zeros for decimal numbers
  if (numStr.includes(".")) {
    return parseFloat(num.toFixed(10)).toString();
  }

  return numStr;
};
