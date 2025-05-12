import React from 'react';

interface ToggleProps {
  children: React.ReactNode;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  'aria-label': string;
}

export const Toggle: React.FC<ToggleProps> = ({
  children,
  pressed,
  onPressedChange,
  'aria-label': ariaLabel,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      aria-label={ariaLabel}
      data-state={pressed ? 'on' : 'off'}
      className={`inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
        pressed ? 'bg-gray-200' : 'bg-transparent'
      }`}
      onClick={() => onPressedChange(!pressed)}
    >
      {children}
    </button>
  );
};

export default Toggle;