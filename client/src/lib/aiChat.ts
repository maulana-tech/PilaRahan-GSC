import { generateGeminiResponse } from "./gemini";

// Fungsi untuk mendapatkan respons dari AI
export async function getAiChatResponse(message: string): Promise<string> {
  try {
    // Tambahkan konteks tentang PilaRahan ke prompt
    const enhancedPrompt = `Sebagai asisten AI PilaRahan yang fokus pada pengelolaan sampah dan lingkungan, tolong bantu menjawab pertanyaan berikut dengan informasi yang akurat dan bermanfaat: ${message}`;
    
    // Gunakan Gemini API untuk mendapatkan respons
    const response = await generateGeminiResponse(enhancedPrompt);
    return response;
  } catch (error) {
    console.error("Error saat mendapatkan respons AI:", error);
    throw error;
  }
}

// Fungsi untuk mendapatkan tips lingkungan berdasarkan konteks percakapan
export async function getEnvironmentalTips(context: string): Promise<string[]> {
  try {
    const prompt = `Berdasarkan konteks percakapan berikut: "${context}", berikan 3 tips praktis tentang pengelolaan sampah atau pelestarian lingkungan yang relevan. Berikan hanya daftar tips tanpa penjelasan tambahan.`;
    
    const response = await generateGeminiResponse(prompt);
    
    // Parsing respons menjadi array tips
    const tips = response
      .split(/\d+\.\s+/) // Split berdasarkan pola "1. ", "2. ", dll.
      .filter(tip => tip.trim().length > 0);
    
    return tips;
  } catch (error) {
    console.error("Error saat mendapatkan tips lingkungan:", error);
    return [];
  }
}