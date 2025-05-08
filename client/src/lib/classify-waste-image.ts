// src/ai/flows/classify-waste-image.ts
'use server';
/**
 * @fileOverview Classifies waste images into specific categories.
 *
 * - classifyWasteImage - A function to classify a waste image.
 * - ClassifyWasteImageInput - The input type for the classifyWasteImage function.
 * - ClassifyWasteImageOutput - The return type for the classifyWasteImage function.
 */

import { ai } from './genkit';
import { z } from 'zod';  // Import z from zod instead of genkit

const ClassifyWasteImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
// Using a different name to avoid duplicate identifier
export type WasteImageClassificationInput = z.infer<typeof ClassifyWasteImageInputSchema>;

const ClassifyWasteImageOutputSchema = z.object({
  category: z
    .enum(['Organic', 'Paper', 'Plastic', 'Glass', 'Metal', 'Textile', 'Electronic', 'Battery', 'Other'])
    .describe('The predicted waste category.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("The confidence score (0-1) for the classification."),
});
export type WasteImageClassificationOutput = z.infer<typeof ClassifyWasteImageOutputSchema>;

// Interface untuk hasil klasifikasi
// Classification types and functions moved from tensorflow.ts
export interface ClassificationResult {
  type: string;
  confidence: number;
  isRecyclable: boolean;
  recyclabilityScore: number;
  recyclabilityDetails: string;
  disposalMethod: string;
  materialComposition?: string[];
  category?: string;
  environmentalImpact?: { carbonFootprintKg: number; energyRecoveryPotentialMJ: number };
  predictionQuality?: string;
}

export interface ClassifyWasteImageInput {
  photoDataUri: string;
}

export interface ClassifyWasteImageOutput {
  category: string;
  confidence: number;
}

// Function to classify waste images - client-side implementation
export async function classifyWasteImage(input: ClassifyWasteImageInput): Promise<ClassifyWasteImageOutput> {
  // This is a client-side implementation that calls a server API endpoint
  // instead of using Genkit directly in the browser
  
  try {
    // In a real implementation, you would call your server API
    // For now, we'll use a mock implementation
    console.log("Classifying image with data URI length:", input.photoDataUri.length);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response - in production, this would come from your server
    const mockCategories = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronic', 'Textile', 'Battery', 'Other'];
    const randomIndex = Math.floor(Math.random() * mockCategories.length);
    const randomConfidence = 0.7 + (Math.random() * 0.3); // Between 0.7 and 1.0
    
    return {
      category: mockCategories[randomIndex],
      confidence: randomConfidence
    };
  } catch (error) {
    console.error("Error in classifyWasteImage:", error);
    throw new Error("Failed to classify waste image");
  }
}

// Fungsi untuk mengklasifikasi gambar
export async function classifyImage(imageElement: HTMLImageElement): Promise<ClassificationResult> {
  try {
    // Convert image to data URI for API
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(imageElement, 0, 0);
      const dataUri = canvas.toDataURL('image/jpeg');
      
      try {
        // Use the client-side implementation
        const result = await classifyWasteImage({ photoDataUri: dataUri });
        console.log("Classification result:", result);
        
        // Use the result
        const type = result.category;
        const confidence = result.confidence;
        
        return computeClassificationResult(type, confidence, imageElement);
      } catch (error) {
        console.error("Classification error:", error);
        // Fallback to simulation if classification fails
        return generateSimulatedClassification(imageElement, false);
      }
    } else {
      // Fallback to simulation if canvas context not available
      return generateSimulatedClassification(imageElement, false);
    }
  } catch (error) {
    console.error("Classification error:", error);
    return generateSimulatedClassification(imageElement, false);
  }
}

// Fungsi untuk memuat model (dummy function untuk kompatibilitas)
export async function loadModel(): Promise<void> {
  console.log("Model loading simulated");
  // Just a simulation, not actually loading a TensorFlow model
  return Promise.resolve();
}

// Fungsi untuk membuang model (dummy function untuk kompatibilitas)
export function disposeModel(): void {
  console.log("Model disposed (simulated)");
}

