import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Sumber terjemahan
const resources = {
  en: {
    translation: {
      // Umum
      "app_name": "PilaRahan",
      "loading": "Loading...",
      
      // Navigasi
      "home": "Home",
      "scan": "Scan",
      "learning_center": "Learning Center",
      "recycling_centers": "Recycling Centers",
      "about": "About",
      "ai_chat": "AI Chat",
      
      // Chat Interface
      "what_to_know": "What would you like to know?",
      "good_morning": "Good morning",
      "good_afternoon": "Good afternoon",
      "good_evening": "Good evening",
      "how_help_waste": "How can I help you with waste management today?",
      "pilarahan_ai": "PilaRahan AI",
      
      // Suggested Questions
      "how_recycle_plastic": "How to recycle plastic bottles?",
      "impact_ewaste": "What is the impact of e-waste on the environment?",
      "reduce_household_waste": "Tips to reduce household waste?",
      "nearest_recycling": "Location of nearest recycling centers?",
      "compost_kitchen": "How to make compost from kitchen waste?",
      "zero_waste": "What is the zero waste concept?",
      
      // Scan Page
      "identify_recycle": "Identify & Recycle",
      "ai_identifies": "Our AI instantly identifies waste items and provides personalized recycling guidance. Just snap a photo or upload an image to get started.",
      "loading_ai": "Loading AI Model...",
      "preparing_tech": "Preparing our advanced waste classification technology",
      "ai_analysis": "AI Analysis in Progress",
      "analyzing_waste": "Our smart algorithm is analyzing your waste item...",
      "allow_location": "Allow Location Access",
      "getting_location": "Getting Location...",
      
      // Learning Center
      "learning_center_title": "Learning Center",
      "explore_resources": "Explore our educational resources to learn more about waste types and proper disposal methods.",
      "view_all": "View All Resources",
      "recommended_products": "Recommended Products",
      "products_help": "These products can help you implement what you've learned and make sustainable waste management easier.",
    }
  },
  id: {
    translation: {
      // Umum
      "app_name": "PilaRahan",
      "loading": "Memuat...",
      
      // Navigasi
      "home": "Beranda",
      "scan": "Pindai",
      "learning_center": "Pusat Pembelajaran",
      "recycling_centers": "Pusat Daur Ulang",
      "about": "Tentang",
      "ai_chat": "Chat AI",
      
      // Chat Interface
      "what_to_know": "Apa yang ingin Anda ketahui?",
      "good_morning": "Selamat pagi",
      "good_afternoon": "Selamat siang",
      "good_evening": "Selamat malam",
      "how_help_waste": "Bagaimana saya bisa membantu Anda dengan pengelolaan sampah hari ini?",
      "pilahrahan_ai": "PilaRahan AI",
      
      // Suggested Questions
      "how_recycle_plastic": "Bagaimana cara mendaur ulang botol plastik?",
      "impact_ewaste": "Apa dampak sampah elektronik terhadap lingkungan?",
      "reduce_household_waste": "Tips mengurangi sampah rumah tangga?",
      "nearest_recycling": "Lokasi tempat daur ulang terdekat?",
      "compost_kitchen": "Cara membuat kompos dari sampah dapur?",
      "zero_waste": "Apa itu konsep zero waste?",
      
      // Scan Page
      "identify_recycle": "Identifikasi & Daur Ulang",
      "ai_identifies": "AI kami secara instan mengidentifikasi item sampah dan memberikan panduan daur ulang yang dipersonalisasi. Cukup ambil foto atau unggah gambar untuk memulai.",
      "loading_ai": "Memuat Model AI...",
      "preparing_tech": "Mempersiapkan teknologi klasifikasi sampah canggih kami",
      "ai_analysis": "Analisis AI Sedang Berlangsung",
      "analyzing_waste": "Algoritma cerdas kami sedang menganalisis item sampah Anda...",
      "allow_location": "Izinkan Akses Lokasi",
      "getting_location": "Mendapatkan Lokasi...",
      
      // Learning Center
      "learning_center_title": "Pusat Pembelajaran",
      "explore_resources": "Jelajahi sumber daya pendidikan kami untuk mempelajari lebih lanjut tentang jenis sampah dan metode pembuangan yang tepat.",
      "view_all": "Lihat Semua Sumber Daya",
      "recommended_products": "Produk yang Direkomendasikan",
      "products_help": "Produk-produk ini dapat membantu Anda menerapkan apa yang telah Anda pelajari dan membuat pengelolaan sampah berkelanjutan lebih mudah.",
    }
  }
};

i18n
  .use(LanguageDetector) // Deteksi bahasa browser
  .use(initReactI18next) // Inisialisasi react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React sudah melakukan escape
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;