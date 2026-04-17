/**
 * Stampify Google Maps Scraper — async Node.js
 * Collects existing Apify datasets + runs remaining searches
 * Outputs scored CSV
 */

import { writeFileSync } from 'fs';

const TOKEN  = 'apify_api_g4jibsYD0beDzGJ6fl16YSLTpXp9rQ4iqvd9';
const ACTOR  = 'nwua9Gu5YrADL7ZDj'; // compass~crawler-google-places
const DATE   = '2026-04-16';
const OUT    = `/c/Users/augus/loyalty-cards/stampify_prospects_${DATE}.csv`;

// ── All 42 searches ────────────────────────────────────────────────────────
const SEARCHES = [
  // P1 Beauty/Wellness +3
  { q:'spa',                city:'Genève, Switzerland',    cb:3 },
  { q:'spa',                city:'Lausanne, Switzerland',  cb:3 },
  { q:'spa',                city:'Fribourg, Switzerland',  cb:3 },
  { q:'institut de beauté', city:'Genève, Switzerland',    cb:3 },
  { q:'institut de beauté', city:'Lausanne, Switzerland',  cb:3 },
  { q:'salon de beauté',    city:'Genève, Switzerland',    cb:3 },
  { q:'salon de beauté',    city:'Lausanne, Switzerland',  cb:3 },
  { q:'nail studio',        city:'Genève, Switzerland',    cb:3 },
  { q:'nail studio',        city:'Lausanne, Switzerland',  cb:3 },
  { q:'onglerie',           city:'Genève, Switzerland',    cb:3 },
  { q:'onglerie',           city:'Lausanne, Switzerland',  cb:3 },
  { q:'onglerie',           city:'Fribourg, Switzerland',  cb:3 },
  // P2 Restaurants +2/+1
  { q:'restaurant gastronomique', city:'Genève, Switzerland',   cb:2 },
  { q:'restaurant gastronomique', city:'Lausanne, Switzerland', cb:2 },
  { q:'brasserie',          city:'Genève, Switzerland',    cb:2 },
  { q:'brasserie',          city:'Lausanne, Switzerland',  cb:2 },
  { q:'restaurant',         city:'Nyon, Switzerland',      cb:1 },
  { q:'restaurant',         city:'Morges, Switzerland',    cb:1 },
  { q:'restaurant',         city:'Vevey, Switzerland',     cb:1 },
  { q:'restaurant',         city:'Montreux, Switzerland',  cb:1 },
  // P3 Salons +2
  { q:'salon de coiffure',  city:'Genève, Switzerland',    cb:2 },
  { q:'salon de coiffure',  city:'Lausanne, Switzerland',  cb:2 },
  { q:'coiffeur',           city:'Nyon, Switzerland',      cb:2 },
  { q:'coiffeur',           city:'Morges, Switzerland',    cb:2 },
  { q:'barbershop',         city:'Genève, Switzerland',    cb:2 },
  { q:'barbershop',         city:'Lausanne, Switzerland',  cb:2 },
  // P4 Cafés +1
  { q:'coffee shop',        city:'Genève, Switzerland',    cb:1 },
  { q:'coffee shop',        city:'Lausanne, Switzerland',  cb:1 },
  { q:'café',               city:'Genève, Switzerland',    cb:1 },
  { q:'café',               city:'Lausanne, Switzerland',  cb:1 },
  { q:'café',               city:'Fribourg, Switzerland',  cb:1 },
  { q:'café',               city:'Nyon, Switzerland',      cb:1 },
  // P5 Boulangeries +1
  { q:'boulangerie artisanale', city:'Genève, Switzerland',   cb:1 },
  { q:'boulangerie artisanale', city:'Lausanne, Switzerland', cb:1 },
  { q:'boulangerie',        city:'Nyon, Switzerland',      cb:1 },
  { q:'boulangerie',        city:'Morges, Switzerland',    cb:1 },
  { q:'boulangerie',        city:'Vevey, Switzerland',     cb:1 },
  // P6 France
  { q:'spa',                city:'Annecy, France',         cb:3 },
  { q:'spa',                city:'Annemasse, France',      cb:3 },
  { q:'restaurant',         city:'Gex, France',            cb:1 },
  { q:'salon de coiffure',  city:'Annecy, France',         cb:2 },
  { q:'café',               city:'Annemasse, France',      cb:1 },
];

