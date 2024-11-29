import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv"

const app = express();
const PORT = 3000;
dotenv.config()
app.use(cors());
app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
    const { input, source_language, target_language } = req.body;
    
    if (!input || !source_language || !target_language) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.API_KEY}`, 
            {
                q: input,
                source: source_language,
                target: target_language,
            }
        );

        res.json({ translation: response.data.data.translations[0].translatedText });
    } catch (error) {
        console.error('Translation API error:', error);
        res.status(500).json({ error: 'Failed to translate text' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
