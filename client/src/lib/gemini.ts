import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Gunakan pendekatan yang aman untuk mengakses variabel lingkungan di browser
const getApiKey = () => {
  // Cek apakah kode berjalan di browser atau server
  if (typeof window !== 'undefined') {
    // Di browser, gunakan variabel yang diinjeksi oleh Next.js
    return (window as any).__NEXT_DATA__?.props?.pageProps?.apiKey || '';
  } else {
    // Di server, gunakan process.env
    return process.env.NEXT_PUBLIC_GOOGLE_GENAI_API_KEY || '';
  }
};

// Initialize the Google Generative AI client
export const ai = new GoogleGenerativeAI(getApiKey());

// Helper function to create a chat session
export const createChatSession = (modelName = 'gemini-1.5-flash') => {
  return ai.getGenerativeModel({ model: modelName });
};

// Function to create a chat model with history
export const createChatModel = (modelName = 'gemini-1.5-flash'): GenerativeModel => {
  return ai.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  });
};

// Function to get recycling recommendations for a specific waste type
export async function getRecyclingRecommendations(wasteType: string) {
  try {
    const model = createChatSession();
    
    // Create prompt for getting recycling recommendations
    const prompt = `You are a waste management and recycling expert. 
    Please provide specific, detailed recycling recommendations for the following waste type: ${wasteType}.
    
    Format your response as JSON with the following structure:
    {
      "recommendation": "A detailed explanation of how to properly dispose of this item including any preparation steps (cleaning, disassembly, etc.)",
      "environmentalImpact": ["3-4 bullet points about the environmental impact of properly recycling this item"]
    }`;

    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();
    
    // Try to parse the response as JSON
    try {
      // Look for JSON in the response
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                        textResponse.match(/{[\s\S]*?}/);
                        
      if (jsonMatch) {
        // Extract JSON from code block or directly from text
        const jsonString = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonString);
      }
    } catch (parseError) {
      console.error('Error parsing AI response as JSON:', parseError);
    }
    
    // Fallback to default format if parsing fails
    return {
      recommendation: "Please check with your local recycling guidelines for proper disposal of this item.",
      environmentalImpact: [
        "Proper waste disposal helps reduce landfill waste",
        "Recycling conserves natural resources and energy",
        "Preventing contamination improves recycling efficiency"
      ]
    };
  } catch (error) {
    console.error('Error generating recycling recommendations:', error);
    throw new Error('Failed to generate recommendations. Please try again later.');
  }
}
