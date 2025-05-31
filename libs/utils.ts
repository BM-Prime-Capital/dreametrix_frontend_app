import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assignRandomSeatNumbers(seats: any[], totalSeats: number): any[] {
  if (seats.length > totalSeats) {
    throw new Error("Cannot assign unique seat numbers. Too many seats!");
  }

  // Generate an array of unique seat numbers from 0 to totalSeats-1
  const availableNumbers = Array.from({ length: totalSeats }, (_, i) => i);

  // Shuffle the seat numbers
  for (let i = availableNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableNumbers[i], availableNumbers[j]] = [
      availableNumbers[j],
      availableNumbers[i],
    ];
  }

  // Assign shuffled numbers to the seats
  return seats.map((seat, index) => ({
    ...seat,
    seatNumber: availableNumbers[index],
  }));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}