import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

// Gemini AI API key would come from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiPrefix = "/api";

  // Learning Resources Endpoints
  app.get(`${apiPrefix}/learning-resources`, async (req, res) => {
    try {
      const resources = await storage.getAllLearningResources();
      res.json(resources);
    } catch (error) {
      console.error("Error fetching learning resources:", error);
      res.status(500).json({ message: "Failed to fetch learning resources" });
    }
  });

  app.get(`${apiPrefix}/learning-resources/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const resource = await storage.getLearningResourceById(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      console.error("Error fetching learning resource:", error);
      res.status(500).json({ message: "Failed to fetch learning resource" });
    }
  });

  // Waste Types Endpoints
  app.get(`${apiPrefix}/waste-types`, async (req, res) => {
    try {
      const types = await storage.getAllWasteTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching waste types:", error);
      res.status(500).json({ message: "Failed to fetch waste types" });
    }
  });

  // Recycling Centers Endpoints
  app.get(`${apiPrefix}/recycling-centers`, async (req, res) => {
    try {
      const { latitude, longitude, type } = req.query;
      
      // Default to centered on a common location if no coordinates provided
      const lat = parseFloat(latitude as string) || 37.7749;
      const lng = parseFloat(longitude as string) || -122.4194;
      
      const centers = await storage.getNearbyRecyclingCenters(lat, lng, type as string);
      res.json(centers);
    } catch (error) {
      console.error("Error fetching recycling centers:", error);
      res.status(500).json({ message: "Failed to fetch recycling centers" });
    }
  });

  app.get(`${apiPrefix}/recycling-centers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid center ID" });
      }
      
      const center = await storage.getRecyclingCenterById(id);
      if (!center) {
        return res.status(404).json({ message: "Recycling center not found" });
      }
      
      res.json(center);
    } catch (error) {
      console.error("Error fetching recycling center:", error);
      res.status(500).json({ message: "Failed to fetch recycling center" });
    }
  });

  // Recommendations Endpoint (using Google Gemini API)
  app.post(`${apiPrefix}/recommendations`, async (req, res) => {
    try {
      const { wasteType, imageDescription } = req.body;
      
      if (!wasteType) {
        return res.status(400).json({ message: "Waste type is required" });
      }

      // If we have a Gemini API key, use it to get recommendations
      if (GEMINI_API_KEY) {
        try {
          // Create prompt for Gemini
          const prompt = `You are a waste management and recycling expert. Please provide a specific, detailed recycling recommendation for the following waste type: ${wasteType}. ${imageDescription ? `The item appears to be: ${imageDescription}.` : ''}
          
          Return the following JSON format:
          {
            "recommendation": "A detailed explanation of how to properly dispose of this item including any preparation steps (cleaning, disassembly, etc.)",
            "environmentalImpact": ["3-4 bullet points about the environmental impact of properly recycling this item"]
          }`;

          // Call Gemini API
          const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
              contents: [{ parts: [{ text: prompt }] }],
            }
          );

          // Parse the response to extract the JSON
          const geminiResponse = response.data.candidates[0].content.parts[0].text;
          const jsonMatch = geminiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                          geminiResponse.match(/{[\s\S]*?}/);
                          
          let parsedResponse;
          
          if (jsonMatch) {
            // Extract JSON from code block or directly from text
            const jsonString = jsonMatch[1] || jsonMatch[0];
            parsedResponse = JSON.parse(jsonString);
          } else {
            throw new Error("Failed to parse Gemini response");
          }

          return res.json(parsedResponse);
        } catch (error) {
          console.error("Error with Gemini API:", error);
          // Fall back to default recommendations if Gemini fails
        }
      }
      
      // Default recommendations if Gemini API is not available or fails
      const recommendations = getDefaultRecommendations(wasteType);
      res.json(recommendations);
      
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ 
        message: "Failed to generate recommendations",
        recommendation: "Please check with your local recycling guidelines for proper disposal of this item.",
        environmentalImpact: [
          "Proper waste disposal helps reduce landfill waste",
          "Recycling conserves natural resources and energy",
          "Preventing contamination improves recycling efficiency"
        ]
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Default recommendations when Gemini API is not available
function getDefaultRecommendations(wasteType: string) {
  const defaultRecommendations: Record<string, any> = {
    "Plastic": {
      recommendation: "Clean the plastic item and check for a recycling symbol (1-7). Place it in your recycling bin if accepted by your local program. Remove any non-plastic parts or labels if possible.",
      environmentalImpact: [
        "Recycling one plastic bottle saves enough energy to power a 60W light bulb for 6 hours",
        "Prevents harmful chemicals from leaching into soil and waterways",
        "Reduces dependence on petroleum for new plastic production",
        "Keeps plastic out of oceans where it can harm marine life"
      ]
    },
    "Paper": {
      recommendation: "Unfold or flatten paper items and place in your paper recycling bin. Remove any plastic sleeves, windows, or non-paper elements. For shredded paper, check local guidelines as it may need to be bagged separately.",
      environmentalImpact: [
        "Recycling one ton of paper saves 17 trees and 7,000 gallons of water",
        "Reduces greenhouse gas emissions from paper decomposing in landfills",
        "Saves energy compared to making paper from virgin wood pulp",
        "Decreases the demand for tree harvesting and deforestation"
      ]
    },
    "Glass": {
      recommendation: "Rinse glass containers to remove food residue. Remove and separate caps and lids (these are often made of different materials). Place clean glass in your recycling bin.",
      environmentalImpact: [
        "Glass can be recycled indefinitely without loss of quality",
        "Recycling glass reduces mining of raw materials like sand and limestone",
        "Uses 40% less energy than making new glass from raw materials",
        "Reduces CO2 emissions associated with glass production"
      ]
    },
    "Metal": {
      recommendation: "Rinse metal items to remove food residue. For aluminum cans, don't crush them as this can make them harder to sort. For steel cans, remove paper labels if possible.",
      environmentalImpact: [
        "Recycling aluminum uses 95% less energy than producing new aluminum",
        "Metal can be recycled indefinitely without degrading in quality",
        "Reduces mining of raw ore and associated environmental damage",
        "Saves significant amounts of water compared to primary production"
      ]
    },
    "Organic": {
      recommendation: "Compost food scraps, yard waste, and other organic materials in a home compost bin or through municipal composting programs. Avoid composting meat, dairy, and oils in home systems.",
      environmentalImpact: [
        "Diverts waste from landfills where it would produce methane, a potent greenhouse gas",
        "Creates nutrient-rich soil amendment that reduces need for chemical fertilizers",
        "Improves soil health and water retention in gardens and agriculture",
        "Completes the natural nutrient cycle, returning organic matter to the soil"
      ]
    },
    "Electronic": {
      recommendation: "Never dispose of electronics in regular trash. Take them to designated e-waste collection centers, retailer take-back programs, or community e-waste events. Back up and wipe personal data before recycling.",
      environmentalImpact: [
        "Prevents toxic materials like lead, mercury, and cadmium from entering landfills",
        "Allows recovery of valuable metals like gold, silver, and copper",
        "Reduces environmental damage from mining raw materials for new electronics",
        "Proper e-waste handling prevents hazardous materials from contaminating soil and water"
      ]
    },
    "Hazardous": {
      recommendation: "Never dispose of hazardous waste in regular trash or down drains. Take items like batteries, paint, chemicals, and fluorescent bulbs to hazardous waste collection facilities or special collection events.",
      environmentalImpact: [
        "Prevents toxic substances from contaminating soil, water, and air",
        "Protects waste workers from exposure to dangerous chemicals",
        "Allows for proper neutralization or safe storage of harmful materials",
        "Many hazardous materials can be recycled or repurposed when properly collected"
      ]
    },
    "Other": {
      recommendation: "Check with your local waste management authority for specific guidelines on this item. If it cannot be recycled or composted, place it in general waste.",
      environmentalImpact: [
        "Proper sorting prevents contamination of recycling streams",
        "Following local guidelines ensures the most environmentally appropriate disposal",
        "Some items may have special take-back or recycling programs",
        "When in doubt, research before throwing out to ensure proper disposal"
      ]
    }
  };

  // Return the matching recommendation or the "Other" category if no match
  return defaultRecommendations[wasteType] || defaultRecommendations["Other"];
}
