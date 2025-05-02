import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi AI di sisi server
const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Kamu adalah asisten AI dari PilaRahan, aplikasi pengelolaan sampah pintar.
Berikan informasi yang akurat dan bermanfaat tentang:
- Cara mendaur ulang berbagai jenis sampah
- Dampak lingkungan dari sampah
- Praktik pengelolaan sampah yang berkelanjutan
- Tips mengurangi sampah sehari-hari

Pertanyaan pengguna: ${message}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();
    
    // Generate tips lingkungan berdasarkan konteks pesan
    const environmentalTips = generateEnvironmentalTips(message);
    
    return res.status(200).json({
      message: textResponse,
      environmentalTips
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}

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