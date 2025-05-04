const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Aktifkan CORS untuk semua permintaan
app.use(cors());
app.use(express.json());

// Endpoint proxy untuk Gemini API
app.post('/api/gemini', async (req, res) => {
  try {
    const API_KEY = process.env.VITE_GEMINI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'API key Gemini tidak ditemukan. Pastikan VITE_GEMINI_API_KEY telah diatur di file .env'
      });
    }
    
    const { prompt, model = 'gemini-1.5-flash' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt diperlukan' });
    }
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEY
        }
      }
    );
    
    return res.json(response.data);
  } catch (error) {
    console.error('Error proxy Gemini API:', error.response?.data || error.message);
    
    // Tangani error API key
    if (error.response?.status === 403 || error.message.includes('API key')) {
      return res.status(401).json({ 
        error: 'API key Gemini tidak valid atau belum diaktifkan.'
      });
    }
    
    return res.status(500).json({ 
      error: 'Gagal menghubungi layanan Gemini API: ' + (error.response?.data?.error?.message || error.message)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server berjalan di port ${PORT}`);
});