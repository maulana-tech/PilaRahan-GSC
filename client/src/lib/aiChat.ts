// Import renamed to avoid conflict with local declaration
import { generateGeminiResponse as geminiApiResponse } from "./gemini";

// Fungsi untuk mendapatkan respons dari AI
export async function getAiChatResponse(message: string): Promise<string> {
  try {
    // Tambahkan konteks tentang PilaRahan ke prompt
    const enhancedPrompt = `Sebagai asisten AI PilaRahan yang fokus pada pengelolaan sampah dan lingkungan, tolong bantu menjawab pertanyaan berikut dengan informasi yang akurat dan bermanfaat: ${message}`;
    
    // Gunakan fungsi dari gemini.ts sebagai fallback jika proxy gagal
    try {
      // Coba gunakan proxy server terlebih dahulu
      const response = await generateGeminiResponse(enhancedPrompt);
      return response;
    } catch (proxyError) {
      console.warn("Gagal menggunakan proxy, mencoba metode langsung:", proxyError);
      // Jika proxy gagal, gunakan metode langsung dari gemini.ts
      return await geminiApiResponse(enhancedPrompt);
    }
  } catch (error) {
    console.error("Error saat mendapatkan respons AI:", error);
    
    // Berikan respons fallback jika terjadi error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "Maaf, saya tidak dapat memproses permintaan Anda saat ini karena masalah dengan API key. Silakan hubungi administrator untuk mengatur API key Gemini dengan benar.";
      } else if (error.message.includes("koneksi") || error.message.includes("terhubung") || error.message.includes("fetch")) {
        return "Maaf, saya tidak dapat terhubung ke layanan AI saat ini. Silakan periksa koneksi internet Anda dan coba lagi nanti.";
      } else if (error.message.includes("JSON") || error.message.includes("<!DOCTYPE")) {
        return "Maaf, terjadi kesalahan saat berkomunikasi dengan server. Tim kami sedang menyelesaikan masalah ini.";
      }
    }
    
    return "Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi nanti.";
  }
}

// Fungsi untuk mendapatkan tips lingkungan berdasarkan konteks percakapan
export async function getEnvironmentalTips(context: string): Promise<string[]> {
  try {
    const prompt = `Berdasarkan konteks percakapan berikut: "${context}", berikan 3 tips praktis tentang pengelolaan sampah atau pelestarian lingkungan yang relevan. Berikan hanya daftar tips tanpa penjelasan tambahan.`;
    
    try {
      // Coba gunakan proxy server terlebih dahulu
      const response = await generateGeminiResponse(prompt);
      
      // Parsing respons menjadi array tips
      const tips = response
        .split(/\d+\.\s+/) // Split berdasarkan pola "1. ", "2. ", dll.
        .filter(tip => tip.trim().length > 0);
      
      return tips;
    } catch (proxyError) {
      console.warn("Gagal menggunakan proxy untuk tips, mencoba metode langsung:", proxyError);
      // Jika proxy gagal, gunakan metode langsung dari gemini.ts
      const directResponse = await geminiApiResponse(prompt);
      
      // Parsing respons menjadi array tips
      const tips = directResponse
        .split(/\d+\.\s+/) // Split berdasarkan pola "1. ", "2. ", dll.
        .filter(tip => tip.trim().length > 0);
      
      return tips;
    }
  } catch (error) {
    console.error("Error saat mendapatkan tips lingkungan:", error);
    
    // Tips lingkungan umum sebagai fallback
    return [
      "Kurangi penggunaan plastik sekali pakai dengan membawa tas belanja sendiri",
      "Pisahkan sampah organik dan anorganik untuk memudahkan proses daur ulang",
      "Hemat energi dengan mematikan peralatan elektronik saat tidak digunakan"
    ];
  }
}

// Fungsi untuk mengirim prompt ke Gemini API melalui proxy server
export async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    // Periksa apakah endpoint API tersedia
    const apiUrl = '/api/gemini';
    
    // Gunakan proxy server lokal untuk menghindari masalah CORS
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model: 'gemini-1.5-flash' }),
    });

    // Periksa status respons
    if (!response.ok) {
      // Coba parse error JSON jika ada
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server merespons dengan status: ${response.status}`);
      } catch (jsonError) {
        // Jika tidak bisa parse JSON, gunakan teks respons
        const textResponse = await response.text();
        // Jika respons berisi HTML, kemungkinan server mengembalikan halaman error
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html>')) {
          throw new Error(`Endpoint API tidak tersedia atau mengembalikan halaman HTML alih-alih JSON. Status: ${response.status}`);
        } else {
          throw new Error(`Gagal menghubungi layanan Gemini API. Status: ${response.status}, Respons: ${textResponse.substring(0, 100)}...`);
        }
      }
    }

    // Parse respons JSON
    try {
      const data = await response.json();
      
      // Periksa struktur data respons
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.message) {
        // Format respons alternatif
        return data.message;
      } else {
        console.warn("Format respons tidak dikenali:", data);
        throw new Error("Format respons dari server tidak dikenali");
      }
    } catch (jsonError) {
      console.error("Error saat parsing respons JSON:", jsonError);
      throw new Error("Gagal memproses respons dari server");
    }
  } catch (error: any) {
    console.error("Error saat mengakses Gemini API:", error);
    
    // Tangani error API key dengan lebih spesifik
    if (error.message && (
        error.message.includes("API key") || 
        error.message.includes("authentication") || 
        error.message.includes("PERMISSION_DENIED") ||
        error.message.includes("403") ||
        error.message.includes("identity") ||
        error.message.includes("invalid key")
      )) {
      throw new Error("API key Gemini tidak valid atau belum diaktifkan. Pastikan Anda telah mendaftar di Google AI Studio dan mengaktifkan API key Anda.");
    }
    
    // Tangani error koneksi
    if (error.message && (
        error.message.includes("Failed to fetch") || 
        error.message.includes("network") ||
        error.message.includes("connection") ||
        error.message.includes("timeout") ||
        error.message.includes("abort")
      )) {
      throw new Error("Gagal terhubung ke layanan Gemini API. Periksa koneksi internet Anda atau coba lagi nanti.");
    }
    
    // Error lainnya
    throw error;
  }
}
