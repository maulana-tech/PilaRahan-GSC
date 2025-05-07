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
import {z} from 'genkit';

const ClassifyWasteImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyWasteImageInput = z.infer<typeof ClassifyWasteImageInputSchema>;

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
export type ClassifyWasteImageOutput = z.infer<typeof ClassifyWasteImageOutputSchema>;

export async function classifyWasteImage(input: ClassifyWasteImageInput): Promise<ClassifyWasteImageOutput> {
  return classifyWasteImageFlow(input);
}

const classifyWasteImagePrompt = ai.definePrompt({
  name: 'classifyWasteImagePrompt',
  input: {schema: ClassifyWasteImageInputSchema},
  output: {schema: ClassifyWasteImageOutputSchema},
  prompt: `You are an AI assistant that classifies waste images into specific categories.
  Analyze the following image and determine its primary waste category.
  Possible categories are: Organic, Paper, Plastic, Glass, Metal, Textile, Electronic, Battery, Other.
  Respond with the predicted waste category and a confidence score (0-1).

  Image: {{media url=photoDataUri}}
  Category:`,
});

const classifyWasteImageFlow = ai.defineFlow(
  {
    name: 'classifyWasteImageFlow',
    inputSchema: ClassifyWasteImageInputSchema,
    outputSchema: ClassifyWasteImageOutputSchema,
  },
  async (input: ClassifyWasteImageInput) => {
    const {output} = await classifyWasteImagePrompt(input);
    // Ensure output conforms to the schema, especially for the enum.
    // If the model returns an invalid category, Zod parsing on output would fail.
    // The Genkit prompt runner handles this parsing.
    if (!output) {
      throw new Error("AI failed to provide a classification output.");
    }
    // Validate if the category is one of the enum values, though Zod should do this.
    // This is more of a sanity check or for debugging.
    const validCategories = ClassifyWasteImageOutputSchema.shape.category.options;
    if (!validCategories.includes(output.category)) {
        // If AI hallucinates a category not in the enum, default to 'Other' or throw.
        // It's generally better to let Zod handle this validation.
        // Forcing 'Other' here might hide issues with the prompt or model behavior.
        console.warn(`AI returned an invalid category: ${output.category}. Prompt output schema should enforce this.`);
        // output.category = 'Other'; // Optionally force to 'Other'
    }
    return output;
  }
);

