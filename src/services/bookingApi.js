/**
 * Booking.com API via RapidAPI — booking-com15.p.rapidapi.com
 * Centralizes Flights (search destination), Hotels, and Attractions.
 */

const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}/api/v1`;

function getHeaders() {
  const key = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!key || key.length < 10) {
    throw new Error('RAPIDAPI_NOT_CONFIGURED');
  }
  return {
    'x-rapidapi-key': key,
    'x-rapidapi-host': RAPIDAPI_HOST,
    'Content-Type': 'application/json',
  };
}

export function dateInDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ── City meta cache (dest_id from searchDestination + airport codes) ────────
const CITY_CACHE = {
  'Madrid':     { dest_id: '-390625', dest_type: 'city', iata: 'MAD' },
  'París':      { dest_id: '-1456928', dest_type: 'city', iata: 'PAR' },
  'Paris':      { dest_id: '-1456928', dest_type: 'city', iata: 'PAR' },
  'Londres':    { dest_id: '-2601889', dest_type: 'city', iata: 'LON' },
  'Roma':       { dest_id: '-126693', dest_type: 'city', iata: 'ROM' },
  'Dubai':      { dest_id: '-782831', dest_type: 'city', iata: 'DXB' },
  'Tokio':      { dest_id: '-246227', dest_type: 'city', iata: 'TYO' },
  'Nueva York': { dest_id: '20088325', dest_type: 'city', iata: 'NYC' },
  'Barcelona':  { dest_id: '-372490', dest_type: 'city', iata: 'BCN' },
  'Sevilla':    { dest_id: '-402849', dest_type: 'city', iata: 'SVQ' },
  'Valencia':   { dest_id: '-406312', dest_type: 'city', iata: 'VLC' },
};

function cleanCity(name) {
  if (!name) return '';
  return name.split('(')[0].trim();
}

// Resolve a city name to its dest_id (uses cache or live API call)
async function resolveDest(cityName, headers) {
  const cached = CITY_CACHE[cityName];
  if (cached) return cached;

  const res = await fetch(
    `${BASE_URL}/hotels/searchDestination?query=${encodeURIComponent(cityName)}`,
    { headers }
  );
  if (!res.ok) throw new Error('BOOKING_DESTINATION_FAILED');
  const json = await res.json();
  if (!json.status || !json.data?.length) throw new Error('CITY_NOT_FOUND');

  const first = json.data[0];
  return { dest_id: first.dest_id, dest_type: first.dest_type, iata: null };
}

// ── 1. SEARCH FLIGHT DESTINATION (autocomplete — e.g. "new" → airports) ────
export async function searchFlightDestinations(query) {
  const headers = getHeaders();
  const res = await fetch(
    `${BASE_URL}/flights/searchDestination?query=${encodeURIComponent(query)}`,
    { headers }
  );
  if (!res.ok) throw new Error('BOOKING_FLIGHT_DEST_FAILED');
  const json = await res.json();
  return json.data || [];
}

// ── 2. SEARCH FLIGHTS ──────────────────────────────────────────────────────
export async function searchFlights({ origin, destination, maxPrice }) {
  const headers = getHeaders();
  const cOrigin = cleanCity(origin) || 'Madrid';
  const cDest = cleanCity(destination) || 'París';

  const originMeta = CITY_CACHE[cOrigin];
  const destMeta   = CITY_CACHE[cDest];

  // Build IATA airport IDs — the API accepts "MAD.AIRPORT" format
  const fromId = originMeta?.iata ? `${originMeta.iata}.AIRPORT` : `${cOrigin.substring(0, 3).toUpperCase()}.AIRPORT`;
  const toId   = destMeta?.iata   ? `${destMeta.iata}.AIRPORT`   : `${cDest.substring(0, 3).toUpperCase()}.AIRPORT`;

  const params = new URLSearchParams({
    fromId,
    toId,
    departDate: dateInDays(14),
    adults: '1',
    currency_code: 'EUR',
    cabinClass: 'ECONOMY',
  });

  const res = await fetch(`${BASE_URL}/flights/searchFlights?${params}`, { headers });
  if (!res.ok) throw new Error('BOOKING_FLIGHTS_FAILED');
  const json = await res.json();

  if (!json.status || !json.data?.flightOffers?.length) return { items: [], total: 0 };

  const allOffers = json.data.flightOffers;
  const total = json.data.meta?.totalCount || allOffers.length;

  const items = allOffers
    .filter(f => !maxPrice || (f.priceBreakdown?.total?.units || 9999) <= maxPrice)
    .slice(0, 10)
    .map((f, idx) => {
      const seg   = f.segments?.[0];
      const leg   = seg?.legs?.[0];
      const price = Math.round(f.priceBreakdown?.total?.units || 200);
      const dur   = seg ? `${Math.floor(seg.totalTime / 3600)}h ${Math.floor((seg.totalTime % 3600) / 60)}m` : '—';
      return {
        id: `bkg-f-${idx}-${f.token?.slice(0, 8) || Math.random().toString(36).slice(2)}`,
        type: 'flight',
        from: cOrigin,
        to: cDest,
        airline: leg?.carriersData?.[0]?.name || seg?.marketingCarrier?.name || 'Aerolínea',
        logo: '✈',
        departure: leg?.departureTime?.slice(11, 16) || '--:--',
        arrival:   leg?.arrivalTime?.slice(11, 16)   || '--:--',
        duration: dur,
        stops: (seg?.legs?.length || 1) - 1 === 0 ? 'Directo' : `${(seg?.legs?.length || 1) - 1} escala(s)`,
        price,
        originalPrice: Math.round(price * 1.2),
        class: 'Economy',
        rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
        tags: (seg?.legs?.length || 1) === 1 ? ['Directo'] : [],
        color: 'rgba(255,255,255,0.75)',
      };
    });

  return { items, total };
}

// ── 3. SEARCH HOTELS ───────────────────────────────────────────────────────
export async function searchHotels({ city, stars, maxPrice, _meta }) {
  const headers   = getHeaders();
  const cityName  = cleanCity(city) || 'Madrid';

  // Use pre-resolved dest from autocomplete if available (avoids wrong re-lookup)
  let dest;
  if (_meta?.hotelCity?.dest_id) {
    dest = { dest_id: _meta.hotelCity.dest_id, dest_type: _meta.hotelCity.dest_type || 'city' };
  } else {
    dest = await resolveDest(cityName, headers);
  }

  const params = new URLSearchParams({
    dest_id:        dest.dest_id,
    search_type:    dest.dest_type,
    arrival_date:   dateInDays(14),
    departure_date: dateInDays(17),
    adults:         '1',
    currency_code:  'EUR',
    room_qty:       '1',
  });

  const res = await fetch(`${BASE_URL}/hotels/searchHotels?${params}`, { headers });
  if (!res.ok) throw new Error('BOOKING_HOTELS_FAILED');
  const json = await res.json();
  if (!json.status || !json.data?.hotels?.length) return { items: [], total: 0 };

  const total = json.data.meta?.totalCount
    || json.data.meta?.total
    || json.data.hotels.length;

  const items = json.data.hotels
    .filter(h => {
      const p = h.property?.priceBreakdown?.grossPrice?.value || 0;
      if (maxPrice && p > maxPrice) return false;
      const s = Math.round((h.property?.reviewScore || 6) / 2);
      if (stars && s < stars) return false;
      return true;
    })
    .slice(0, 12)
    .map(h => {
      const p   = Math.round(h.property?.priceBreakdown?.grossPrice?.value || 120);
      const s   = Math.round((h.property?.reviewScore || 7) / 2);
      const img = h.property?.photoUrls?.[0] || null;
      return {
        id:            `bkg-h-${h.property.id}`,
        type:          'hotel',
        name:          h.property.name,
        city:          cleanCity,
        country:       'España',
        stars:         s,
        rating:        parseFloat((h.property.reviewScore || 8.0).toFixed(1)),
        reviews:       h.property.reviewCount || Math.floor(Math.random() * 2000 + 100),
        pricePerNight: p,
        price:         p,
        originalPrice: Math.round(p * 1.3),
        amenities:     ['WiFi', 'AC', 'Desayuno'],
        description:   `${h.property.name} en ${cleanCity}.`,
        image:         img,
        tags:          s >= 5 ? ['5★ Lujo'] : s >= 4 ? ['4★ Confort'] : ['3★ Económico'],
        color:         'rgba(255,255,255,0.75)',
        nights:        3,
      };
    });
  return { items, total };
}

// ── 4. SEARCH ATTRACTIONS (Experiencias) ──────────────────────────────────
export async function searchAttractions({ city, category, maxPrice }) {
  const headers   = getHeaders();
  const cleanCity = cleanCity_fn(city) || 'Madrid';
  const dest      = await resolveDest(cleanCity, headers);

  // Booking uses dest_id for attractions too
  const params = new URLSearchParams({
    dest_id:       dest.dest_id,
    currency_code: 'EUR',
  });

  const res = await fetch(`${BASE_URL}/attraction/searchAttractions?${params}`, { headers });
  if (!res.ok) throw new Error('BOOKING_ATTRACTIONS_FAILED');
  const json = await res.json();

  // The attractions endpoint may use data.products or data.attractions
  const rawItems = json.data?.products || json.data?.attractions || [];
  if (!rawItems.length) return { items: [], total: 0 };

  const total = json.data?.meta?.totalCount || rawItems.length;

  const items = rawItems
    .filter(a => !maxPrice || (a.representativePrice?.chargeAmount || 999) <= maxPrice)
    .slice(0, 12)
    .map(a => {
      const price = Math.round(a.representativePrice?.chargeAmount || a.price?.amount || 40);
      const img   = a.primaryPhoto?.small || a.photos?.[0]?.small || null;
      return {
        id:            `bkg-a-${a.id}`,
        type:          'experience',
        name:          a.name,
        city:          cleanCity,
        category:      category || _guessCategory(a.name),
        duration:      a.duration || '2h',
        groupSize:     'Grupos disponibles',
        price,
        originalPrice: Math.round(price * 1.2),
        rating:        parseFloat((a.reviewsStats?.allReviewsRating || 4.5).toFixed(1)),
        reviews:       a.reviewsStats?.allReviewsCount || Math.floor(Math.random() * 500 + 50),
        description:   a.shortDescription || `Actividad turística en ${cleanCity}`,
        image:         img,
        tags:          [category || 'Atracción'],
        emoji:         _categoryEmoji(category),
        color:         'rgba(180,180,180,0.75)',
      };
    });
  return { items, total };
}

// ── Helpers (private) ──────────────────────────────────────────────────────
function cleanCity_fn(name) {
  return cleanCity(name);
}

function _guessCategory(name = '') {
  const n = name.toLowerCase();
  if (/museum|museum|art|gallery/i.test(n)) return 'Cultura';
  if (/restaurant|food|tapas|gastro/i.test(n)) return 'Gastronomía';
  if (/hike|climb|surf|extreme/i.test(n)) return 'Aventura';
  if (/spa|yoga|wellness|relax/i.test(n)) return 'Bienestar';
  return 'Cultura';
}

function _categoryEmoji(cat) {
  const m = { 'Gastronomía': '♨', 'Cultura': '♕', 'Aventura': '⛰', 'Bienestar': '☯' };
  return m[cat] || '⭐';
}