// ── Datasets already collected by the previous agent ───────────────────────
// These cover approximately searches 1-14 (spa x3, institut x2, salon beauté x2,
// nail x2, onglerie x3, restaurant gastro x2)
const DONE_DATASETS = [
  { id:'ZurIdxM7Q7bxQonyz', cb:3 }, // spa Genève
  { id:'i8OMlHUN7W5bZnb0s', cb:3 }, // spa Lausanne
  { id:'BuNGX4d6oMQmPvbtv', cb:3 }, // spa Fribourg
  { id:'h527f5Aryske2K0sr', cb:3 }, // institut beauté Genève
  { id:'kZ2psK1xBMU144Zxz', cb:3 }, // institut beauté Lausanne
  { id:'gwdHQtpStcss8zxaG', cb:3 }, // salon beauté / institut Lausanne
  { id:'ttAjhCYcDaVz7qFuE', cb:3 }, // nail / salon Genève
  { id:'A5vncGncnknnhh0Nr', cb:3 }, // nail studio Genève
  { id:'cZleecpfFVe1sLgDy', cb:3 }, // onglerie Genève
  { id:'4SS0xgkwftuDfYUbv', cb:3 }, // nail/onglerie Lausanne
  { id:'N6RS9f65breSSt3Uw', cb:3 }, // onglerie Fribourg
  { id:'Z8EVpV7wIjBepYrip', cb:2 }, // restaurant gastro Genève
  { id:'7NX2ra2JFbaz5byeJ', cb:2 }, // restaurant gastro Lausanne
  { id:'XRBHhIsl9gEdjNU2a', cb:1 }, // unknown (San Francisco junk - will be filtered)
  { id:'dRXBlwe2TvjJKNSrL', cb:2 }, // unknown (St Catharines junk - will be filtered)
];

// Searches already covered (0-indexed) — skip these to save compute units
const SKIP = new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);

// ── Valid cities ───────────────────────────────────────────────────────────
const VALID = [
  'genève','geneve','geneva','genf','ge ',
  'lausanne','vd ',
  'fribourg','freiburg',
  'nyon','morges','vevey','montreux',
  'annecy','annemasse','gex',
  'carouge','lancy','onex','meyrin','vernier','plan-les-ouates','grand-lancy',
  'thônex','thonex','bernex','confignon','satigny','aire-la-ville',
  'renens','prilly','bussigny','ecublens','crissier',
  'pully','lutry','cully','chexbres',
  'rolle','aubonne','gland','prangins','coppet','tannay','mies',
  'épalinges','epalinges','paudex',
  'monthey','aigle','yvorne',
];

function validCity(city, addr) {
  const s = ((city||'')+(addr||'')).toLowerCase();
  return VALID.some(v => s.includes(v));
}

// ── Scoring ────────────────────────────────────────────────────────────────
const FREE = ['wix.com','wixsite.com','jimdo.com','jimdofree.com','jimdosite.com',
  'wordpress.com','squarespace.com','webnode','e-monsite','webself.net'];

