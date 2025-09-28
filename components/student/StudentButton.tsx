import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentButtonProps extends Omit<ButtonProps, "size" | "variant"> {
  variant?: "primary" | "secondary" | "accent" | "success" | "destructive" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const buttonVariants = {
  primary: "bg-primary hover:bg-primary/90 text-white shadow-sm",
  secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-sm",
  accent: "bg-accent hover:bg-accent/80 text-white shadow-sm",
  success: "bg-success hover:bg-success/90 text-white shadow-sm",
  destructive: "bg-destructive hover:bg-destructive/90 text-white shadow-sm",
  outline: "border border-border bg-card hover:bg-accent/5 text-foreground",
  ghost: "hover:bg-accent/5 text-foreground",
};

const buttonSizes = {
  sm: "h-8 px-3 text-sm",
  default: "h-10 px-4 text-base", // correspond à l'ancien "md"
  lg: "h-12 px-6 text-lg",
};

export function StudentButton({
  variant = "primary",
  size = "default",
  icon,
  iconPosition = "left",
  children,
  className,
  ...props
}: StudentButtonProps) {
  return (
    <Button
      className={cn(
        "transition-all duration-200 font-medium inline-flex items-center",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </Button>
  );
}

// Specialized button variants
export function ActionButton(props: StudentButtonProps) {
  return <StudentButton variant="primary" {...props} />;
}

export function SecondaryActionButton(props: StudentButtonProps) {
  return <StudentButton variant="secondary" {...props} />;
}

export function SuccessButton(props: StudentButtonProps) {
  return <StudentButton variant="success" {...props} />;
}

export function DestructiveButton(props: StudentButtonProps) {
  return <StudentButton variant="destructive" {...props} />;
}

export function IconButton({
  icon,
  variant = "ghost",
  size = "default",
  ...props
}: Omit<StudentButtonProps, "children">) {
  return (
    <StudentButton
      icon={icon}
      variant={variant}
      size={size}
      className="p-2"
      {...props}
    />
  );
}
