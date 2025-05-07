import { GoogleGenerativeAI } from "@google/generative-ai";

// Konfigurasi API Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";


export const genAI = new GoogleGenerativeAI(API_KEY);


export const MODEL_NAME = "gemini-2.0-flash"; 


export function getGeminiModel() {
  // Validasi API key terlebih dahulu
  if (!API_KEY || API_KEY.trim() === "") {
    throw new Error("API key Gemini tidak ditemukan. Pastikan VITE_GEMINI_API_KEY telah diatur di file .env");
  }
  return genAI.getGenerativeModel({ model: MODEL_NAME });
}

// Fungsi untuk mengirim prompt ke Gemini API
export async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    // Validasi API key terlebih dahulu
    if (!API_KEY || API_KEY.trim() === "") {
      throw new Error("API key Gemini tidak ditemukan. Pastikan VITE_GEMINI_API_KEY telah diatur di file .env");
    }

    const model = getGeminiModel();
    
    // Konfigurasi generasi
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1000,
    };

    try {
      // Kirim prompt ke model dengan penanganan fetch error
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      return response.text();
    } catch (fetchError: any) {
      // Tangani error fetch secara spesifik
      console.error("Fetch error saat mengakses Gemini API:", fetchError);
      
      if (fetchError.message && fetchError.message.includes("Failed to fetch")) {
        throw new Error("Gagal terhubung ke layanan Gemini API. Periksa koneksi internet Anda atau coba lagi nanti.");
      }
      
      // Lempar kembali error asli jika bukan masalah fetch
      throw fetchError;
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

// Fungsi untuk mendapatkan respons dari AI dengan fallback
export async function getAiChatResponse(message: string): Promise<string> {
  try {
    // Tambahkan konteks tentang PilaRahan ke prompt
    const enhancedPrompt = `Sebagai asisten AI PilaRahan yang fokus pada pengelolaan sampah dan lingkungan, tolong bantu menjawab pertanyaan berikut dengan informasi yang akurat dan bermanfaat: ${message}`;
    
    // Gunakan Gemini API untuk mendapatkan respons
    const response = await generateGeminiResponse(enhancedPrompt);
    return response;
  } catch (error) {
    console.error("Error saat mendapatkan respons AI:", error);
    
    // Berikan respons fallback jika terjadi error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "Maaf, saya tidak dapat memproses permintaan Anda saat ini karena masalah dengan API key. Silakan hubungi administrator untuk mengatur API key Gemini dengan benar.";
      } else if (error.message.includes("koneksi") || error.message.includes("terhubung")) {
        return "Maaf, saya tidak dapat terhubung ke layanan AI saat ini. Silakan periksa koneksi internet Anda dan coba lagi nanti.";
      }
    }
    
    return "Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi nanti.";
  }
}

// Fungsi untuk mendapatkan rekomendasi daur ulang berdasarkan jenis sampah
export async function getRecyclingRecommendations(wasteType: string, confidence: number): Promise<string[]> {
  try {
    const prompt = `Berikan 3-5 rekomendasi praktis tentang cara mendaur ulang atau mengelola sampah jenis "${wasteType}" dengan tingkat keyakinan ${confidence.toFixed(2)}. Berikan rekomendasi dalam format daftar poin yang singkat dan praktis.`;
    
    const response = await generateGeminiResponse(prompt);
    
    // Parsing respons menjadi array rekomendasi
    const recommendations = response
      .split(/\d+\.\s+/) // Split berdasarkan pola "1. ", "2. ", dll.
      .filter(rec => rec.trim().length > 0)
      .map(rec => rec.trim());
    
    return recommendations;
  } catch (error) {
    console.error("Error saat mendapatkan rekomendasi daur ulang:", error);
    // Fallback rekomendasi berdasarkan jenis sampah
    const fallbackRecommendations: Record<string, string[]> = {
      "Plastic": [
        "Pisahkan sampah plastik berdasarkan jenisnya (PET, HDPE, dll)",
        "Bersihkan plastik dari sisa makanan sebelum didaur ulang",
        "Kurangi penggunaan plastik sekali pakai"
      ],
      "Paper": [
        "Pisahkan kertas dari material lain seperti staples atau plastik",
        "Simpan kertas bekas di tempat kering sebelum didaur ulang",
        "Gunakan kedua sisi kertas untuk mengurangi konsumsi"
      ],
      "Glass": [
        "Pisahkan kaca berdasarkan warnanya (bening, hijau, coklat)",
        "Bersihkan kaca dari sisa makanan atau minuman",
        "Hati-hati saat menangani pecahan kaca"
      ],
      "Metal": [
        "Pisahkan logam berdasarkan jenisnya (aluminium, besi, dll)",
        "Bersihkan kaleng dari sisa makanan",
        "Kompres kaleng untuk menghemat ruang"
      ],
      "Organic": [
        "Komposkan sampah organik untuk dijadikan pupuk",
        "Pisahkan sampah organik dari material non-organik",
        "Gunakan sampah dapur untuk membuat kompos rumahan"
      ],
      "Electronic": [
        "Bawa ke pusat daur ulang elektronik resmi",
        "Hapus data pribadi sebelum mendaur ulang perangkat",
        "Jangan buang elektronik ke tempat sampah biasa"
      ],
      "Hazardous": [
        "Bawa ke fasilitas pembuangan limbah berbahaya",
        "Jangan campur dengan sampah rumah tangga biasa",
        "Simpan dalam wadah tertutup dan berlabel"
      ],
      "Textile": [
        "Donasikan pakaian yang masih layak pakai",
        "Gunakan kain bekas untuk lap atau kerajinan",
        "Cari program daur ulang tekstil di area Anda"
      ],
      "Mixed": [
        "Pisahkan sampah berdasarkan jenisnya sebelum dibuang",
        "Cari pusat daur ulang yang menerima sampah campuran",
        "Kurangi penggunaan produk dengan kemasan campuran"
      ]
    };
    
    return fallbackRecommendations[wasteType] || [
      "Pisahkan sampah berdasarkan jenisnya",
      "Cari pusat daur ulang terdekat",
      "Kurangi penggunaan bahan sekali pakai"
    ];
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
    
    // Tips lingkungan umum sebagai fallback
    return [
      "Kurangi penggunaan plastik sekali pakai dengan membawa tas belanja sendiri",
      "Pisahkan sampah organik dan anorganik untuk memudahkan proses daur ulang",
      "Hemat energi dengan mematikan peralatan elektronik saat tidak digunakan"
    ];
  }
}