import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "accent" | "success" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const buttonVariants = {
  primary: "bg-primary hover:bg-primary-hover text-white shadow-sm",
  secondary: "bg-secondary hover:bg-secondary-hover text-white shadow-sm",
  accent: "bg-accent hover:bg-accent/80 text-white shadow-sm",
  success: "bg-success hover:bg-success/90 text-white shadow-sm",
  destructive: "bg-destructive hover:bg-destructive/90 text-white shadow-sm",
  outline: "border border-border bg-card hover:bg-accent/5 text-foreground",
  ghost: "hover:bg-accent/5 text-foreground",
};

const buttonSizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-lg",
};

export function StudentButton({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  children,
  className,
  ...props
}: StudentButtonProps) {
  return (
    <Button
      className={cn(
        "transition-all duration-200 font-medium",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </Button>
  );
}

// Specialized button components for common actions
export function ActionButton({
  children,
  icon,
  ...props
}: Omit<StudentButtonProps, "variant">) {
  return (
    <StudentButton variant="primary" icon={icon} {...props}>
      {children}
    </StudentButton>
  );
}

export function SecondaryActionButton({
  children,
  icon,
  ...props
}: Omit<StudentButtonProps, "variant">) {
  return (
    <StudentButton variant="secondary" icon={icon} {...props}>
      {children}
    </StudentButton>
  );
}

export function SuccessButton({
  children,
  icon,
  ...props
}: Omit<StudentButtonProps, "variant">) {
  return (
    <StudentButton variant="success" icon={icon} {...props}>
      {children}
    </StudentButton>
  );
}

export function DestructiveButton({
  children,
  icon,
  ...props
}: Omit<StudentButtonProps, "variant">) {
  return (
    <StudentButton variant="destructive" icon={icon} {...props}>
      {children}
    </StudentButton>
  );
}

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  ...props
}: Omit<StudentButtonProps, "children">) {
  return (
    <StudentButton
      variant={variant}
      size={size}
      icon={icon}
      className="p-2"
      {...props}
    />
  );
} 