/**
 * fetch-photos.mjs — gebruikt Google Places API (New)
 *
 * Gebruik:
 *   GOOGLE_API_KEY=jouw_sleutel node scripts/fetch-photos.mjs
 *
 * Kosten: ~$0.017 per bedrijf (Text Search) + ~$0.007 per foto = ~$0.024 per bedrijf
 * 7112 bedrijven ≈ $170 totaal (eenmalig)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kmurovpjsuavlnnvnozw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7M1CR7_rlTW9WlvXw3brag_XImqyPNn';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('❌ Stel GOOGLE_API_KEY in als omgevingsvariabele.');
  console.error('   Voorbeeld: GOOGLE_API_KEY=AIza... node scripts/fetch-photos.mjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPhotoUrl(naam, stad) {
  // Stap 1: Text Search (New Places API)
  const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.photos',
    },
    body: JSON.stringify({ textQuery: `${naam} ${stad} Nederland` }),
  });

  const searchData = await searchRes.json();
  const photoName = searchData.places?.[0]?.photos?.[0]?.name;
  if (!photoName) return null;

  // Stap 2: Haal foto-URL op (skipHttpRedirect geeft de echte URL terug)
  const photoRes = await fetch(
    `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&skipHttpRedirect=true&key=${GOOGLE_API_KEY}`
  );
  const photoData = await photoRes.json();
  return photoData.photoUri || null;
}

async function main() {
  console.log('🚀 Start ophalen Google Places foto\'s (New API)...\n');

  let verwerkt = 0, geslaagd = 0, gefaald = 0;
  let from = 0;
  const batchSize = 1000;

  while (true) {
    const { data: batch, error } = await supabase
      .from('vakmensen')
      .select('id, naam, stad')
      .is('foto_url', null)
      .range(from, from + batchSize - 1);

    if (error) { console.error('Supabase fout:', error); break; }
    if (!batch || batch.length === 0) break;

    console.log(`📦 Batch ${from}–${from + batch.length - 1} (${batch.length} bedrijven)`);

    for (const vakman of batch) {
      try {
        const url = await fetchPhotoUrl(vakman.naam, vakman.stad);
        if (url) {
          await supabase.from('vakmensen').update({ foto_url: url }).eq('id', vakman.id);
          geslaagd++;
          process.stdout.write(`✅ ${vakman.naam}\n`);
        } else {
          gefaald++;
          process.stdout.write(`⚠️  Geen foto: ${vakman.naam}\n`);
        }
      } catch (err) {
        gefaald++;
        process.stdout.write(`❌ Fout: ${vakman.naam}: ${err.message}\n`);
      }
      verwerkt++;
      await sleep(200); // 5 req/sec
    }

    from += batchSize;
    if (batch.length < batchSize) break;
  }

  console.log(`\n✅ Klaar! ${geslaagd} foto's opgeslagen, ${gefaald} niet gevonden (${verwerkt} totaal).`);
}

main();
