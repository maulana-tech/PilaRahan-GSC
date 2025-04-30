import { apiRequest } from "./queryClient";

export interface AiChatResponse {
  message: string;
  environmentalTips: string[];
}

export async function getAiChatResponse(
  message: string
): Promise<AiChatResponse> {
  try {
    const response = await apiRequest("POST", "/api/ai-chat", {
      message,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching AI chat response:", error);
    throw new Error("Gagal mendapatkan respons dari AI. Silakan coba lagi.");
  }
}