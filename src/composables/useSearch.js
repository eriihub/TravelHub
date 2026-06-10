import { ref } from 'vue'
import { search } from '../services/searchService.js'
import { flights, hotels, experiences } from '../data/mockData.js'

export function useSearch() {
  const results    = ref([])
  const total      = ref(0)      // ← total real from API (or mock count)
  const loading    = ref(false)
  const error      = ref(null)
  const dataSource = ref('mock')
  const activeTab  = ref('flights')

  // Load default data instantly (no API call)
  function loadDefault(tab = 'flights') {
    activeTab.value = tab
    error.value     = null
    if (tab === 'flights')      { results.value = flights;                                       total.value = flights.length }
    else if (tab === 'hotels')  { results.value = hotels.map(h => ({ ...h, price: h.pricePerNight })); total.value = hotels.length }
    else if (tab === 'experiences') { results.value = experiences;                               total.value = experiences.length }
    else                        { results.value = []; total.value = 0 }
    dataSource.value = 'mock'
  }

  async function doSearch(tab, params) {
    activeTab.value  = tab
    loading.value    = true
    error.value      = null
    results.value    = []
    total.value      = 0

    try {
      const res        = await search(tab, params)
      results.value    = res.data
      total.value      = res.total
      dataSource.value = res.source
    } catch (e) {
      error.value = 'Error inesperado. Mostrando datos de ejemplo.'
      loadDefault(tab)
    } finally {
      loading.value = false
    }
  }

  return {
    results,
    total,
    loading,
    error,
    dataSource,
    activeTab,
    loadDefault,
    doSearch,
  }
}
