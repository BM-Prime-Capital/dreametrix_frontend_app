import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clone the first child (trigger) with onClick to toggle dropdown
  const enhancedTrigger = React.Children.map(children, (child, index) => {
    // Only enhance the first child (the trigger)
    if (index === 0 && React.isValidElement(child)) {
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setIsOpen(!isOpen);
          // Call the original onClick if it exists
          if (child.props.onClick) {
            child.props.onClick(e);
          }
        },
      });
    }
    return child;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {enhancedTrigger}
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg py-1 min-w-[8rem]">
          {React.Children.map(children, (child, index) => {
            // Skip the first child (trigger) in the dropdown content
            if (index > 0) {
              return child;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;