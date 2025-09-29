import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tailwind";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Grade variants
        "grade-a":
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        "grade-b":
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        "grade-c":
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        "grade-d":
          "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200",
        "grade-f":
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        // Performance variants
        "performance-excellent":
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        "performance-good":
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        "performance-satisfactory":
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        "performance-needs-improvement":
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
