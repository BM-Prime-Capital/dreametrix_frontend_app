import React from "react";

interface EraserToolProps {
  targetRef: React.RefObject<HTMLElement>; // Ref to the content area
  onErase?: (element: HTMLElement) => void; // Callback when a highlight is erased
  // A way to identify highlighted spans, e.g., a specific class name
  highlightClassName?: string;
  isActive: boolean; // Added isActive prop
}

const EraserTool: React.FC<EraserToolProps> = ({
  targetRef,
  onErase,
  highlightClassName = "user-highlight", // Default class name for highlights
  isActive, // Added isActive prop
}) => {
  const removeHighlight = (element: HTMLElement) => {
    // Check if the element is a highlight span
    if (
      element.nodeName === "SPAN" &&
      element.classList.contains(highlightClassName)
    ) {
      const parent = element.parentNode;
      if (parent) {
        // Unwrap the content of the span
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
        if (onErase) {
          onErase(element);
        }
      }
    } else if (element.nodeName === "SPAN" && element.style.backgroundColor) {
      // Fallback for highlights applied directly with style if no class was added
      // This is less robust than using a class name
      const parent = element.parentNode;
      if (parent) {
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
        if (onErase) {
          onErase(element);
        }
      }
    }
  };

  React.useEffect(() => {
    const targetElement = targetRef.current;
    // Only attach listener if the tool is active and target exists
    if (!targetElement || !isActive) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      // Only attempt to erase if this tool is "active"
      // (activation logic would be managed by a parent toolbar)
      // and the clicked element is part of the target content area.
      if (targetElement.contains(event.target as Node)) {
        removeHighlight(event.target as HTMLElement);
      }
    };

    // This is a simplified listener. In a real app, you'd want to ensure
    // this listener is only active when the eraser tool is selected,
    // and potentially use 'mouseover' for a drag-to-erase effect.
    // For simplicity, we use 'click' for now.
    targetElement.addEventListener("click", handleClick, true); // Use capture phase to get the clicked element directly

    return () => {
      targetElement.removeEventListener("click", handleClick, true);
    };
  }, [targetRef, onErase, highlightClassName, isActive, removeHighlight]); // Added isActive and removeHighlight to dependency array

  // This component might not render UI itself, but rather provide logic
  // or be activated by a button in an AnnotationToolbar.
  return null;
};

export default EraserTool;

// It's important that HighlighterTool adds a specific class (e.g., "user-highlight")
// to the spans it creates so the EraserTool can reliably identify them.
// Modify HighlighterTool.tsx:
// const span = document.createElement('span');
// span.style.backgroundColor = color;
// span.className = "user-highlight"; // Add this line
// span.setAttribute('data-highlight-color', color); // Optionally store color for more advanced eraser logic
