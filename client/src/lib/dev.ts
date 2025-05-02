/**
 * @fileOverview Development utilities for testing AI features without consuming API quota
 */

import { AiChatResponse } from './aiChat';

// Simulasi respons AI untuk lingkungan pengembangan
export function simulateAiChatResponse(message: string): AiChatResponse {
  // Lowercase untuk pencocokan kata kunci yang lebih baik
  const lowerMessage = message.toLowerCase();
  
  // Respons default jika tidak ada kata kunci yang cocok
  let response = {
    message: "Terima kasih atas pertanyaan Anda tentang pengelolaan sampah. Untuk informasi lebih lanjut, silakan kunjungi situs web resmi pengelolaan sampah di daerah Anda.",
    environmentalTips: [
      "Terapkan prinsip 3R: Reduce, Reuse, Recycle",
      "Pisahkan sampah berdasarkan jenisnya untuk memudahkan daur ulang",
      "Edukasi orang lain tentang pentingnya pengelolaan sampah yang baik",
    ]
  };
  
  // Cek kata kunci dalam pesan dan berikan respons yang sesuai
  if (lowerMessage.includes("plastik")) {
    response.message = "Plastik adalah salah satu material yang paling sulit terurai di alam. Butuh waktu hingga 500 tahun bagi beberapa jenis plastik untuk terurai sepenuhnya. Daur ulang plastik sangat penting untuk mengurangi dampak lingkungan.\n\nUntuk mendaur ulang plastik:\n1. Bersihkan plastik dari sisa makanan atau cairan\n2. Periksa kode daur ulang (1-7) di bagian bawah kemasan\n3. Pisahkan berdasarkan jenisnya (PET, HDPE, dll.)\n4. Bawa ke tempat pengumpulan daur ulang terdekat\n\nPlastik dengan kode 1 (PET) dan 2 (HDPE) adalah yang paling mudah didaur ulang.";
    response.environmentalTips = [
      "Kurangi penggunaan plastik sekali pakai",
      "Pilih produk dengan kemasan yang dapat didaur ulang",
      "Bawa tas belanja sendiri saat berbelanja",
    ];
  } else if (lowerMessage.includes("kertas")) {
    response.message = "Kertas adalah material yang relatif mudah didaur ulang dan dapat didaur ulang hingga 5-7 kali sebelum serat menjadi terlalu pendek untuk digunakan kembali.\n\nUntuk mendaur ulang kertas:\n1. Pisahkan kertas dari material lain seperti plastik atau logam\n2. Jaga agar kertas tetap kering dan bersih\n3. Lipat kardus untuk menghemat ruang\n4. Kumpulkan dan bawa ke tempat pengumpulan daur ulang\n\nKertas yang terkontaminasi makanan (seperti kotak pizza berminyak) tidak dapat didaur ulang dan sebaiknya dikompos.";
    response.environmentalTips = [
      "Gunakan kedua sisi kertas saat mencetak",
      "Pilih produk kertas dari sumber yang berkelanjutan",
      "Daur ulang kertas bekas untuk mengurangi penebangan pohon",
    ];
  } else if (lowerMessage.includes("organik") || lowerMessage.includes("makanan")) {
    response.message = "Sampah organik seperti sisa makanan dan potongan tanaman dapat dikompos menjadi pupuk yang kaya nutrisi untuk tanaman. Pengomposan adalah cara alami untuk mendaur ulang nutrisi kembali ke tanah.\n\nCara membuat kompos sederhana:\n1. Siapkan wadah kompos (bisa berupa tong atau lubang di tanah)\n2. Tambahkan lapisan bahan coklat (daun kering, kardus) dan bahan hijau (sisa sayuran, potongan rumput)\n3. Jaga kelembaban seperti spons yang diperas\n4. Aduk secara berkala untuk aerasi\n5. Dalam 2-6 bulan, kompos akan matang dan siap digunakan\n\nHindari memasukkan daging, produk susu, atau makanan berminyak ke dalam kompos rumahan karena dapat menarik hama.";
    response.environmentalTips = [
      "Buat kompos dari sisa makanan untuk mengurangi sampah",
      "Rencanakan makanan dengan baik untuk mengurangi pemborosan",
      "Simpan makanan dengan benar agar lebih tahan lama",
    ];
  }
  
  return response;
}

// Fungsi untuk mensimulasikan rekomendasi daur ulang
export function simulateRecyclingRecommendations(wasteType: string) {
  // Implementasi simulasi rekomendasi daur ulang
  return {
    recommendation: `Rekomendasi daur ulang simulasi untuk ${wasteType}`,
    environmentalImpact: [
      "Dampak lingkungan simulasi 1",
      "Dampak lingkungan simulasi 2",
      "Dampak lingkungan simulasi 3"
    ]
  };
}