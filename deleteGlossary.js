import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.DEEPL_API_URL;
const API_KEY = process.env.DEEPL_API_KEY;

async function listGlossaries() {
    const res = await fetch(`${API_URL}/glossaries`, {
        headers: { 'Authorization': `DeepL-Auth-Key ${API_KEY}` }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function deleteGlossary(glossaryId) {
    const res = await fetch(`${API_URL}/glossaries/${glossaryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `DeepL-Auth-Key ${API_KEY}` }
    });
    if (res.status === 204) {
        console.log(`✅ Deleted glossary ${glossaryId}`);
    } else {
        throw new Error(await res.text());
    }
}

(async () => {
    try {
        const data = await listGlossaries();
        if (!data.glossaries.length) {
            console.log('No glossaries found.');
            return;
        }
        console.log('Existing glossaries:');
        data.glossaries.forEach(g => console.log(`${g.glossary_id} - ${g.name}`));

        // Delete all glossaries
        for (const g of data.glossaries) {
            console.log(`Deleting: ${g.glossary_id}`);
            await deleteGlossary(g.glossary_id);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
})();
