import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function classifyWasteType(prediction: number[]): {
  type: string;
  confidence: number;
} {
  // Example mapping of prediction indices to waste types
  const categories = [
    "Plastic",
    "Paper",
    "Glass",
    "Metal",
    "Organic",
    "Electronic",
    "Hazardous",
    "Other",
  ];

  // Find the index with the highest confidence
  const maxIndex = prediction.indexOf(Math.max(...prediction));
  const confidence = prediction[maxIndex];

  return {
    type: categories[maxIndex],
    confidence: confidence,
  };
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat((d * 0.621371).toFixed(1)); // Convert to miles and limit decimal places
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