// Fungsi untuk menghasilkan klasifikasi simulasi
function generateSimulatedClassification(imageElement: HTMLImageElement, isLowConfidence: boolean): ClassificationResult {
  const imageData = analyzeImageForSimulation(imageElement);

  // Enhanced type weights
  let typeWeights = {
    "Plastic": imageData.colorfulness * 1.8 + imageData.sharpness * 0.6 + (isLowConfidence ? -0.2 : 0),
    "Paper": (1 - imageData.colorfulness) * 0.9 + imageData.brightness * 0.8,
    "Glass": imageData.brightness * 1.4 + imageData.sharpness * 0.9 + imageData.transparency * 0.5,
    "Metal": imageData.sharpness * 1.7 + (1 - imageData.brightness) * 0.6 + imageData.reflectivity * 0.4,
    "Organic": imageData.greenness * 2.2 + (1 - imageData.brightness) * 0.9 + imageData.texture * 0.3,
    "Electronic": imageData.complexity * 1.8 + imageData.sharpness * 0.7 + (isLowConfidence ? -0.1 : 0),
  };

  let highestWeight = 0;
  let selectedType = "Organic";

  for (const [type, weight] of Object.entries(typeWeights)) {
    if (weight > highestWeight) {
      highestWeight = weight;
      selectedType = type;
    }
  }

  // Confidence calculation
  let secondHighestWeight = 0;
  for (const [t, weight] of Object.entries(typeWeights)) {
    if (t !== selectedType && weight > secondHighestWeight) {
      secondHighestWeight = weight;
    }
  }

  const weightDifference = highestWeight - secondHighestWeight;
  const confidenceBase = Math.min(0.90, Math.max(0.65, 0.65 + weightDifference * 0.5));
  const confidence = isLowConfidence ? confidenceBase * 0.8 : confidenceBase;

  return computeClassificationResult(selectedType, confidence, imageElement);
}

// Fungsi untuk menganalisis gambar untuk simulasi
function analyzeImageForSimulation(imageElement: HTMLImageElement): {
  brightness: number;
  colorfulness: number;
  sharpness: number;
  greenness: number;
  complexity: number;
  transparency: number;
  reflectivity: number;
  texture: number;
} {
  const width = imageElement.width || 100;
  const height = imageElement.height || 100;
  const naturalWidth = imageElement.naturalWidth || width;
  const naturalHeight = imageElement.naturalHeight || height;

  // Deterministic pseudo-random values
  const brightness = ((width * 17) % 255) / 255;
  const colorfulness = ((height * 23) % 255) / 255;
  const sharpness = (((width + height) * 31) % 100) / 100;
  const greenness = ((naturalWidth * 29) % 255) / 255;
  const complexity = (((naturalHeight + width) * 41) % 100) / 100;
  const transparency = ((naturalWidth * 37) % 100) / 100;
  const reflectivity = ((naturalHeight * 43) % 100) / 100;
  const texture = (((width + naturalHeight) * 47) % 100) / 100;

  return {
    brightness,
    colorfulness,
    sharpness,
    greenness,
    complexity,
    transparency,
    reflectivity,
    texture
  };
}

// Fungsi untuk menghitung hasil klasifikasi berdasarkan tipe dan kepercayaan
function computeClassificationResult(type: string, confidence: number, imageElement: HTMLImageElement): ClassificationResult {
  // Determine recyclability
  const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
  const isRecyclable = recyclableTypes.includes(type);
  
  // Calculate recyclability score
  const recyclabilityScore = getRecyclabilityScore(type, confidence);
  
  // Get disposal method
  const disposalMethod = getDisposalMethod(type);
  
  // Get material composition
  const materialComposition = getMaterialComposition(type);
  
  // Get recyclability details
  const recyclabilityDetails = getRecyclabilityDetails(type);
  
  // Get category label
  const category = getCategoryLabel(type);
  
  // Calculate environmental impact
  const environmentalImpact = getEnvironmentalImpact(type);
  
  // Determine prediction quality
  const predictionQuality = confidence > 0.95 ? 'high' : confidence > 0.85 ? 'medium' : 'low';
  
  return {
    type,
    confidence,
    isRecyclable,
    disposalMethod,
    materialComposition,
    recyclabilityScore,
    recyclabilityDetails: getRecyclabilityDetails(type) || 'No recyclability details available',
  };
}

