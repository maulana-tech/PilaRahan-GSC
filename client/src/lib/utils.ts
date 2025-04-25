import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function classifyWasteType(prediction: number[]): {
  type: string;
  confidence: number;
  materialProperties: string[];
} {
  // Enhanced mapping of waste types with more specific categories
  const categories = [
    "Plastic",
    "Paper",
    "Glass",
    "Metal",
    "Organic",
    "Electronic",
    "Hazardous",
    "Textile",
    "Mixed",
    "Other",
  ];
  
  // Material composition database for different waste types
  const materialPropertiesMap: Record<string, string[]> = {
    "Plastic": ["Polymer-based", "Petroleum derivative", "Non-biodegradable"],
    "Paper": ["Cellulose fibers", "Biodegradable", "Recyclable pulp"],
    "Glass": ["Silica-based", "Inert material", "Indefinitely recyclable"],
    "Metal": ["Conductive", "Malleable", "High recyclability value"],
    "Organic": ["Biodegradable", "Compostable", "Carbon-rich"],
    "Electronic": ["Circuit boards", "Mixed materials", "Contains rare elements"],
    "Hazardous": ["Chemical compounds", "Potentially toxic", "Requires special processing"],
    "Textile": ["Fabric fibers", "Variable biodegradability", "Often mixed materials"],
    "Mixed": ["Multiple material types", "Complex separation required", "Limited recyclability"],
    "Other": ["Unclassified materials", "Specialized processing may be required"],
  };

  // Find top 3 predictions for more refined classification
  let indices = [];
  let tempPrediction = [...prediction];
  
  for (let i = 0; i < 3; i++) {
    const maxIndex = tempPrediction.indexOf(Math.max(...tempPrediction));
    indices.push(maxIndex);
    tempPrediction[maxIndex] = -1; // Mark as processed
  }
  
  // Calculate confidence with enhanced weighting
  const primaryIndex = indices[0];
  const primaryConfidence = prediction[primaryIndex];
  const secondaryIndex = indices[1];
  const secondaryConfidence = prediction[secondaryIndex];
  
  // If the top two predictions are close, apply more sophisticated decision logic
  const confidenceDifference = primaryConfidence - secondaryConfidence;
  
  // Better differentiation between recycle and organic
  // If the predictions are close and one is organic and one is recyclable, refine the decision
  let type = categories[primaryIndex];
  let confidence = primaryConfidence;
  
  if (confidenceDifference < 0.2) {
    const firstIsOrganic = primaryIndex === categories.indexOf("Organic");
    const secondIsRecyclable = ["Plastic", "Paper", "Glass", "Metal"].includes(categories[secondaryIndex]);
    
    // Improve sorting accuracy for borderline cases
    if (firstIsOrganic && secondIsRecyclable) {
      // Check for specific indicators of recyclability
      const recyclableIndicators = prediction.slice(0, 4).reduce((sum, val) => sum + val, 0);
      const organicIndicators = prediction[4]; // Organic index
      
      if (recyclableIndicators > organicIndicators * 1.5) {
        type = categories[secondaryIndex]; // Override to recyclable
        confidence = secondaryConfidence;
      }
    }
  }
  
  // Additional handling for mixed materials
  if (confidenceDifference < 0.1 && primaryConfidence < 0.4) {
    type = "Mixed";
    confidence = Math.max(0.6, primaryConfidence); // Boost confidence slightly for UI
  }

  return {
    type,
    confidence,
    materialProperties: materialPropertiesMap[type] || materialPropertiesMap["Other"]
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
