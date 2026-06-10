/**
 * Amadeus Self-Service API client
 * Docs: https://developers.amadeus.com/self-service
 * Sandbox endpoint: https://test.api.amadeus.com
 */

const BASE_URL = 'https://test.api.amadeus.com'

// ── Token cache ────────────────────────────────────────────────────────────
let _token = null
let _tokenExpiry = 0

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token

  const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID
  const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET

  if (!clientId || clientId === 'your-amadeus-client-id') {
    throw new Error('AMADEUS_NOT_CONFIGURED')
  }

  const res = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error_description || 'AMADEUS_AUTH_FAILED')
  }

  const data = await res.json()
  _token = data.access_token
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return _token
}

// ── IATA code map ──────────────────────────────────────────────────────────
const CITY_TO_IATA = {
  'Madrid': 'MAD', 'Madrid (MAD)': 'MAD',
  'Barcelona': 'BCN', 'Barcelona (BCN)': 'BCN',
  'Sevilla': 'SVQ', 'Sevilla (SVQ)': 'SVQ',
  'Valencia': 'VLC', 'Valencia (VLC)': 'VLC',
  'París': 'CDG', 'Paris': 'CDG', 'París (CDG)': 'CDG',
  'Londres': 'LHR', 'London': 'LHR', 'Londres (LHR)': 'LHR',
  'Roma': 'FCO', 'Rome': 'FCO', 'Roma (FCO)': 'FCO',
  'Dubai': 'DXB', 'Dubai (DXB)': 'DXB',
  'Tokio': 'NRT', 'Tokyo': 'NRT', 'Tokio (NRT)': 'NRT',
  'Nueva York': 'JFK', 'New York': 'JFK', 'Nueva York (JFK)': 'JFK',
  'Ámsterdam': 'AMS', 'Amsterdam': 'AMS',
  'Lisboa': 'LIS', 'Lisbon': 'LIS',
  'Berlín': 'BER', 'Berlin': 'BER',
  'Múnich': 'MUC', 'Munich': 'MUC',
}

const IATA_TO_CITY = Object.fromEntries(
  Object.entries(CITY_TO_IATA)
    .filter(([city]) => !city.includes('('))
    .map(([city, iata]) => [iata, city])
)

export function toIATA(value) {
  if (!value) return null
  return CITY_TO_IATA[value] || (value.length === 3 ? value.toUpperCase() : null)
}

function getCityName(iata) {
  return IATA_TO_CITY[iata] || iata
}

// ── Helpers ────────────────────────────────────────────────────────────────
function parseDuration(iso) {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return '--'
  return [(m[1] ? `${m[1]}h` : ''), (m[2] ? `${m[2]}m` : '')].filter(Boolean).join(' ')
}

export function dateInDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

