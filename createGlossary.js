import fs from 'fs';
import * as deepl from 'deepl-node';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';
dotenv.config();

const translator = new deepl.DeepLClient(process.env.DEEPL_API_KEY);

async function createGlossary(name, sourceLang, targetLang, csvFilePath) {
    try {
        const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
        const records = parse(csvContent, {
            skip_empty_lines: true,
        });

        // Convert array of [source, target] entries into a Map
        const entriesMap = new Map(records);

        const glossary = await translator.createGlossary(name, sourceLang, targetLang, entriesMap);
        console.log(`✅ Created glossary: ${glossary.name} (ID: ${glossary.glossaryId})`);
    } catch (err) {
        console.error(`❌ Error creating glossary (${name}):`, err);
    }
}

// List your CSV glossary files here and create one glossary per file/language pair:
async function main() {
    await createGlossary('EN-ET Glossary', 'EN', 'ET', './glossary-en-et.csv');
    await createGlossary('EN-LV Glossary', 'EN', 'LV', './glossary-en-lv.csv');
    await createGlossary('EN-LT Glossary', 'EN', 'LT', './glossary-en-lt.csv');
    await createGlossary('EN-RU Glossary', 'EN', 'RU', './glossary-en-ru.csv');
    await createGlossary('EN-FI Glossary', 'EN', 'FI', './glossary-en-fi.csv');
}

main();
