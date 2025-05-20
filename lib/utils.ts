import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a price with currency symbol
 * @param price - The price to format
 * @param currency - The currency symbol to use (defaults to €)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = "₵") {
  return `${currency}${price.toFixed(2)}`;
}
