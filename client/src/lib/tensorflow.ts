import * as tf from "@tensorflow/tfjs";
import { classifyWasteType } from "./utils";

// Model URL pointing to a pre-trained MobileNet model for image classification
// In a production environment, we would use a custom fine-tuned model for waste classification
const MOBILENET_MODEL_URL =
  "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json";

export interface ClassificationResult {
  type: string;
  confidence: number;
  isRecyclable: boolean;
  disposalMethod: string;
}

let wasteModel: tf.GraphModel | null = null;

export async function loadModel(): Promise<tf.GraphModel> {
  if (wasteModel) return wasteModel;

  try {
    // Load the pre-trained MobileNet model
    wasteModel = await tf.loadGraphModel(MOBILENET_MODEL_URL);
    return wasteModel;
  } catch (error) {
    console.error("Failed to load the model:", error);
    throw new Error("Model loading failed. Please try again later.");
  }
}

export async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor> {
  // Preprocess the image to match the model's expected input
  return tf.tidy(() => {
    // Convert the image to a tensor
    const imageTensor = tf.browser.fromPixels(imageElement);
    
    // Resize the image to 224x224 (MobileNet input size)
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    
    // Normalize pixel values to the range [-1, 1]
    const normalizedImage = resizedImage.div(127.5).sub(1);
    
    // Add batch dimension [1, 224, 224, 3]
    return normalizedImage.expandDims(0);
  });
}

export async function classifyImage(imageElement: HTMLImageElement): Promise<ClassificationResult> {
  try {
    const model = await loadModel();
    const processedImage = await preprocessImage(imageElement);
    
    // Run inference
    const predictions = await model.predict(processedImage) as tf.Tensor;
    const predictionData = await predictions.data();
    
    // Clean up tensors
    tf.dispose([processedImage, predictions]);
    
    // Convert to array and classify
    const predictionArray = Array.from(predictionData);
    const { type, confidence } = classifyWasteType(predictionArray);
    
    // Determine recyclability based on waste type
    // This is a simple mapping that would be more sophisticated in production
    const recyclableTypes = ["Plastic", "Paper", "Glass", "Metal"];
    const isRecyclable = recyclableTypes.includes(type);
    
    // Basic disposal method
    let disposalMethod = isRecyclable 
      ? "Recycle in appropriate bin" 
      : type === "Organic" 
        ? "Compost if possible, otherwise general waste" 
        : type === "Electronic" 
          ? "Take to e-waste collection center" 
          : type === "Hazardous" 
            ? "Take to hazardous waste disposal facility" 
            : "General waste bin";
    
    return {
      type,
      confidence,
      isRecyclable,
      disposalMethod
    };
  } catch (error) {
    console.error("Classification error:", error);
    throw new Error("Failed to classify image. Please try again.");
  }
}
