/**
 * OpenTripMap API — Experiences / POIs
 * Docs: https://dev.opentripmap.com/docs
 * Free tier: 5 000 requests/day
 */

const BASE = 'https://api.opentripmap.com/0.1/en/places'

function getKey() {
  const key = import.meta.env.VITE_OPENTRIPMAP_KEY
  if (!key || key === 'your-opentripmap-key') throw new Error('OTM_NOT_CONFIGURED')
  return key
}

// ── Category mapping ───────────────────────────────────────────────────────
const CATEGORY_MAP = {
  '': 'interesting_places',
  'Gastronomía': 'foods',
  'Cultura': 'cultural,historic',
  'Aventura': 'sport,natural',
  'Bienestar': 'spa,religion',
}

// ── City coordinates cache ─────────────────────────────────────────────────
const CITY_COORDS = {
  'París': { lat: 48.8566, lon: 2.3522 },
  'Paris': { lat: 48.8566, lon: 2.3522 },
  'Londres': { lat: 51.5074, lon: -0.1278 },
  'London': { lat: 51.5074, lon: -0.1278 },
  'Roma': { lat: 41.9028, lon: 12.4964 },
  'Rome': { lat: 41.9028, lon: 12.4964 },
  'Dubai': { lat: 25.2048, lon: 55.2708 },
  'Tokio': { lat: 35.6762, lon: 139.6503 },
  'Tokyo': { lat: 35.6762, lon: 139.6503 },
  'Nueva York': { lat: 40.7128, lon: -74.0060 },
  'New York': { lat: 40.7128, lon: -74.0060 },
  'Madrid': { lat: 40.4168, lon: -3.7038 },
  'Barcelona': { lat: 41.3851, lon: 2.1734 },
}

// ── Emoji mapping by kind ──────────────────────────────────────────────────
function kindToEmoji(kinds) {
  if (!kinds) return '⭐'
  if (kinds.includes('food') || kinds.includes('restaurant')) return '♨'
  if (kinds.includes('museum') || kinds.includes('cultural')) return '♕'
  if (kinds.includes('sport') || kinds.includes('natural')) return '⛰'
  if (kinds.includes('religion') || kinds.includes('spa')) return '☯'
  if (kinds.includes('amusement') || kinds.includes('theatre')) return '☼'
  return '⭐'
}

// ── Main search ────────────────────────────────────────────────────────────
export async function searchExperiences({ city, category, maxPrice }) {
  const key = getKey()

  // Resolve coordinates
  let coords = CITY_COORDS[city]
  if (!coords && city) {
    const geoRes = await fetch(`${BASE}/geoname?name=${encodeURIComponent(city)}&apikey=${key}`)
    if (geoRes.ok) {
      const geoData = await geoRes.json()
      if (geoData.lat) coords = { lat: geoData.lat, lon: geoData.lon }
    }
  }
  if (!coords) throw new Error('CITY_NOT_FOUND')

  const kinds = CATEGORY_MAP[category] || 'interesting_places'

  // Search POIs
  const params = new URLSearchParams({
    radius: '8000',
    lon: String(coords.lon),
    lat: String(coords.lat),
    kinds,
    rate: '3',       // min OTM rating (1-3)
    format: 'json',
    limit: '20',
    apikey: key,
  })

  const searchRes = await fetch(`${BASE}/radius?${params}`)
  if (!searchRes.ok) throw new Error('OTM_SEARCH_FAILED')
  const places = await searchRes.json()

  // Fetch details in parallel (limit to 12)
  const top = (places || []).slice(0, 12)
  const details = await Promise.allSettled(
    top.map(p => fetch(`${BASE}/xid/${p.xid}?apikey=${key}`).then(r => r.json()))
  )

  const results = details
    .filter(d => d.status === 'fulfilled' && d.value?.xid)
    .map(d => _normalizeExperience(d.value, city))
    .filter(e => !maxPrice || e.price <= maxPrice)

  return results
}

function _normalizeExperience(place, city) {
  // OTM doesn't have prices — generate realistic based on rate
  const rate = place.rate || 3
  const basePrice = rate === 3 ? 80 : rate === 2 ? 50 : 30
  const price = basePrice + Math.floor(Math.random() * 80)

  const category = _resolveCategory(place.kinds)

  return {
    id: `otm-${place.xid}`,
    type: 'experience',
    name: place.name || 'Experiencia local',
    city: place.address?.city || place.address?.town || city || '',
    category,
    duration: `${1 + Math.floor(Math.random() * 4)}h`,
    groupSize: `Máx. ${4 + Math.floor(Math.random() * 12)} personas`,
    price,
    originalPrice: Math.round(price * 1.2),
    rating: parseFloat((4.0 + Math.random() * 0.99).toFixed(1)),
    reviews: Math.floor(Math.random() * 3000) + 200,
    description: place.wikipedia_extracts?.text?.slice(0, 150)
      || place.address?.road
      || `Visita ${place.name} en ${city}.`,
    tags: _tagsFromKinds(place.kinds),
    emoji: kindToEmoji(place.kinds),
    color: 'rgba(180,180,180,0.75)',
    image: place.preview?.source || null,
  }
}

function _resolveCategory(kinds) {
  if (!kinds) return 'Cultura'
  if (kinds.includes('food') || kinds.includes('restaurant')) return 'Gastronomía'
  if (kinds.includes('sport') || kinds.includes('natural')) return 'Aventura'
  if (kinds.includes('spa') || kinds.includes('religion') || kinds.includes('wellness')) return 'Bienestar'
  return 'Cultura'
}

function _tagsFromKinds(kinds) {
  if (!kinds) return []
  const tags = []
  if (kinds.includes('museum')) tags.push('Museo')
  if (kinds.includes('historic')) tags.push('Historia')
  if (kinds.includes('natural')) tags.push('Naturaleza')
  if (kinds.includes('food')) tags.push('Foodie')
  if (kinds.includes('sport')) tags.push('Aventura')
  return tags.slice(0, 3)
}
