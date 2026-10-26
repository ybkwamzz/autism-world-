import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Lazy-loaded Gemini client to prevent startup crashes if API key is missing
let aiClient: GoogleGenAI | null = null;

export function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Please add it via the Secrets panel in Settings.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export function registerLumoRoutes(app: express.Express) {
  // Full-stack server side route for Lumo AI Assistant
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history, language } = req.body;
      
      // Attempt to get the Gemini client
      let client;
      try {
        client = getAiClient();
      } catch (e: any) {
        console.warn("Gemini Client initialization failed: ", e.message);
        return res.status(200).json({ 
          text: language === 'swa' 
            ? "Hujambo! Funguo ya siri ya Gemini (API Key) haijawekwa kwenye mipangilio bado. Tafadhali weka 'GEMINI_API_KEY' katika upande wa 'Settings > Secrets' ili kuwasha msaidizi huyu mwerevu. Kwa sasa, nitakusaidia na majibu ya kawaida!"
            : "Hello! The Gemini API Key is not configured yet in the Secrets panel. Please add 'GEMINI_API_KEY' in 'Settings > Secrets' to enable the smart assistant. For now, I'll answer using built-in guide questions!",
          isConfigured: false 
        });
      }

      const sysPrompt = language === 'swa'
        ? `Wewe ni Lumo, msaidizi mkarimu, mwenye ujuzi na upendo mwingi wa Autism Unmasked Kenya.
Kazi yako ni kusaidia wazazi, walezi, walimu, na watu wenye usonji (autism) nchini Kenya kwa kuwapa taarifa sahihi na za matumaini.
Vunja potofu na dhana mbaya (kama vile usonji unasababishwa na uchawi, laana au malezi mabaya). 
Hamasisha uingiliaji wa mapema (early intervention) na ueleze mbinu kama vile ratiba za picha (visual schedules) na mbinu za kutuliza hisia.
Toa maelezo kwa Kiswahili fasaha na chenye upole. Fanya majibu yako yawe mafupi, rahisi kusoma na yenye kueleweka.`
        : `You are Lumo, the welcoming, knowledgeable, and empathetic AI Assistant for Autism Unmasked Kenya.
Your mission is to support parents, caretakers, educators, and autistic individuals in Kenya by providing clear, compassionate, and accurate information.
Break down myths and misconceptions (e.g., that autism is caused by witchcraft, curses, or bad parenting).
Promote early intervention, and recommend local support networks or school guidelines in Kenya.
Suggest actionable techniques like visual schedules, visual flashcards, and sensory calming routines.
Keep your tone warm, validating, and positive. Keep answers concise, readable, and structured with bullet points.`;

      // Construct the formatted history for Gemini
      const contents: any[] = [];
      
      // Add history
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      
      // Add current user prompt with system instruction integrated
      contents.push({
        role: 'user',
        parts: [{ text: `${message}\n\n[Instruction: Keep response focused, compassionate, and respond in ${language === 'swa' ? 'Swahili' : 'English'}.]` }]
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: sysPrompt,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text, isConfigured: true });
    } catch (error: any) {
      console.error('Express /api/chat error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });
}
