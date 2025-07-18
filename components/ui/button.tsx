import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/tailwind";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
        outline: "border-2 border-input bg-background hover:bg-muted hover:border-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm hover:shadow-md",
        ghost: "hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        subtle: "bg-primary-muted text-primary hover:bg-primary-muted/80",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm hover:shadow-md",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm hover:shadow-md",
        info: "bg-info text-info-foreground hover:bg-info/90 shadow-sm hover:shadow-md",
        gradient: "bg-gradient-primary text-white hover:shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2 text-xs rounded",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-6 rounded-md text-base",
        xl: "h-12 px-8 rounded-lg text-base",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
        "icon-lg": "h-12 w-12 rounded-full",
      },
      rounded: {
        default: "rounded-md",
        none: "rounded-none",
        sm: "rounded",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
    compoundVariants: [
      {
        variant: ["outline", "ghost", "link"],
        className: "shadow-none hover:shadow-none",
      },
    ],
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    asChild = false, 
    isLoading = false, 
    leftIcon,
    rightIcon,
    children, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {!isLoading && leftIcon}
          {children}
          {!isLoading && rightIcon}
        </span>
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
