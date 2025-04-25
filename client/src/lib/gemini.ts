import { apiRequest } from "./queryClient";

export interface GeminiResponse {
  recommendation: string;
  environmentalImpact: string[];
}

export async function getRecyclingRecommendations(
  wasteType: string,
  imageDescription?: string
): Promise<GeminiResponse> {
  try {
    const response = await apiRequest("POST", "/api/recommendations", {
      wasteType,
      imageDescription,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recycling recommendations:", error);
    throw new Error("Failed to get recycling recommendations. Please try again.");
  }
}
