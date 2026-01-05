import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Deal, Restaurant, MagicDealSuggestion } from '../types';

const getAiClient = () => {
  // In a real scenario, this would check availability or handle errors more gracefully
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Magic Deal Creator ---

export const generateMagicDeal = async (
  situationDescription: string,
  cuisine: string
): Promise<MagicDealSuggestion | null> => {
  const ai = getAiClient();
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Catchy deal title" },
      description: { type: Type.STRING, description: "Short, appealing description" },
      discountValue: { type: Type.NUMBER, description: "Discount amount" },
      discountType: { type: Type.STRING, enum: ["fixed", "percent"] },
      durationMinutes: { type: Type.INTEGER, description: "Duration in minutes" },
      maxRedemptions: { type: Type.INTEGER, description: "Suggested quantity" }
    },
    required: ["title", "description", "discountValue", "discountType", "durationMinutes", "maxRedemptions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I am a restaurant owner serving ${cuisine}. Situation: "${situationDescription}". Create a flash deal configuration.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert restaurant marketing assistant. Your goal is to fill empty tables immediately. Create urgency.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MagicDealSuggestion;
    }
    return null;
  } catch (error) {
    console.error("Gemini Magic Deal Error:", error);
    return null;
  }
};

// --- AI Food Concierge ---

export const askFoodConcierge = async (
  userQuery: string,
  restaurants: Restaurant[],
  activeDeals: Deal[],
  userLocation: { lat: number; lng: number } | null
): Promise<{ recommendationText: string; recommendedRestaurantIds: string[] }> => {
  const ai = getAiClient();

  // Create a context summary for the AI
  const contextData = restaurants.map(r => {
    const deals = activeDeals.filter(d => d.restaurantId === r.id);
    return {
      id: r.id,
      name: r.name,
      cuisine: r.cuisineType,
      rating: r.rating,
      activeDeals: deals.map(d => `${d.title} (${d.discountType === 'fixed' ? '-' + d.discountValue + '€' : d.discountValue + '% off'})`),
    };
  });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      recommendationText: { type: Type.STRING, description: "Friendly advice and reasoning for the recommendation." },
      recommendedRestaurantIds: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of IDs of the best matching restaurants."
      }
    },
    required: ["recommendationText", "recommendedRestaurantIds"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User asks: "${userQuery}".\n\nAvailable Data: ${JSON.stringify(contextData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are Sponti, a helpful food concierge. Recommend the best options based on the user's craving. Prioritize places with active deals if relevant. Be brief and friendly.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { recommendationText: "I couldn't process that right now.", recommendedRestaurantIds: [] };
  } catch (error) {
    console.error("Gemini Concierge Error:", error);
    return { recommendationText: "Sorry, I'm having trouble connecting to the food network.", recommendedRestaurantIds: [] };
  }
};
