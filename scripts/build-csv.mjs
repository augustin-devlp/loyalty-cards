/**
 * Build final Stampify CSV from all 40 collected Apify datasets
 */
import { writeFileSync } from 'fs';

const TOKEN = 'apify_api_g4jibsYD0beDzGJ6fl16YSLTpXp9rQ4iqvd9';
const OUT   = 'C:\\Users\\augus\\loyalty-cards\\stampify_prospects_2026-04-16.csv';

// ── All 40 datasets with correct category bonuses ─────────────────────────
const DATASETS = [
  // Old agent — P1 Beauty/Wellness (cb=3)
  { id:'ZurIdxM7Q7bxQonyz', cb:3, label:'spa Genève' },
  { id:'i8OMlHUN7W5bZnb0s', cb:3, label:'spa Lausanne' },
  { id:'BuNGX4d6oMQmPvbtv', cb:3, label:'spa Fribourg' },
  { id:'h527f5Aryske2K0sr', cb:3, label:'institut beauté Genève' },
  { id:'kZ2psK1xBMU144Zxz', cb:3, label:'institut beauté Lausanne' },
  { id:'dRXBlwe2TvjJKNSrL', cb:3, label:'salon beauté Genève' },
  { id:'gwdHQtpStcss8zxaG', cb:3, label:'salon beauté Lausanne' },
  { id:'ttAjhCYcDaVz7qFuE', cb:3, label:'nail studio Genève' },
  { id:'A5vncGncnknnhh0Nr', cb:3, label:'nail studio Lausanne' },
  { id:'cZleecpfFVe1sLgDy', cb:3, label:'onglerie Genève' },
  { id:'4SS0xgkwftuDfYUbv', cb:3, label:'onglerie Lausanne' },
  { id:'N6RS9f65breSSt3Uw', cb:3, label:'onglerie Fribourg' },
  // Old agent — P2 Restaurant gastro (cb=2)
  { id:'Z8EVpV7wIjBepYrip', cb:2, label:'resto gastro Genève' },
  { id:'7NX2ra2JFbaz5byeJ', cb:2, label:'resto gastro Lausanne' },
  { id:'XRBHhIsl9gEdjNU2a', cb:1, label:'unknown (old agent)' },
  // New script — P2 Brasserie (cb=2)
  { id:'VM8KUwT3tdHD4IRkL', cb:2, label:'brasserie Genève' },
  { id:'vtVetvYreVJLVdtdw', cb:2, label:'brasserie Lausanne' },
  // New script — P2 Restaurant small city (cb=1)
  { id:'zCclKVlGfoAJYuPSZ', cb:1, label:'restaurant Nyon' },
  { id:'52r0dVM7C3TtSK1Uv', cb:1, label:'restaurant Morges' },
  { id:'HOrn8SO20hRIFQeOX', cb:1, label:'restaurant Vevey' },
  { id:'1e9XYTOzwM1k1zDPD', cb:1, label:'restaurant Montreux' },
  // New script — P3 Salons (cb=2)
  { id:'lByqMbEttmDStgMFO', cb:2, label:'salon coiffure Genève' },
  { id:'MDSzhXYGZGguXTEjY', cb:2, label:'salon coiffure Lausanne' },
  { id:'BgTGR39OAaaLKcTBu', cb:2, label:'coiffeur Nyon' },
  { id:'aEzOShCrWzNgKYulh', cb:2, label:'coiffeur Morges' },
  { id:'tFYo4iXx8bMDWUiPW', cb:2, label:'barbershop Genève' },
  { id:'fkP80e8ECaqBjNGOx', cb:2, label:'barbershop Lausanne' },
  // New script — P4 Cafés (cb=1)
  { id:'huv4TtrJvoqhrIVac', cb:1, label:'coffee shop Genève' },
  { id:'r7SD9ObOXEXHILxBm', cb:1, label:'coffee shop Lausanne' },
  { id:'NhvOxZwALxnJmSp9a', cb:1, label:'café Genève' },
  { id:'KngaHBPdiX3aEXQjM', cb:1, label:'café Lausanne' },
  { id:'IyKUtoVKjr5Mz3Fa4', cb:1, label:'café Fribourg' },
  { id:'vRJKmuPm1HIjzGLnh', cb:1, label:'café Nyon' },
  // New script — P5 Boulangeries (cb=1)
  { id:'ddOrhxTPBJM5hfEBC', cb:1, label:'boulangerie artisanale Genève' },
  { id:'kOQrHI7cS9gg6baRf', cb:1, label:'boulangerie artisanale Lausanne' },
  { id:'RSU6vUoxLDxCEhEyv', cb:1, label:'boulangerie Nyon' },
  { id:'8WafmkICWbqm2zDSA', cb:1, label:'boulangerie Morges' },
  { id:'l89XOEUIzOut0utMv', cb:1, label:'boulangerie Vevey' },
  // New script — P6 France
  { id:'PHABihXvu9vIAhRVa', cb:3, label:'spa Annecy' },
  { id:'3gR8YazGZg4thIbkS', cb:3, label:'spa Annemasse' },
];

