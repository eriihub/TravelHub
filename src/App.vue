<template>
  <div class="app-root">
    <!-- Navbar -->
    <NavBar :kit-count="kitItems.length" :fav-count="favItems.length" :compare-count="compareItems.length"
      @open-kit="kitOpen = true" @open-favs="toggleFavsView" @open-compare="compareOpen = true"
      @open-auth="authOpen = true" />

    <!-- Hero / Search -->
    <HeroSearch id="search" v-if="!showFavsOnly" @tab-change="handleTabChange" @search="handleSearch"
      @open-kit="kitOpen = true" />

    <!-- Favorites Header -->
    <section v-if="showFavsOnly" class="favs-header-section">
      <div class="favs-header-inner">
        <h1 class="favs-title">Mis Favoritos</h1>
        <p class="favs-sub">Tienes {{ favItems.length }} elemento(s) guardado(s).</p>
        <button class="btn btn-outline" @click="showFavsOnly = false" style="margin-top: 16px;">
          ← Volver a buscar
        </button>
      </div>
    </section>

    <!-- Results section -->
    <section class="results-section" id="results" v-if="showResults || showFavsOnly">
      <div class="results-inner">
        <!-- Sort bar -->
        <div class="results-header">
          <div class="results-info">
            <h2 class="results-title">
              <span class="text-gradient-white">{{ currentResultCount }}</span>
              {{ showFavsOnly ? 'favoritos' : 'resultados para' }}
              <em v-if="!showFavsOnly">{{ tabLabel }}</em>
            </h2>
            <p class="results-sub"
              v-if="!showFavsOnly && (searchParams?.destination || searchParams?.hotelCity || searchParams?.expCity)">
              ⚲ {{ searchParams.destination || searchParams.hotelCity || searchParams.expCity || 'Todos los destinos'
              }}
            </p>
          </div>
          <div class="results-controls">
            <CustomSelect v-model="sortBy" :options="sortOptions" customClass="sort-select" />
          </div>
        </div>

        <!-- API Error Banner -->
        <div v-if="error && !showFavsOnly" class="api-error-banner">
          <span class="api-error-icon">⚠️</span>
          {{ error }}
        </div>

        <!-- Cards grid -->
        <TransitionGroup name="cards" tag="div" class="cards-grid">
          <!-- Skeletons while loading -->
          <template v-if="loading">
            <SkeletonCard v-for="i in 6" :key="'skel-' + i" />
          </template>
          
          <!-- Actual results -->
          <template v-else>
            <ProductCard v-for="item in sortedResults" :key="item.id" :item="item" :in-kit="isInKit(item)"
              :is-fav="isFav(item)" :in-compare="isInCompare(item)" @toggle-kit="toggleKit" @toggle-fav="toggleFav"
              @toggle-compare="toggleCompare" />
          </template>
        </TransitionGroup>

        <!-- Empty state for favs -->
        <div v-if="showFavsOnly && favItems.length === 0" class="empty-state">
          <div class="empty-icon">🤍</div>
          <h3>Aún no tienes favoritos</h3>
          <p>Explora destinos y guarda los que más te gusten.</p>
        </div>
      </div>
    </section>

    <!-- Kit floating button (mobile) -->
    <Transition name="fab">
      <button v-if="!kitOpen" class="kit-fab glass-strong" @click="kitOpen = true">
        <span v-if="kitItems.length === 0" class="star-align">★</span>
        <span v-else class="fab-count">{{ kitItems.length }}</span>
        <span class="fab-label">Mi Kit <span v-if="kitItems.length > 0">· €{{ kitTotal }}</span></span>
      </button>
    </Transition>

    <!-- Kit panel -->
    <KitBuilder :is-open="kitOpen" :items="kitItems" @close="kitOpen = false" @remove="removeFromKit"
      @clear="kitItems = []" />

    <!-- Compare Modal -->
    <CompareModal :is-open="compareOpen" :items="compareItems" @close="compareOpen = false" @remove="removeFromCompare"
      @add-to-kit="addToKit" />

    <!-- Footer -->
    <AppFooter />

    <!-- Auth Modal -->
    <AuthModal :is-open="authOpen" @close="authOpen = false" @auth-success="onAuthSuccess" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from './components/NavBar.vue';
