import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Process a chat message via Gemini
// @route   POST /api/chat
// @access  Private
router.post('/', protect, async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful A.C.E Study Planner AI Assistant. The user is asking: ${prompt}`
        });

        const reply = response.text || "I'm sorry, I couldn't generate a response.";
        res.json({ reply });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Error processing chat response', error: error.message });
    }
});

export default router;
