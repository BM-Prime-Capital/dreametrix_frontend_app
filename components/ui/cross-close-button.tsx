import React from "react";

export default function CrossCloseButton({
  callBack,
  className,
}: {
  callBack: Function;
  className?: string;
}) {
  return (
    <span
      className={`text-muted-foreground cursor-pointer ${className}`}
      onClick={() => callBack()}
    >
      &#128473;
    </span>
  );
}