// ── Valid cities (filter out wrong-geo results) ────────────────────────────
const VALID = [
  'genève','geneve','geneva','genf',
  'lausanne',
  'fribourg','freiburg',
  'nyon','morges','vevey','montreux',
  'annecy','annemasse','gex',
  'carouge','lancy','onex','meyrin','vernier','plan-les-ouates','grand-lancy',
  'thônex','thonex','bernex','confignon','satigny',
  'renens','prilly','bussigny','ecublens','crissier',
  'pully','lutry','cully',
  'rolle','aubonne','gland','prangins','coppet','tannay','mies',
  'épalinges','epalinges','paudex',
  'champel','plainpalais','eaux-vives','rive','jonction','chêne',
  'chene-bougeries','chêne-bougeries','chêne-bourg',
  'bellevue','pregny','chambésy','chambesy',
  'chavannes','ecublens','st-sulpice','saint-sulpice',
  'vevey','clarens',
  'monthey','aigle',
  'gruyères','bulle',
];

function validCity(city, addr) {
  // Primary: check city field directly
  if (city) {
    const c = city.toLowerCase().trim();
    if (VALID.some(v => c === v || c.startsWith(v) || v.startsWith(c.split(' ')[0]))) return true;
  }
  // Secondary: check for Swiss/French postal code (CH: 1000-9999, FR: 01000-74999)
  // Must have a CH or FR postal code, not Canadian/US
  const chPostal = /\b(10[0-9]{2}|1[1-9][0-9]{2}|[2-9][0-9]{3})\b/;
  const frPostal = /\b(0[1-9][0-9]{3}|[1-7][0-9]{4})\b/;
  const hasSwissOrFrench = chPostal.test(addr||'') || frPostal.test(addr||'');
  if (!hasSwissOrFrench) return false;
  // Also check that Suisse or France appears, OR no country/province indicator for other countries
  const a = (addr||'').toLowerCase();
  if (a.includes('canada') || a.includes(' on ') || a.includes(', on,') ||
      a.includes('usa') || a.includes('united states') || a.includes('united kingdom') ||
      a.includes('deutschland') || a.includes('italia') || a.includes('españa')) return false;
  // Check city appears in address
  const cityFromAddr = extractCity(addr);
  if (cityFromAddr) {
    const c = cityFromAddr.toLowerCase();
    return VALID.some(v => c.includes(v) || v.includes(c));
  }
  return false;
}

// ── Scoring ────────────────────────────────────────────────────────────────
const FREE = [
  'wix.com','wixsite.com','jimdo.com','jimdofree.com','jimdosite.com',
  'wordpress.com','squarespace.com','webnode','e-monsite','webself.net',
  'yolasite.com','weebly.com','site123.me','strikingly.com',
];

