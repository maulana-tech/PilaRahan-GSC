import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// Inisialisasi Google Generative AI dengan API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Endpoint untuk mendapatkan respons chat AI tentang pengolahan sampah
router.post("/api/ai-chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });
    }

    // Buat model Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prompt untuk memastikan respons fokus pada pengolahan sampah
    const prompt = `
      Kamu adalah asisten AI dari PilaRahan, aplikasi pengelolaan sampah pintar.
      Berikan informasi yang akurat dan bermanfaat tentang:
      - Cara mendaur ulang berbagai jenis sampah
      - Dampak lingkungan dari sampah
      - Praktik pengelolaan sampah yang berkelanjutan
      - Tips mengurangi sampah sehari-hari
      
      Pertanyaan pengguna: ${message}
    `;

    // Dapatkan respons dari model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Format respons
    const formattedResponse = {
      message: text,
      environmentalTips: generateEnvironmentalTips(message),
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses permintaan" });
  }
});

// Fungsi untuk menghasilkan tips lingkungan berdasarkan konteks pesan
function generateEnvironmentalTips(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  // Tips dasar berdasarkan jenis sampah yang disebutkan dalam pesan
  if (lowerMessage.includes("plastik")) {
    return [
      "Kurangi penggunaan plastik sekali pakai",
      "Pilih produk dengan kemasan yang dapat didaur ulang",
      "Bawa tas belanja sendiri saat berbelanja",
    ];
  } else if (lowerMessage.includes("kertas")) {
    return [
      "Gunakan kedua sisi kertas saat mencetak",
      "Pilih produk kertas dari sumber yang berkelanjutan",
      "Daur ulang kertas bekas untuk mengurangi penebangan pohon",
    ];
  } else if (lowerMessage.includes("elektronik") || lowerMessage.includes("gadget")) {
    return [
      "Jangan buang elektronik bekas ke tempat sampah biasa",
      "Cari pusat daur ulang elektronik terdekat",
      "Pertimbangkan untuk memperbaiki alat elektronik daripada menggantinya",
    ];
  } else if (lowerMessage.includes("organik") || lowerMessage.includes("makanan")) {
    return [
      "Buat kompos dari sisa makanan untuk mengurangi sampah",
      "Rencanakan makanan dengan baik untuk mengurangi pemborosan",
      "Simpan makanan dengan benar agar lebih tahan lama",
    ];
  } else {
    // Tips umum jika tidak ada kata kunci spesifik
    return [
      "Terapkan prinsip 3R: Reduce, Reuse, Recycle",
      "Pisahkan sampah berdasarkan jenisnya untuk memudahkan daur ulang",
      "Edukasi orang lain tentang pentingnya pengelolaan sampah yang baik",
    ];
  }
}

export default router;