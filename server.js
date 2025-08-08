import express from 'express';
import * as deepl from 'deepl-node';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const translator = new deepl.DeepLClient(process.env.DEEPL_API_KEY);
const glossaryId = process.env.DEEPL_GLOSSARY_ID; // load from .env

// Glossary terms mapping (lowercase keys)
const glossaryTerms = {
    "женщины": "Женщины",
    // Add more glossary fixes if needed
};

// Capitalize first letter helper
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fix glossary terms in the translated text
function applyGlossaryFixes(text) {
    let fixedText = text;
    for (const [key, value] of Object.entries(glossaryTerms)) {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');  // whole word, case-insensitive
        fixedText = fixedText.replace(regex, () => capitalizeFirstLetter(value));
    }
    return fixedText;
}

app.post('/translate', async (req, res) => {
    try {
        const { text } = req.body;
        const targetLangs = ['LV', 'ET', 'LT', 'RU', 'FI']; // Language codes

        const results = await Promise.all(
            targetLangs.map(async (lang) => {
                const result = await translator.translateText(
                    text,
                    null,
                    lang,
                    { glossaryId } // apply glossary
                );
                // Fix capitalization of glossary terms AFTER translation
                const fixedTranslation = applyGlossaryFixes(result.text);
                return { language: lang, translation: fixedTranslation };
            })
        );

        res.json({ translations: results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
