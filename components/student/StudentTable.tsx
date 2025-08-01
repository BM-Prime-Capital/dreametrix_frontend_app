import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StudentTableProps {
  children: React.ReactNode;
  className?: string;
}

export function StudentTable({ children, className }: StudentTableProps) {
  return (
    <Card className={cn("overflow-hidden border bg-card", className)}>
      <div className="overflow-x-auto">
        {children}
      </div>
    </Card>
  );
}

interface StudentTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function StudentTableHeader({ children, className }: StudentTableHeaderProps) {
  return (
    <thead className={cn("bg-muted/50 border-b", className)}>
      {children}
    </thead>
  );
}

interface StudentTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function StudentTableBody({ children, className }: StudentTableBodyProps) {
  return (
    <tbody className={cn("divide-y divide-border", className)}>
      {children}
    </tbody>
  );
}

interface StudentTableRowProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  onClick?: () => void;
}

export function StudentTableRow({ children, index = 0, className, onClick }: StudentTableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors",
        index % 2 === 0 ? "bg-accent/5" : "bg-card",
        onClick && "cursor-pointer hover:bg-accent/10",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface StudentTableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function StudentTableCell({ children, className, align = "left" }: StudentTableCellProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      className={cn(
        "p-4 text-muted-foreground",
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </td>
  );
}

interface StudentTableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function StudentTableHeaderCell({ children, className, align = "left" }: StudentTableHeaderCellProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th
      className={cn(
        "p-4 font-bold text-foreground",
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </th>
  );
}

// Complete table component with all parts
interface CompleteStudentTableProps {
  headers: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CompleteStudentTable({ headers, children, className }: CompleteStudentTableProps) {
  return (
    <StudentTable className={className}>
      <table className="w-full">
        <StudentTableHeader>
          {headers}
        </StudentTableHeader>
        <StudentTableBody>
          {children}
        </StudentTableBody>
      </table>
    </StudentTable>
  );
} 