import HeroSearch from './components/HeroSearch.vue';
import ProductCard from './components/ProductCard.vue';
import KitBuilder from './components/KitBuilder.vue';
import CompareModal from './components/CompareModal.vue';
import AppFooter from './components/AppFooter.vue';
import CustomSelect from './components/CustomSelect.vue';
import AuthModal from './components/AuthModal.vue';

const authOpen = ref(false);

function onAuthSuccess(user) {
  console.log('Usuario autenticado:', user?.email);
}

const sortOptions = [
  { label: 'Precio: menor primero', value: 'price-asc' },
  { label: 'Precio: mayor primero', value: 'price-desc' },
  { label: 'Mejor valorados', value: 'rating' },
];

import SkeletonCard from './components/SkeletonCard.vue';
import { useSearch } from './composables/useSearch.js';

const { results, loading, error, activeTab, loadDefault, doSearch } = useSearch();

const showResults = ref(false);
const showFavsOnly = ref(false);
const searchParams = ref(null);
const sortBy = ref('price-asc');

// Estado
const kitItems = ref([]);
const favItems = ref([]);
const compareItems = ref([]);

const kitOpen = ref(false);
const compareOpen = ref(false);

onMounted(() => {
  showResults.value = true;
  loadDefault('flights');
});

// ── Search logic ───────────────────────────────────────────────────────────
function handleTabChange(tab) {
  searchParams.value = null;
  showFavsOnly.value = false;

  if (tab === 'kits') {
    showResults.value = false;
    activeTab.value = 'kits';
  } else {
    showResults.value = true;
    loadDefault(tab);
  }
}

async function handleSearch(params) {
  showFavsOnly.value = false;
  searchParams.value = params;
  showResults.value = true;

  if (params.tab === 'kits') {
    await doSearch('flights', params);
    activeTab.value = 'flights';
  } else {
    await doSearch(params.tab, params);
  }

  // Scroll a resultados
  setTimeout(() => {
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── Sort ────────────────────────────────────────────────────────────────────
const sortedResults = computed(() => {
  let arr = showFavsOnly.value ? [...favItems.value] : [...results.value];

  if (sortBy.value === 'price-asc') arr.sort((a, b) => a.price - b.price);
  if (sortBy.value === 'price-desc') arr.sort((a, b) => b.price - a.price);
  if (sortBy.value === 'rating') arr.sort((a, b) => b.rating - a.rating);
  return arr;
});

const currentResultCount = computed(() => sortedResults.value.length);

const tabLabel = computed(() => ({
  flights: 'Vuelos', hotels: 'Hoteles', experiences: 'Experiencias'
}[activeTab.value] || ''));

// ── Favs Logic ──────────────────────────────────────────────────────────────
function toggleFavsView() {
  showFavsOnly.value = true;
  showResults.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function isFav(item) {
  return favItems.value.some(f => f.id === item.id);
}

function toggleFav(item) {
  if (isFav(item)) {
    favItems.value = favItems.value.filter(f => f.id !== item.id);
  } else {
    // Make sure item has price properly set if it's a hotel
    let itemToAdd = { ...item };
    if (itemToAdd.type === 'hotel' && !itemToAdd.price) {
      itemToAdd.price = itemToAdd.pricePerNight;
    }
    favItems.value.push(itemToAdd);
  }
}

// ── Compare Logic ───────────────────────────────────────────────────────────
function isInCompare(item) {
  return compareItems.value.some(c => c.id === item.id);
}

function toggleCompare(item) {
  if (isInCompare(item)) {
    removeFromCompare(item);
  } else {
    if (compareItems.value.length >= 4) {
      alert("Puedes comparar hasta 4 elementos a la vez.");
      return;
    }
    // Only compare items of the same type if possible, or warn
    if (compareItems.value.length > 0 && compareItems.value[0].type !== item.type) {
      if (!confirm("Estás añadiendo un elemento de distinto tipo (ej. Vuelo vs Hotel). ¿Continuar?")) {
        return;
      }
    }

    let itemToAdd = { ...item };
    if (itemToAdd.type === 'hotel' && !itemToAdd.price) {
      itemToAdd.price = itemToAdd.pricePerNight;
    }
    compareItems.value.push(itemToAdd);
    compareOpen.value = true;
  }
}

function removeFromCompare(item) {
  compareItems.value = compareItems.value.filter(c => c.id !== item.id);
  if (compareItems.value.length === 0) {
    compareOpen.value = false;
  }
}

// ── Kit logic ───────────────────────────────────────────────────────────────
function isInKit(item) {
  return kitItems.value.some(k => k.id === item.id);
}

function toggleKit(item) {
  if (isInKit(item)) {
    removeFromKit(item);
  } else {
    addToKit(item);
  }
}

function addToKit(item) {
  if (!isInKit(item)) {
    let itemToAdd = { ...item };
    if (itemToAdd.type === 'hotel' && !itemToAdd.price) {
      itemToAdd.price = itemToAdd.pricePerNight;
    }
    kitItems.value.push(itemToAdd);
  }
  kitOpen.value = true;
}

function removeFromKit(item) {
  kitItems.value = kitItems.value.filter(k => k.id !== item.id);
}

const kitTotal = computed(() =>
  kitItems.value.reduce((s, i) => {
    if (i.type === 'hotel') return s + (i.price * (i.nights || 3));
    return s + i.price;
  }, 0)
);
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  position: relative;
  background-color: var(--pure-black);
}

/* ── Favs Header ─────────────────────────────────────────── */
.favs-header-section {
  padding: 120px 2rem 2rem;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent);
}

.favs-header-inner {
  max-width: 1360px;
  margin: 0 auto;
  text-align: center;
}

.favs-title {
  font-size: 3rem;
  font-weight: 900;
}

.favs-sub {
  color: var(--gray-400);
  margin-top: 8px;
}

/* ── Results ─────────────────────────────────────────────── */
.results-section {
  position: relative;
  z-index: 1;
  padding: 4rem 2rem 8rem;
}

.results-inner {
  max-width: 1360px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
}

.results-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--pure-white);
}

