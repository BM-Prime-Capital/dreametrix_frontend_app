
import { cn } from "@/utils/tailwind";
import { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-2.5 md:px-20", className)}>
      {children}
    </div>
  )
}
