import { ref } from 'vue'
import { search } from '../services/searchService.js'
import { flights, hotels, experiences } from '../data/mockData.js'

export function useSearch() {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)
  const dataSource = ref('mock')   // 'api' | 'mock'
  const activeTab = ref('flights')

  // Load default data on init
  function loadDefault(tab = 'flights') {
    activeTab.value = tab
    error.value = null
    if (tab === 'flights') results.value = flights
    else if (tab === 'hotels') results.value = hotels.map(h => ({ ...h, price: h.pricePerNight }))
    else if (tab === 'experiences') results.value = experiences
    else results.value = []
    dataSource.value = 'mock'
  }

  async function doSearch(tab, params) {
    activeTab.value = tab
    loading.value = true
    error.value = null
    results.value = []

    try {
      const res = await search(tab, params)
      results.value = res.data
      dataSource.value = res.source
      if (res.error) {
        error.value = `Error de API: ${res.error}. Mostrando datos de ejemplo.`
      }
    } catch (e) {
      error.value = 'Error inesperado. Mostrando datos de ejemplo.'
      loadDefault(tab)
    } finally {
      loading.value = false
    }
  }

  return {
    results,
    loading,
    error,
    dataSource,
    activeTab,
    loadDefault,
    doSearch,
  }
}
