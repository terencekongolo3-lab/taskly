/**
 * fetch-coords.mjs — voegt lat/lon toe aan vakmensen via Nominatim (gratis, geen key)
 *
 * Gebruik:
 *   node scripts/fetch-coords.mjs
 *
 * Nominatim limiet: 1 request/seconde (we doen 1100ms pauze)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kmurovpjsuavlnnvnozw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7M1CR7_rlTW9WlvXw3brag_XImqyPNn';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function geocode(stad) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(stad + ', Nederland')}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Taskly/1.0' } });
  const data = await res.json();
  if (data[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  return null;
}

async function main() {
  console.log('🚀 Start ophalen coördinaten via Nominatim...\n');

  // Unieke steden ophalen (efficiënter dan elke vakman apart geocoden)
  const { data: rows, error } = await supabase
    .from('vakmensen')
    .select('id, stad')
    .is('lat', null);

  if (error) { console.error('Supabase fout:', error); return; }
  if (!rows?.length) { console.log('✅ Alle vakmensen hebben al coördinaten.'); return; }

  console.log(`📦 ${rows.length} vakmensen zonder coördinaten\n`);

  // Cache per stad zodat we niet dezelfde stad meerdere keren geocoden
  const cache = {};
  let geslaagd = 0, gefaald = 0;

  for (const vakman of rows) {
    const stad = vakman.stad?.trim();
    if (!stad) { gefaald++; continue; }

    if (!cache[stad]) {
      try {
        cache[stad] = await geocode(stad);
        await sleep(1100); // Nominatim rate limit
      } catch (err) {
        cache[stad] = null;
      }
    }

    const coords = cache[stad];
    if (coords) {
      await supabase.from('vakmensen').update({ lat: coords.lat, lon: coords.lon }).eq('id', vakman.id);
      geslaagd++;
      process.stdout.write(`✅ ${vakman.stad} → ${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}\n`);
    } else {
      gefaald++;
      process.stdout.write(`⚠️  Niet gevonden: ${vakman.stad}\n`);
    }
  }

  console.log(`\n✅ Klaar! ${geslaagd} bijgewerkt, ${gefaald} niet gevonden.`);
}

main();