// Fungsi helper untuk mendapatkan metode pembuangan berdasarkan kategori
export function getDisposalMethod(category: string): string {
  switch (category) {
    case 'Plastic':
      return "Bersihkan dengan seksama, periksa kode daur ulang, tempatkan di tempat sampah daur ulang plastik. Lepaskan tutup dan label jika diperlukan.";
    case 'Paper':
      return "Jaga agar tetap kering dan bersih, lepaskan lampiran non-kertas, tempatkan di tempat sampah daur ulang kertas. Hancurkan dokumen sensitif.";
    case 'Glass':
      return "Bilas dengan seksama, lepaskan tutup, tempatkan di tempat sampah daur ulang kaca. Pisahkan berdasarkan warna jika diperlukan secara lokal.";
    case 'Metal':
      return "Bersihkan dengan seksama, lepaskan komponen non-logam, tempatkan di tempat sampah daur ulang logam. Hancurkan kaleng jika memungkinkan.";
    case 'Organic':
      return "Tempatkan di kompos atau pengumpulan limbah hijau. Hindari daging/susu dalam kompos rumah. Pertimbangkan pengomposan cacing.";
    case 'Electronic':
      return "Bawa ke pusat pengumpulan e-waste. Jangan tempatkan di tempat sampah biasa karena mengandung bahan berbahaya.";
    case 'Textile':
      return "Donasikan jika masih dalam kondisi baik, atau bawa ke pusat daur ulang tekstil. Beberapa toko pakaian menerima tekstil bekas untuk didaur ulang.";
    case 'Battery':
      return "Jangan buang di tempat sampah biasa. Bawa ke pusat pengumpulan baterai atau toko elektronik yang menerima baterai bekas.";
    default:
      return "Periksa pedoman otoritas pengelolaan sampah setempat untuk pembuangan yang tepat.";
  }
}

// Fungsi helper untuk mendapatkan komposisi material berdasarkan kategori
export function getMaterialComposition(category: string): string[] {
  const materialPropertiesMap: Record<string, string[]> = {
    "Plastic": ["Berbasis polimer", "Turunan minyak bumi", "Tidak dapat terurai secara alami", "Ringan"],
    "Paper": ["Serat selulosa", "Dapat terurai secara alami", "Pulp daur ulang", "Berbasis tanaman"],
    "Glass": ["Berbasis silika", "Material inert", "Dapat didaur ulang tanpa batas", "Tahan panas"],
    "Metal": ["Konduktif", "Dapat ditempa", "Nilai daur ulang tinggi", "Komposisi elemen"],
    "Organic": ["Dapat terurai secara alami", "Dapat dikompos", "Kaya karbon", "Material alami"],
    "Electronic": ["Papan sirkuit", "Material campuran", "Elemen langka", "Rakitan kompleks"],
    "Textile": ["Serat kain", "Biodegradabilitas bervariasi", "Sering kali material campuran"],
    "Battery": ["Mengandung logam berat", "Berpotensi beracun", "Memerlukan penanganan khusus"],
    "Other": ["Material tidak terklasifikasi", "Mungkin memerlukan pemrosesan khusus"],
  };
  
  return materialPropertiesMap[category] || materialPropertiesMap["Other"];
}

