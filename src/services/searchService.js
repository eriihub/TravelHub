/**
 * searchService.js
 * Orchestrator: calls real APIs → falls back to mock data transparently
 */

import { searchFlights, searchHotels } from './amadeus.js'
import { searchExperiences } from './experiences.js'
import { flights, hotels, experiences } from '../data/mockData.js'

// ── Mock data filter helpers ───────────────────────────────────────────────
function filterFlightsMock({ origin, destination, maxPrice }) {
  return flights.filter(f => {
    if (origin && !f.from.toLowerCase().includes(origin.split('(')[0].trim().toLowerCase())) return false
    if (destination && !f.to.toLowerCase().includes(destination.split('(')[0].trim().toLowerCase())) return false
    if (maxPrice && f.price > maxPrice) return false
    return true
  })
}

function filterHotelsMock({ city, stars, maxPrice }) {
  return hotels
    .filter(h => {
      if (city && !h.city.toLowerCase().includes(city.toLowerCase())) return false
      if (stars && h.stars < stars) return false
      if (maxPrice && h.pricePerNight > maxPrice) return false
      return true
    })
    .map(h => ({ ...h, price: h.pricePerNight }))
}

function filterExperiencesMock({ city, category, maxPrice }) {
  return experiences.filter(e => {
    if (city && !e.city.toLowerCase().includes(city.toLowerCase())) return false
    if (category && e.category !== category) return false
    if (maxPrice && e.price > maxPrice) return false
    return true
  })
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Search flights.
 * Returns { data, source: 'api'|'mock', error: null|string }
 */
export async function searchFlightsService(params) {
  try {
    const data = await searchFlights(params)
    // API returned empty → fall back to filtered mock
    if (!data.length) {
      return { data: filterFlightsMock(params), source: 'mock', error: null }
    }
    return { data, source: 'api', error: null }
  } catch (e) {
    const isMissingKey = e.message === 'AMADEUS_NOT_CONFIGURED'
    return {
      data: filterFlightsMock(params),
      source: 'mock',
      error: isMissingKey ? null : e.message,
    }
  }
}

/**
 * Search hotels.
 * Returns { data, source: 'api'|'mock', error: null|string }
 */
export async function searchHotelsService(params) {
  try {
    const data = await searchHotels(params)
    if (!data.length) {
      return { data: filterHotelsMock(params), source: 'mock', error: null }
    }
    return { data, source: 'api', error: null }
  } catch (e) {
    const isMissingKey = e.message === 'AMADEUS_NOT_CONFIGURED'
    return {
      data: filterHotelsMock(params),
      source: 'mock',
      error: isMissingKey ? null : e.message,
    }
  }
}

/**
 * Search experiences.
 * Returns { data, source: 'api'|'mock', error: null|string }
 */
export async function searchExperiencesService(params) {
  try {
    const data = await searchExperiences(params)
    if (!data.length) {
      return { data: filterExperiencesMock(params), source: 'mock', error: null }
    }
    return { data, source: 'api', error: null }
  } catch (e) {
    const isMissingKey = e.message === 'OTM_NOT_CONFIGURED'
    return {
      data: filterExperiencesMock(params),
      source: 'mock',
      error: isMissingKey ? null : e.message,
    }
  }
}

/**
 * All-in-one search dispatcher based on tab
 */
export async function search(tab, params) {
  if (tab === 'flights') return searchFlightsService(params)
  if (tab === 'hotels') return searchHotelsService(params)
  if (tab === 'experiences') return searchExperiencesService(params)
  return { data: [], source: 'mock', error: null }
}
