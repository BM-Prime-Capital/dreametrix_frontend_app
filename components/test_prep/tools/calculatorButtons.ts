export interface CalculatorButtonConfig {
  id: string;
  label: string;
  type:
    | "number"
    | "operator"
    | "action"
    | "unary"
    | "constant"
    | "paren"
    | "mode"
    | "memory";
  symbol?: string;
  className?: string;
}

export const getCalculatorButtons = (
  isDegrees: boolean
): CalculatorButtonConfig[] => [
  // Row 1: Memory and Sign Toggle
  {
    id: "mc",
    label: "MC",
    type: "memory",
    className:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400/50",
  },
  {
    id: "mr",
    label: "MR",
    type: "memory",
    className:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400/50",
  },
  {
    id: "m_plus",
    label: "M+",
    type: "memory",
    className:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400/50",
  },
  {
    id: "m_minus",
    label: "M-",
    type: "memory",
    className:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400/50",
  },
  {
    id: "toggle_sign",
    label: "±",
    type: "action",
    className:
      "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg border border-slate-500/50",
  },

  // Row 2
  {
    id: "lparen",
    label: "(",
    type: "paren",
    className:
      "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg border border-slate-500/50",
  },
  {
    id: "rparen",
    label: ")",
    type: "paren",
    className:
      "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg border border-slate-500/50",
  },
  {
    id: "del",
    label: "⌫", // Modern backspace symbol
    type: "action",
    className:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border border-red-400/50",
  },
  {
    id: "clear",
    label: "AC",
    type: "action",
    className:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border border-red-400/50 col-span-2",
  },

  // Row 3 (Trig, Powers)
  {
    id: "sin",
    label: "sin",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "cos",
    label: "cos",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "tan",
    label: "tan",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "sq",
    label: "x²",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "sqrt",
    label: "√",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },

  // Row 4 (Logs, Power, Inverse, Constants)
  {
    id: "log",
    label: "log",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "ln",
    label: "ln",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "pow",
    label: "xʸ",
    type: "operator",
    symbol: "^",
    className:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg border border-indigo-400/50",
  },
  {
    id: "inv",
    label: "1/x",
    type: "unary",
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "pi",
    label: "π",
    type: "constant",
    className:
      "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg border border-purple-400/50",
  },

  // Row 5 (Numbers, Operators)
  {
    id: "seven",
    label: "7",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "eight",
    label: "8",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "nine",
    label: "9",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "divide",
    label: "÷",
    symbol: "/",
    type: "operator",
    className:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg border border-indigo-400/50",
  },
  {
    id: "multiply",
    label: "×",
    symbol: "*",
    type: "operator",
    className:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg border border-indigo-400/50",
  },

  // Row 6 (Numbers, Operators)
  {
    id: "four",
    label: "4",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "five",
    label: "5",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "six",
    label: "6",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "add",
    label: "+",
    type: "operator",
    className:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg border border-indigo-400/50",
  },
  {
    id: "subtract",
    label: "-",
    type: "operator",
    className:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg border border-indigo-400/50",
  },

  // Row 7 (Numbers)
  {
    id: "one",
    label: "1",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "two",
    label: "2",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "three",
    label: "3",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "zero",
    label: "0",
    type: "number",
    className:
      "col-span-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  // Row 8 (Decimal, Percent, Mode, Equals)
  {
    id: "decimal",
    label: ".",
    type: "number",
    className:
      "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg border border-slate-600/50",
  },
  {
    id: "percent",
    label: "%",
    type: "unary", // Often unary, but can be binary in some contexts. Simplified to unary.
    className:
      "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg border border-sky-500/50",
  },
  {
    id: "degrad",
    label: isDegrees ? "DEG" : "RAD",
    type: "mode",
    className:
      "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg border border-teal-400/50",
  },
  {
    id: "equals",
    label: "=",
    type: "action",
    className:
      "col-span-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg border border-orange-400/50",
  },
];