// Fungsi helper untuk mendapatkan skor daur ulang berdasarkan kategori dan kepercayaan
export function getRecyclabilityScore(category: string, confidence: number): number {
  const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
  const compostableTypes = ["Organic"];
  const specialHandlingTypes = ["Electronic", "Battery"];
  
  let recyclabilityBase = 0;
  if (recyclableTypes.includes(category)) {
    recyclabilityBase = Math.round(confidence * 100);
    if (category === "Paper") recyclabilityBase -= 5; // Risiko kontaminasi
    if (category === "Glass" || category === "Metal") recyclabilityBase += 5; // Daur ulang tinggi
  } else if (compostableTypes.includes(category)) {
    recyclabilityBase = 90; // Kompos tinggi
  } else if (specialHandlingTypes.includes(category)) {
    recyclabilityBase = 75; // Daur ulang khusus
  } else {
    recyclabilityBase = 20; // Daur ulang rendah
  }
  
  return Math.min(98, recyclabilityBase);
}

// Fungsi helper untuk mendapatkan detail daur ulang berdasarkan kategori
export function getRecyclabilityDetails(category: string): string | undefined {
  const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
  const compostableTypes = ["Organic"];
  const specialHandlingTypes = ["Electronic", "Battery"];
  
  if (recyclableTypes.includes(category)) {
    if (category === "Plastic") return "Dapat didaur ulang di sebagian besar fasilitas, tetapi periksa kode daur ulang untuk kompatibilitas lokal.";
    if (category === "Paper") return "Sangat dapat didaur ulang, tetapi hindari kontaminasi dengan makanan atau cairan.";
    if (category === "Glass") return "100% dapat didaur ulang tanpa batas dan tidak kehilangan kualitas.";
    if (category === "Metal") return "Sangat bernilai untuk didaur ulang dan dapat diproses berulang kali.";
  } else if (compostableTypes.includes(category)) {
    return "Dapat dikompos dengan sempurna dan memberikan nutrisi kembali ke tanah.";
  } else if (specialHandlingTypes.includes(category)) {
    if (category === "Electronic") return "Memerlukan daur ulang khusus untuk memulihkan logam berharga dan menangani bahan berbahaya.";
    if (category === "Battery") return "Harus didaur ulang melalui program khusus untuk mencegah pencemaran lingkungan.";
  } else if (category === "Textile") {
    return "Dapat didaur ulang atau digunakan kembali, tetapi memerlukan fasilitas khusus.";
  } else {
    return "Kemungkinan tidak dapat didaur ulang dalam sistem saat ini; pertimbangkan alternatif.";
  }
}

// Fungsi helper untuk mendapatkan label kategori berdasarkan kategori
export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'Plastic':
      return "Plastik";
    case 'Paper':
      return "Kertas";
    case 'Glass':
      return "Kaca";
    case 'Metal':
      return "Logam";
    case 'Organic':
      return "Organik";
    case 'Electronic':
      return "Elektronik";
    case 'Textile':
      return "Tekstil";
    case 'Battery':
      return "Baterai";
    default:
      return "Lainnya";
  }
}

// Fungsi helper untuk mendapatkan dampak lingkungan berdasarkan kategori
export function getEnvironmentalImpact(category: string): { carbonFootprintKg: number; energyRecoveryPotentialMJ: number } {
  switch (category) {
    case 'Plastic':
      return { carbonFootprintKg: 6.0, energyRecoveryPotentialMJ: 38.0 };
    case 'Paper':
      return { carbonFootprintKg: 1.1, energyRecoveryPotentialMJ: 16.0 };
    case 'Glass':
      return { carbonFootprintKg: 0.9, energyRecoveryPotentialMJ: 8.0 };
    case 'Metal':
      return { carbonFootprintKg: 4.0, energyRecoveryPotentialMJ: 24.0 };
    case 'Organic':
      return { carbonFootprintKg: 0.5, energyRecoveryPotentialMJ: 5.0 };
    case 'Electronic':
      return { carbonFootprintKg: 12.0, energyRecoveryPotentialMJ: 32.0 };
    case 'Textile':
      return { carbonFootprintKg: 3.0, energyRecoveryPotentialMJ: 18.0 };
    case 'Battery':
      return { carbonFootprintKg: 8.0, energyRecoveryPotentialMJ: 10.0 };
    default:
      return { carbonFootprintKg: 2.0, energyRecoveryPotentialMJ: 12.0 };
  }
}

