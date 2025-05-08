'use server';
import { classifyWasteImage } from '@/lib/classify-waste-image';

export interface ClassificationRequest {
  dataUri: string;
  fileName: string;
  previewUrl: string; // To help client map results back
}

// Make category and confidence optional here to represent states where classification might have failed
// but we still want to return some info like fileName and error.
export interface ClassificationResponse {
  category?: string;
  confidence?: number;
  fileName: string;
  previewUrl: string;
  error?: string;
}

export async function classifyImagesAction(
  images: ClassificationRequest[]
): Promise<ClassificationResponse[]> {
  const results: ClassificationResponse[] = [];

  for (const image of images) {
    try {
      const classificationInput = { photoDataUri: image.dataUri };
      const classificationResult = await classifyWasteImage({ photoDataUri: image.dataUri });
      results.push({
        category: classificationResult.category,
        confidence: classificationResult.confidence,
        fileName: image.fileName,
        previewUrl: image.previewUrl,
      });
    } catch (error) {
      console.error(`Error classifying ${image.fileName}:`, error);
      results.push({
        // category and confidence are omitted, indicating an error in classification for this item
        fileName: image.fileName,
        previewUrl: image.previewUrl,
        error: error instanceof Error ? error.message : 'Unknown error during classification',
      });
    }
  }
  return results;
}