.results-title em {
  font-style: normal;
  color: var(--gray-400);
}

.results-sub {
  color: var(--gray-400);
  font-size: 0.9rem;
  margin-top: 6px;
}

.results-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sort-select {
  width: 220px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-xl);
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--gray-500);
}

/* Cards grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.api-error-banner {
  background: rgba(255, 60, 60, 0.1);
  border: 1px solid rgba(255, 60, 60, 0.3);
  color: #ffcccc;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  font-weight: 500;
}

.api-error-icon {
  font-size: 1.2rem;
}

.star-align {
  margin-bottom: 1.5px;
}

/* Kit FAB */
.kit-fab {
  position: fixed;
  top: 75px;
  right: 32px;
  z-index: 150;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 24px 13px 24px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-size: 1.05rem;
  color: var(--pure-white);
  transition: all var(--dur-base) var(--ease-out);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
}

.kit-fab:hover {
  transform: translateY(-4px);
  border-color: var(--pure-white);
  background: rgb(255 255 255 / 30%);
}

.fab-count {
  background: var(--pure-white);
  color: var(--pure-black);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
}

.fab-label {
  font-size: 0.95rem;
  font-weight: 700;
}

/* Transitions */
.cards-enter-active,
.cards-leave-active,
.cards-move {
  transition: all 0.4s var(--ease-spring);
}

.cards-enter-from {
  opacity: 0;
  transform: scale(0.94) translateY(30px);
}

.cards-leave-to {
  opacity: 0;
  transform: scale(0.94);
  position: absolute;
}

.fab-enter-active {
  transition: all 0.4s var(--ease-spring);
}

.fab-leave-active {
  transition: all 0.2s ease;
}

.fab-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.fab-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

@media (max-width: 640px) {
  .results-section {
    padding: 2rem 1rem 8rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .sort-select {
    width: 100%;
  }
}

/* En móvil el kit-fab baja a la esquina inferior derecha */
@media (max-width: 700px) {
  .kit-fab {
    top: auto;
    bottom: 28px;
    right: 20px;
  }
}
</style>
