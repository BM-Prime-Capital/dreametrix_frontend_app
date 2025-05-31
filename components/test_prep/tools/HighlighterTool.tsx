import React from "react";

interface HighlighterToolProps {
  // Props to control the highlighter, e.g., color, target content area
  targetRef: React.RefObject<HTMLElement>; // Ref to the content area to highlight
  color?: string;
  onHighlight?: (selection: Selection) => void; // Callback when text is highlighted
  isActive: boolean; // Added isActive prop
}

const HighlighterTool: React.FC<HighlighterToolProps> = ({
  targetRef,
  color = "yellow",
  onHighlight,
  isActive,
}) => {
  const handleHighlight = React.useCallback(() => {
    const selection = window.getSelection();
    console.log("[HighlighterTool] handleHighlight triggered");
    console.log("[HighlighterTool] isActive:", isActive);
    console.log("[HighlighterTool] Selection:", selection);

    if (selection && selection.rangeCount > 0) {
      console.log(
        "[HighlighterTool] Selection isCollapsed:",
        selection.isCollapsed
      );
      console.log("[HighlighterTool] Target ref current:", targetRef.current);
      console.log("[HighlighterTool] Anchor node:", selection.anchorNode);
      console.log("[HighlighterTool] Focus node:", selection.focusNode);

      if (targetRef.current) {
        console.log(
          "[HighlighterTool] Target contains anchorNode:",
          targetRef.current.contains(selection.anchorNode)
        );
        console.log(
          "[HighlighterTool] Target contains focusNode:",
          targetRef.current.contains(selection.focusNode)
        );
      }
    }

    if (
      selection &&
      selection.rangeCount > 0 && // Ensure there's a range
      !selection.isCollapsed &&
      targetRef.current &&
      selection.anchorNode && // Ensure anchorNode is not null
      selection.focusNode && // Ensure focusNode is not null
      targetRef.current.contains(selection.anchorNode) &&
      targetRef.current.contains(selection.focusNode)
    ) {
      console.log("[HighlighterTool] Conditions met for highlighting.");
      const range = selection.getRangeAt(0);
      console.log("[HighlighterTool] Range:", range);

      const span = document.createElement("span");
      span.style.backgroundColor = color;
      span.className = "user-highlight";
      span.style.cursor = "pointer";

      try {
        console.log(
          "[HighlighterTool] Attempting range.surroundContents(span)"
        );
        range.surroundContents(span);
        console.log(
          "[HighlighterTool] range.surroundContents(span) successful"
        );
        if (onHighlight) {
          onHighlight(selection);
        }
      } catch (e) {
        console.error("[HighlighterTool] Error applying highlight:", e);
        alert(
          "Could not apply highlight to the selected content. The selection might be too complex. Check console for details."
        );
      }
      selection.removeAllRanges();
    } else {
      console.log("[HighlighterTool] Conditions NOT met for highlighting.");
      if (selection && selection.isCollapsed) {
        console.log("[HighlighterTool] Reason: Selection is collapsed.");
      }
      if (!targetRef.current) {
        console.log("[HighlighterTool] Reason: targetRef.current is null.");
      }
      if (
        selection &&
        selection.rangeCount > 0 &&
        selection.anchorNode &&
        targetRef.current &&
        !targetRef.current.contains(selection.anchorNode)
      ) {
        console.log(
          "[HighlighterTool] Reason: Anchor node not contained in target."
        );
      }
      if (
        selection &&
        selection.rangeCount > 0 &&
        selection.focusNode &&
        targetRef.current &&
        !targetRef.current.contains(selection.focusNode)
      ) {
        console.log(
          "[HighlighterTool] Reason: Focus node not contained in target."
        );
      }
    }
  }, [targetRef, color, onHighlight, isActive]); // Added isActive to useCallback dependencies

  React.useEffect(() => {
    const targetElement = targetRef.current;
    if (!targetElement || !isActive) {
      if (isActive)
        console.log(
          "[HighlighterTool Effect] Target element not found, isActive:",
          isActive
        );
      else
        console.log(
          "[HighlighterTool Effect] Tool not active or target not found, isActive:",
          isActive
        );
      return;
    }

    console.log(
      "[HighlighterTool Effect] Adding mouseup listener, isActive:",
      isActive
    );
    const handleMouseUp = () => {
      console.log("[HighlighterTool Effect] mouseup event on targetElement");
      handleHighlight();
    };

    targetElement.addEventListener("mouseup", handleMouseUp);

    return () => {
      console.log(
        "[HighlighterTool Effect] Removing mouseup listener, isActive:",
        isActive
      );
      targetElement.removeEventListener("mouseup", handleMouseUp);
    };
  }, [targetRef, isActive, handleHighlight]); // handleHighlight is now stable due to useCallback

  return null;
};

export default HighlighterTool;