function calcScore(b, cb) {
  let s = cb;
  const ws = (b.website||'').toLowerCase().trim();
  if (!ws) {
    s += 3;
  } else if (FREE.some(f => ws.includes(f))) {
    s += 2;
  }
  const rating = parseFloat(b.rating) || 0;
  const rv     = parseInt(b.reviewCount) || 0;
  if (rating >= 4.5) s += 2;
  if (rv >= 100) s += 1;
  if (rv >= 50)  s += 1;
  if (rv < 10)   s -= 1;
  return s;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function extractCity(addr) {
  if (!addr) return '';
  const m = addr.match(/\d{4,5}\s+([A-ZÀ-Üa-zà-ü][a-zà-ü\-]+(?:[\s-][A-ZÀ-Üa-zà-ü][a-zà-ü\-]+)*)/);
  return m ? m[1] : '';
}

function mapItem(raw, cb) {
  const city = raw.city || raw.location?.city || extractCity(raw.address||'') || '';
  return {
    name:          raw.title || raw.name || '',
    category:      raw.categoryName || (Array.isArray(raw.categories) ? raw.categories[0] : '') || '',
    address:       raw.address || '',
    city,
    phone:         raw.phone || raw.phoneNumber || '',
    website:       raw.website || '',
    rating:        parseFloat(raw.totalScore) || 0,
    reviewCount:   parseInt(raw.reviewsCount) || 0,
    googleMapsUrl: raw.url || raw.googleMapsUrl || '',
    cb,
  };
}

async function fetchDataset(dsId, cb, label) {
  try {
    const r = await fetch(
      `https://api.apify.com/v2/datasets/${dsId}/items?token=${TOKEN}&format=json&limit=200`
    );
    const items = await r.json();
    if (!Array.isArray(items)) { console.log(`  ${label}: non-array response`); return []; }
    const valid = items.map(i => mapItem(i, cb)).filter(b => b.name && validCity(b.city, b.address));
    console.log(`  ${label}: ${items.length} raw → ${valid.length} valid`);
    return valid;
  } catch(e) {
    console.error(`  ${label}: ERROR ${e.message}`);
    return [];
  }
}

function csvField(v) {
  const s = String(v ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

// ── MAIN ──────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════');
console.log('  STAMPIFY PROSPECTS — CSV BUILDER');
console.log('═══════════════════════════════════════════\n');

let totalRaw = 0;
const allBiz = [];

// Fetch all datasets (parallel batches of 5)
for (let i = 0; i < DATASETS.length; i += 5) {
  const batch = DATASETS.slice(i, i + 5);
  const results = await Promise.all(
    batch.map(d => fetchDataset(d.id, d.cb, d.label))
  );
  for (const items of results) {
    totalRaw += items.length;
    allBiz.push(...items);
  }
}

// Deduplication
const seen = new Map();
let dupes = 0;
for (const b of allBiz) {
  const key = (b.name.toLowerCase().trim() + '|' + b.address.toLowerCase().trim());
  if (!seen.has(key)) {
    seen.set(key, { ...b, score: calcScore(b, b.cb) });
  } else {
    dupes++;
    // Keep higher cb
    const existing = seen.get(key);
    if (b.cb > existing.cb) {
      seen.set(key, { ...b, score: calcScore(b, b.cb) });
    }
  }
}

const deduped  = [...seen.values()];
const filtered = deduped.filter(b => b.score >= 5).sort((a, b) => b.score - a.score);

console.log(`\n═══ SUMMARY ═══`);
console.log(`  Datasets processed:   ${DATASETS.length}`);
console.log(`  Total valid items:    ${totalRaw}`);
console.log(`  Duplicates removed:   ${dupes}`);
console.log(`  After dedup:          ${deduped.length}`);
console.log(`  Score >= 5 (final):   ${filtered.length}`);

console.log(`\n═══ TOP 10 PROSPECTS ═══`);
filtered.slice(0, 10).forEach((b, i) => {
  const ws = b.website ? b.website.substring(0, 35) : 'Aucun site';
  console.log(`${String(i+1).padStart(2)}. [${b.score}] ${b.name} — ${b.city}`);
  console.log(`    ${b.category} | ${ws}`);
});

// Build CSV
const header = 'Score,Category,Name,City,Phone,Website,Rating,Reviews,Address,GoogleMapsURL';
const rows = filtered.map(b => [
  b.score,
  csvField(b.category),
  csvField(b.name),
  csvField(b.city),
  csvField(b.phone),
  csvField(b.website || 'Aucun site'),
  b.rating   || '',
  b.reviewCount || '',
  csvField(b.address),
  csvField(b.googleMapsUrl),
].join(','));

const csv = header + '\n' + rows.join('\n');

// Write with BOM (UTF-8) for Excel
writeFileSync(OUT, '\uFEFF' + csv, 'utf8');
console.log(`\n✓ CSV saved: ${OUT}`);
console.log(`  Rows: ${rows.length}\n`);

// Print full CSV
console.log('═══ CSV START ═══');
console.log(csv);
console.log('═══ CSV END ═══');
