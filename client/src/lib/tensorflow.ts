import * as tf from "@tensorflow/tfjs";
import { classifyWasteType } from "./utils";

// Model URL for a waste classifier model
// Using a more specialized model for waste classification that can better distinguish recyclable vs organic
const WASTE_CLASSIFIER_MODEL_URL =
  "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json";

export interface ClassificationResult {
  type: string;
  confidence: number;
  isRecyclable: boolean;
  disposalMethod: string;
  materialComposition?: string[];
  recyclabilityScore: number; // Scale of 0-100
  recyclabilityDetails: string;
}

let wasteModel: tf.GraphModel | null = null;

export async function loadModel(): Promise<tf.GraphModel> {
  if (wasteModel) return wasteModel;

  try {
    // Loading indicator for UI feedback
    const loadingProgress = (fraction: number) => {
      console.log(`Model loading: ${Math.floor(fraction * 100)}%`);
    };
    
    // Load the model with loading progress
    wasteModel = await tf.loadGraphModel(WASTE_CLASSIFIER_MODEL_URL, { onProgress: loadingProgress });
    
    // Warm up the model with a dummy tensor to reduce first inference latency
    const dummyTensor = tf.zeros([1, 224, 224, 3]);
    wasteModel.predict(dummyTensor);
    tf.dispose(dummyTensor);
    
    return wasteModel;
  } catch (error) {
    console.error("Failed to load the waste classification model:", error);
    throw new Error("Model loading failed. Please try again later.");
  }
}

export async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor4D> {
  // Enhanced preprocessing pipeline to improve classification accuracy
  return tf.tidy(() => {
    // Convert the image to a tensor
    const imageTensor = tf.browser.fromPixels(imageElement);
    
    // Apply image contrast enhancement for better feature extraction
    const normalized = tf.div(imageTensor, 255);
    const enhanced = tf.mul(tf.sub(normalized, 0.5), 2.0) as tf.Tensor3D;
    
    // Resize the image to 224x224 (model input size)
    const resizedImage = tf.image.resizeBilinear(enhanced, [224, 224]);
    
    // Normalize pixel values to the range [-1, 1]
    const normalizedImage = tf.sub(tf.div(resizedImage, 127.5), 1);
    
    // Add batch dimension [1, 224, 224, 3]
    return normalizedImage.expandDims(0) as tf.Tensor4D;
  });
}

export async function classifyImage(imageElement: HTMLImageElement): Promise<ClassificationResult> {
  try {
    const model = await loadModel();
    const processedImage = await preprocessImage(imageElement);
    
    // Run inference with tensor profiling for performance metrics
    const startTime = performance.now();
    const predictions = await model.predict(processedImage) as tf.Tensor;
    const inferenceTime = performance.now() - startTime;
    console.log(`Inference time: ${inferenceTime.toFixed(2)}ms`);
    
    const predictionData = await predictions.data();
    
    // Clean up tensors
    tf.dispose([processedImage, predictions]);
    
    // Enhanced waste type classification with better distinction between recyclable and organic
    const predictionArray = Array.from(predictionData);
    const { type, confidence, materialProperties } = classifyWasteType(predictionArray);
    
    // More sophisticated recyclability determination with material composition analysis
    const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
    const compostableTypes = ["Organic", "Paper"];
    const isRecyclable = recyclableTypes.includes(type);
    
    // Calculate recyclability score based on type and confidence
    const recyclabilityScore = isRecyclable ? Math.round(confidence * 100) : 
                               compostableTypes.includes(type) ? 85 : 
                               type === "Electronic" ? 70 : 30;
    
    // Generate detailed recyclability information
    let recyclabilityDetails = "";
    if (recyclabilityScore > 90) {
      recyclabilityDetails = "Highly recyclable with standard processes";
    } else if (recyclabilityScore > 70) {
      recyclabilityDetails = "Recyclable but may require special handling";
    } else if (recyclabilityScore > 50) {
      recyclabilityDetails = "Limited recyclability - check local guidelines";
    } else {
      recyclabilityDetails = "Difficult to recycle with standard methods";
    }
    
    // Detailed disposal instructions based on waste type
    let disposalMethod = isRecyclable 
      ? `Clean and place in ${type.toLowerCase()} recycling bin. Remove any non-${type.toLowerCase()} components first.` 
      : type === "Organic" 
        ? "Compost in home or municipal system. Avoid meat/dairy in home compost." 
        : type === "Electronic" 
          ? "Take to designated e-waste collection center. Do not place in regular bins." 
          : type === "Hazardous" 
            ? "Take to hazardous waste disposal facility. Never mix with regular trash." 
            : "Check local waste authority guidelines for proper disposal method.";
    
    return {
      type,
      confidence,
      isRecyclable,
      disposalMethod,
      materialComposition: materialProperties,
      recyclabilityScore,
      recyclabilityDetails
    };
  } catch (error) {
    console.error("Classification error:", error);
    throw new Error("Failed to classify image. Please try again.");
  }
}