// ── Flight search ──────────────────────────────────────────────────────────
export async function searchFlights({ origin, destination, departureDate, adults = 1, maxPrice }) {
  const token = await getToken()

  const originCode = toIATA(origin) || 'MAD'
  const destCode = toIATA(destination) || 'CDG'
  const date = departureDate || dateInDays(14)

  const params = new URLSearchParams({
    originLocationCode: originCode,
    destinationLocationCode: destCode,
    departureDate: date,
    adults: String(adults),
    max: '12',
    currencyCode: 'EUR',
  })
  if (maxPrice) params.append('maxPrice', String(maxPrice))

  const res = await fetch(`${BASE_URL}/v2/shopping/flight-offers?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('FLIGHTS_SEARCH_FAILED')

  const { data, dictionaries } = await res.json()
  return (data || []).map(o => _normalizeFlight(o, dictionaries))
}

function _normalizeFlight(offer, dicts) {
  const itin = offer.itineraries[0]
  const first = itin.segments[0]
  const last = itin.segments[itin.segments.length - 1]
  const stops = itin.segments.length - 1
  const airlineCode = offer.validatingAirlineCodes?.[0] || first.carrierCode
  const airlineName = dicts?.carriers?.[airlineCode] || airlineCode
  const price = Math.round(parseFloat(offer.price.total))
  const cabin = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY'
  const cabinLabel = cabin.charAt(0) + cabin.slice(1).toLowerCase()

  const tags = []
  if (stops === 0) tags.push('Directo')
  if (price < 120) tags.push('Mejor precio')
  if (cabin === 'BUSINESS') tags.push('Premium')

  return {
    id: `amd-f-${offer.id}`,
    type: 'flight',
    from: `${getCityName(first.departure.iataCode)} (${first.departure.iataCode})`,
    to: `${getCityName(last.arrival.iataCode)} (${last.arrival.iataCode})`,
    airline: airlineName,
    logo: '✈',
    departure: first.departure.at?.split('T')[1]?.slice(0, 5) || '--:--',
    arrival: last.arrival.at?.split('T')[1]?.slice(0, 5) || '--:--',
    duration: parseDuration(itin.duration),
    stops: stops === 0 ? 'Directo' : `${stops} escala${stops > 1 ? 's' : ''}`,
    price,
    originalPrice: Math.round(price * 1.22),
    class: cabinLabel,
    rating: parseFloat((4.0 + Math.random() * 0.95).toFixed(1)),
    tags,
    color: 'rgba(255,255,255,0.75)',
  }
}

// ── Hotel search ───────────────────────────────────────────────────────────
export async function searchHotels({ city, checkIn, checkOut, adults = 1, stars, maxPrice }) {
  const token = await getToken()
  const cityCode = toIATA(city)
  if (!cityCode) throw new Error('INVALID_CITY')

  // 1. Get hotel list for city
  const listRes = await fetch(
    `${BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&hotelSource=ALL`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!listRes.ok) throw new Error('HOTELS_LIST_FAILED')
  const listData = await listRes.json()
  const hotelIds = (listData.data || []).slice(0, 25).map(h => h.hotelId).join(',')
  if (!hotelIds) return []

  // 2. Get offers
  const params = new URLSearchParams({
    hotelIds,
    checkInDate: checkIn || dateInDays(14),
    checkOutDate: checkOut || dateInDays(17),
    adults: String(adults),
    currencyCode: 'EUR',
    bestRateOnly: 'true',
  })

  const offersRes = await fetch(`${BASE_URL}/v3/shopping/hotel-offers?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!offersRes.ok) throw new Error('HOTELS_OFFERS_FAILED')

  const { data } = await offersRes.json()

  return (data || [])
    .filter(h => {
      const hotelStars = parseInt(h.hotel?.rating) || 3
      if (stars && hotelStars < stars) return false
      const price = parseFloat(h.offers?.[0]?.price?.total || h.offers?.[0]?.price?.base || 0)
      if (maxPrice && price > maxPrice) return false
      return true
    })
    .slice(0, 12)
    .map(h => _normalizeHotel(h, getCityName(cityCode)))
}

function _normalizeHotel(h, cityName) {
  const hotel = h.hotel
  const offer = h.offers?.[0]
  const price = Math.round(parseFloat(offer?.price?.total || offer?.price?.base || 180))
  const stars = parseInt(hotel.rating) || 3

  const tags = []
  if (stars >= 5) tags.push('Lujo')
  else if (stars >= 4) tags.push('Premium')
  else tags.push('Confort')

  return {
    id: `amd-h-${hotel.hotelId}`,
    type: 'hotel',
    name: hotel.name,
    city: cityName || hotel.address?.cityName || hotel.cityCode,
    country: hotel.address?.countryCode || '',
    stars,
    rating: parseFloat((4.0 + Math.random() * 0.95).toFixed(1)),
    reviews: Math.floor(Math.random() * 4000) + 300,
    pricePerNight: price,
    price,
    originalPrice: Math.round(price * 1.2),
    amenities: ['WiFi', 'Restaurant', 'Reception 24h'],
    description: `${hotel.name} — ${cityName}`,
    tags,
    color: 'rgba(255,255,255,0.75)',
    nights: 3,
  }
}