function calcScore(b, cb) {
  let s = cb;
  const ws = (b.website||'').toLowerCase();
  if (!ws) s += 3;
  else if (FREE.some(f => ws.includes(f))) s += 2;
  if ((b.rating||0) >= 4.5) s += 2;
  const rv = b.reviewCount || 0;
  if (rv >= 100) s += 1;
  if (rv >= 50)  s += 1;
  if (rv < 10)   s -= 1;
  return s;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function apiFetch(url) {
  const r = await fetch(url);
  return r.json();
}

async function apiPost(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

function mapItem(raw, cb) {
  const city = raw.city || raw.location?.city || '';
  const addr = raw.address || '';
  return {
    name:        raw.title || raw.name || '',
    category:    raw.categoryName || raw.categories?.[0] || '',
    address:     addr,
    city:        city || extractCity(addr),
    phone:       raw.phone || raw.phoneNumber || '',
    website:     raw.website || '',
    rating:      parseFloat(raw.totalScore) || 0,
    reviewCount: parseInt(raw.reviewsCount)  || 0,
    googleMapsUrl: raw.url || raw.googleMapsUrl || '',
    cb,
  };
}

function extractCity(addr) {
  if (!addr) return '';
  const m = addr.match(/\d{4,5}\s+([A-ZÀ-Üa-zà-ü][a-zà-ü\-]+(?:[\s-][A-ZÀ-Üa-zà-ü][a-zà-ü\-]+)*)/);
  return m ? m[1] : '';
}

async function fetchDataset(dsId, cb) {
  try {
    const items = await apiFetch(
      `https://api.apify.com/v2/datasets/${dsId}/items?token=${TOKEN}&format=json&limit=100`
    );
    if (!Array.isArray(items)) return [];
    return items
      .map(i => mapItem(i, cb))
      .filter(b => validCity(b.city, b.address) && b.name);
  } catch(e) {
    console.error(`  fetchDataset ${dsId} error: ${e.message}`);
    return [];
  }
}

async function runSearch(s, num, total) {
  const q = `${s.q} in ${s.city}`;
  process.stdout.write(`  [${num}/${total}] "${q}" … `);

  let runRes;
  try {
    runRes = await apiPost(
      `https://api.apify.com/v2/acts/${ACTOR}/runs?token=${TOKEN}`,
      {
        searchStringsArray: [q],
        maxCrawledPlacesPerSearch: 100,
        language: 'fr',
        exportPlaceUrls: false,
        includeHistogram: false,
        includeOpeningHours: false,
        includePeopleAlsoSearch: false,
        maxImages: 0,
        maxReviews: 0,
      }
    );
  } catch(e) {
    console.log(`START ERROR: ${e.message}`);
    return [];
  }

  const runId = runRes?.data?.id;
  if (!runId) {
    console.log(`NO RUN ID: ${JSON.stringify(runRes).substring(0,120)}`);
    return [];
  }

  // Poll
  let status = '', dsId = '', attempts = 0;
  while (!['SUCCEEDED','FAILED','TIMED-OUT','ABORTED'].includes(status) && attempts < 40) {
    await sleep(15000);
    attempts++;
    try {
      const poll = await apiFetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${TOKEN}`);
      status = poll?.data?.status || '';
      dsId   = poll?.data?.defaultDatasetId || '';
    } catch(e) { /* retry */ }
    process.stdout.write('.');
  }

  if (status !== 'SUCCEEDED') {
    console.log(` ✗ ${status}`);
    return [];
  }

  const items = await fetchDataset(dsId, s.cb);
  console.log(` ✓ ${items.length} results`);
  return items;
}

function csvField(v) {
  const s = String(v ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

// ── MAIN ────────────────────────────────────────────────────────────────────
const allBiz = [];
let totalRaw = 0;

// Phase 1 — Existing datasets
console.log('\n══════ Phase 1: Harvesting 15 existing datasets ══════');
for (const { id, cb } of DONE_DATASETS) {
  const items = await fetchDataset(id, cb);
  // Count raw
  try {
    const raw = await apiFetch(`https://api.apify.com/v2/datasets/${id}?token=${TOKEN}`);
    totalRaw += raw?.data?.itemCount || 0;
  } catch(e) {}
  console.log(`  ${id}: ${items.length} valid`);
  allBiz.push(...items);
}

// Phase 2 — Run remaining searches
const remaining = SEARCHES.filter((_, i) => !SKIP.has(i));
console.log(`\n══════ Phase 2: Running ${remaining.length} remaining searches ══════`);
let idx = 0;
for (const s of remaining) {
  idx++;
  const items = await runSearch(s, idx, remaining.length);
  totalRaw += items.length;
  allBiz.push(...items);
}

// Phase 3 — Dedup
console.log('\n══════ Phase 3: Dedup & Score ══════');
const seen = new Map();
for (const b of allBiz) {
  const key = (b.name + '|' + b.address).toLowerCase().trim();
  if (!seen.has(key)) {
    seen.set(key, { ...b, score: calcScore(b, b.cb) });
  }
}

const deduped  = [...seen.values()];
const filtered = deduped.filter(b => b.score >= 5).sort((a,b) => b.score - a.score);

console.log(`\n  Total raw scraped:   ${totalRaw}`);
console.log(`  After dedup:         ${deduped.length}`);
console.log(`  Score >= 5:          ${filtered.length}`);

// Phase 4 — Top 10
console.log('\n══════ TOP 10 PROSPECTS ══════');
filtered.slice(0,10).forEach((b,i) => {
  console.log(`${String(i+1).padStart(2)}. [${b.score}] ${b.name} — ${b.city}`);
});

// Phase 5 — CSV
const header = 'Score,Category,Name,City,Phone,Website,Rating,Reviews,Address,GoogleMapsURL';
const rows = filtered.map(b => [
  b.score,
  csvField(b.category),
  csvField(b.name),
  csvField(b.city),
  csvField(b.phone),
  csvField(b.website || 'Aucun site'),
  b.rating || '',
  b.reviewCount || '',
  csvField(b.address),
  csvField(b.googleMapsUrl),
].join(','));

const csv = [header, ...rows].join('\n');
writeFileSync(OUT, '\uFEFF' + csv, 'utf8');
console.log(`\n✓ CSV saved: ${OUT}  (${rows.length} rows)`);

// Print CSV for capture
console.log('\n══════ CSV START ══════');
console.log(csv);
console.log('══════ CSV END ══════');
