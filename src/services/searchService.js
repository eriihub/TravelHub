/**
 * searchService.js
 * Orchestrator: calls Booking.com API → falls back to mock data transparently
 * Returns { data, total, source, error }
 */

import { searchFlights, searchHotels, searchAttractions } from './bookingApi.js'
import { flights, hotels, experiences } from '../data/mockData.js'

// ── Mock data filter helpers ───────────────────────────────────────────────
function filterFlightsMock({ origin, destination, maxPrice }) {
  return flights.filter(f => {
    if (origin && !f.from.toLowerCase().includes(origin.toLowerCase())) return false
    if (destination && !f.to.toLowerCase().includes(destination.toLowerCase())) return false
    if (maxPrice && f.price > maxPrice) return false
    return true
  })
}

function filterHotelsMock({ city, stars, maxPrice }) {
  const cityName = city?.toLowerCase() || ''
  return hotels
    .filter(h => {
      if (cityName && !h.city.toLowerCase().includes(cityName)) return false
      if (stars && h.stars < stars) return false
      if (maxPrice && h.pricePerNight > maxPrice) return false
      return true
    })
    .map(h => ({ ...h, price: h.pricePerNight }))
}

function filterExperiencesMock({ city, category, maxPrice }) {
  const cityName = city?.toLowerCase() || ''
  return experiences.filter(e => {
    if (cityName && !e.city.toLowerCase().includes(cityName)) return false
    if (category && e.category !== category) return false
    if (maxPrice && e.price > maxPrice) return false
    return true
  })
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function searchFlightsService(params) {
  try {
    const res = await searchFlights(params)
    // API returns { items, total }
    if (!res.items.length) {
      const mock = filterFlightsMock(params)
      return { data: mock, total: mock.length, source: 'mock', error: null }
    }
    return { data: res.items, total: res.total, source: 'api', error: null }
  } catch (e) {
    console.warn('[searchFlightsService] fallback:', e.message)
    const mock = filterFlightsMock(params)
    return { data: mock, total: mock.length, source: 'mock', error: null }
  }
}

export async function searchHotelsService(params) {
  try {
    const res = await searchHotels(params)
    if (!res.items.length) {
      const mock = filterHotelsMock(params)
      return { data: mock, total: mock.length, source: 'mock', error: null }
    }
    return { data: res.items, total: res.total, source: 'api', error: null }
  } catch (e) {
    console.warn('[searchHotelsService] fallback:', e.message)
    const mock = filterHotelsMock(params)
    return { data: mock, total: mock.length, source: 'mock', error: null }
  }
}

export async function searchExperiencesService(params) {
  try {
    const res = await searchAttractions(params)
    if (!res.items.length) {
      const mock = filterExperiencesMock(params)
      return { data: mock, total: mock.length, source: 'mock', error: null }
    }
    return { data: res.items, total: res.total, source: 'api', error: null }
  } catch (e) {
    console.warn('[searchExperiencesService] fallback:', e.message)
    const mock = filterExperiencesMock(params)
    return { data: mock, total: mock.length, source: 'mock', error: null }
  }
}

export async function search(tab, params) {
  if (tab === 'flights')     return searchFlightsService(params)
  if (tab === 'hotels')      return searchHotelsService(params)
  if (tab === 'experiences') return searchExperiencesService(params)
  return { data: [], total: 0, source: 'mock', error: null }
}
