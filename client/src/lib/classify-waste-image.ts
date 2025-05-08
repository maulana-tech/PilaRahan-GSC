import { getGeminiModel } from './gemini';
/**
 * @fileOverview Classifies waste images into specific categories.
 *
 * - classifyWasteImage - A function to classify a waste image.
 * - ClassifyWasteImageInput - The input type for the classifyWasteImage function.
 * - ClassifyWasteImageOutput - The return type for the classifyWasteImage function.
 */

export interface ClassifyWasteImageInput {
  photoDataUri: string;
}

export interface ClassifyWasteImageOutput {
  category: 'Organic' | 'Paper' | 'Plastic' | 'Glass' | 'Metal' | 'Textile' | 'Electronic' | 'Battery' | 'Other';
  confidence: number;
}

// Implementasi fungsi classifyWasteImage menggunakan Gemini langsung
export async function classifyWasteImage(input: ClassifyWasteImageInput): Promise<ClassifyWasteImageOutput> {
  try {
    // Dapatkan model Gemini
    const model = getGeminiModel();
    
    // Siapkan prompt untuk klasifikasi sampah
    const prompt = `
    Analisis gambar ini dan klasifikasikan jenis sampahnya.
    Berikan kategori sampah dari salah satu berikut: Plastic, Paper, Glass, Metal, Organic, Electronic, Textile, Battery, Other.
    Berikan juga tingkat keyakinan (confidence) dari 0 hingga 1.
    Format respons dalam JSON: {"category": "kategori_sampah", "confidence": nilai_keyakinan}
    `;
    
    // Kirim gambar dan prompt ke model Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: input.photoDataUri.split(',')[1] } }
          ]
        }
      ]
    });
    
    const response = result.response;
    const responseText = response.text();
    
    // Parse respons JSON
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        
        // Validasi respons
        if (jsonResponse.category && typeof jsonResponse.confidence === 'number') {
          return {
            category: jsonResponse.category as ClassifyWasteImageOutput['category'],
            confidence: jsonResponse.confidence
          };
        }
      }
      
      // Jika format tidak sesuai, gunakan fallback
      console.warn("Format respons Gemini tidak sesuai, menggunakan fallback");
      return {
        category: "Other",
        confidence: 0.7
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      throw new Error("Gagal memproses respons klasifikasi sampah");
    }
  } catch (error) {
    console.error("Error in classifyWasteImage:", error);
    throw new Error("Gagal mengklasifikasi gambar sampah");
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

