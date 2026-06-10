<template>
  <section class="hero" id="search">
    <!-- Background layers -->
    <div class="hero-bg" aria-hidden="true">
      <!-- Foto de fondo (overlay gradient) -->
      <div class="hero-bg-photo"></div>
      <div class="hero-bg-overlay"></div>

      <!-- Orbs blancos flotantes -->
      <div class="hw-orb hw-orb-1"></div>
      <div class="hw-orb hw-orb-2"></div>
      <div class="hw-orb hw-orb-3"></div>

      <!-- Grid sutil -->
      <div class="hero-grid"></div>
    </div>

    <!-- Main content -->
    <div class="hero-content animate-slide-up">
      <!-- Label pill -->
      <div class="hero-pill">
        <span class="pill-dot"></span>
        Compara más de 2400 destinos
      </div>

      <!-- Headline -->
      <h1 class="hero-title">
        Tu aventura
        <br>
        <span class="title-mirror">perfecta</span>
        <span class="title-sub">te espera</span>
      </h1>

      <p class="hero-subtitle">
        Compara vuelos, hoteles y experiencias.<br>
        Construye tu kit de viaje a medida en segundos.
      </p>

      <!-- Stats row -->
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-num">2.4K+</span>
          <span class="stat-label">Destinos</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">98%</span>
          <span class="stat-label">Satisfacción</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">€320</span>
          <span class="stat-label">Ahorro</span>
        </div>
      </div>

      <!-- Search card -->
      <div class="search-card glass-white-strong">
        <!-- Tabs -->
        <div class="tabs" role="tablist">
          <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }"
            :id="`tab-${tab.id}`" role="tab" @click="setTab(tab.id)">
            <span class="tab-icon" :class="{ 'star-align': tab.icon === '★' }">{{ tab.icon }}</span>
            <span class="tab-lbl">{{ tab.label }}</span>
          </button>
        </div>

        <!-- Form area -->
        <div class="search-body">
          <!-- VUELOS -->
          <Transition name="form-fade" mode="out-in">
            <div v-if="activeTab === 'flights'" key="flights" class="form-grid">
              <div class="form-group">
                <label class="form-label">⧘ Origen</label>
                <AutocompleteInput
                  v-model="form.origin"
                  placeholder="Madrid, Barcelona..."
                  id="flight-origin"
                  mode="flight"
                  @select-meta="m => meta.origin = m"
                />
              </div>
              <div class="form-group">
                <label class="form-label">🗺 Destino</label>
                <AutocompleteInput
                  v-model="form.destination"
                  placeholder="París, Londres, Roma..."
                  id="flight-dest"
                  mode="flight"
                  @select-meta="m => meta.destination = m"
                />
              </div>
              <div class="form-group">
                <label class="form-label">$ Precio máximo</label>
                <input class="input-glass" type="number" placeholder="Sin límite" v-model.number="form.maxPrice"
                  id="flight-maxprice" />
              </div>
              <div class="form-group form-full">
                <button class="btn btn-primary btn-xl search-btn" id="search-flights-btn" @click="doSearch">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Buscar Vuelos
                </button>
              </div>
            </div>

            <!-- HOTELES -->
            <div v-else-if="activeTab === 'hotels'" key="hotels" class="form-grid">
              <div class="form-group">
                <label class="form-label">🏙 Ciudad</label>
                <AutocompleteInput
                  v-model="form.hotelCity"
                  placeholder="París, Londres, Dubai..."
                  id="hotel-city"
                  mode="hotel"
                  @select-meta="m => meta.hotelCity = m"
                />
              </div>
              <div class="form-group">
                <label class="form-label">☆☆☆☆☆ Categoría</label>
                <select class="input-glass" v-model.number="form.stars" id="hotel-stars">
                  <option :value="0">Todas las estrellas</option>
                  <option :value="3">3★ o más</option>
                  <option :value="4">4★ o más</option>
                  <option :value="5">5★ únicamente</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">$ Precio / noche</label>
                <input class="input-glass" type="number" placeholder="Sin límite" v-model.number="form.hotelMaxPrice"
                  id="hotel-maxprice" />
              </div>
              <div class="form-group form-full">
                <button class="btn btn-primary btn-xl search-btn" id="search-hotels-btn" @click="doSearch">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Buscar Hoteles
                </button>
              </div>
            </div>

            <!-- EXPERIENCIAS -->
            <div v-else-if="activeTab === 'experiences'" key="experiences" class="form-grid">
              <div class="form-group">
                <label class="form-label">🏙 Ciudad</label>
                <AutocompleteInput
                  v-model="form.expCity"
                  placeholder="París, Madrid, Roma..."
                  id="exp-city"
                  mode="hotel"
                  @select-meta="m => meta.expCity = m"
                />
              </div>
              <div class="form-group">
                <label class="form-label">☀︎ Categoría</label>
                <select class="input-glass" v-model="form.expCategory" id="exp-cat">
                  <option value="">Todas las categorías</option>
                  <option value="Gastronomía">Gastronomía</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Bienestar">Bienestar</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">$ Precio máximo</label>
                <input class="input-glass" type="number" placeholder="Sin límite" v-model.number="form.expMaxPrice"
                  id="exp-maxprice" />
              </div>
              <div class="form-group form-full">
                <button class="btn btn-primary btn-xl search-btn" id="search-exp-btn" @click="doSearch">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Buscar Experiencias
                </button>
              </div>
            </div>

            <!-- KIT BUILDER CTA -->
            <div v-else-if="activeTab === 'kits'" key="kits" class="kit-cta-area">
              <div class="kit-cta-card">
                <div class="kit-cta-icon"><span class="star-align">★</span></div>
                <div class="kit-cta-text">
                  <h3>Constructor de Viajes</h3>
                  <p>Combina vuelo + hotel + experiencias y calcula el coste total de tu aventura.</p>
                </div>
              </div>
              <button class="btn btn-primary btn-xl search-btn" id="open-kit-btn"
                @click="$emit('search', { tab: 'flights', ...form }); $emit('open-kit')">
                ✦ &nbsp;Empezar mi Kit de Viaje
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Scroll cue -->
      <div class="scroll-cue" aria-hidden="true">
        <div class="scroll-line"></div>
        <span>Explorar</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import AutocompleteInput from './AutocompleteInput.vue';

const emit = defineEmits(['tab-change', 'search', 'open-kit']);

const tabs = [
  { id: 'flights', icon: '✈', label: 'Vuelos' },
  { id: 'hotels', icon: '𖠿', label: 'Hoteles' },
  { id: 'experiences', icon: '☕︎', label: 'Experiencias' },
  { id: 'kits', icon: '★', label: 'Mi Kit' },
];

const activeTab = ref('flights');

const form = ref({
  origin: '', destination: '', maxPrice: null,
  hotelCity: '', stars: 0, hotelMaxPrice: null,
  expCity: '', expCategory: '', expMaxPrice: null,
});

// Stores the resolved meta (dest_id / iata) when user picks an autocomplete suggestion
const meta = ref({
  origin: null,
  destination: null,
  hotelCity: null,
  expCity: null,
});

function setTab(id) {
  activeTab.value = id;
  emit('tab-change', id);
}

function doSearch() {
  emit('search', {
    tab: activeTab.value,
    ...form.value,
    // Pass resolved meta so bookingApi can bypass the extra searchDestination call
    _meta: meta.value,
  });
}
</script>

<style scoped>
/* ── Hero container ─────────────────────────────── */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 68px 2rem 0;
  position: relative;
  overflow: hidden;
}

/* ── Background ─────────────────────────────────── */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.hero-bg-photo {
  position: absolute;
  inset: 0;
  background:
    url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80') center / cover no-repeat;
  filter: grayscale(80%) brightness(0.35);
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 70% at 50% 0%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.65) 100%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%);
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 70px 70px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
}

.hw-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.hw-orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.07) 0%, transparent 65%);
  top: -200px;
  left: -200px;
  animation: slowDrift 18s ease infinite;
}

.hw-orb-2 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 65%);
  top: 20%;
  right: -100px;
  animation: slowDrift 14s ease infinite;
  animation-delay: -5s;
}

.hw-orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 65%);
  bottom: 5%;
  left: 30%;
  animation: slowDrift 20s ease infinite;
  animation-delay: -10s;
}

/* ── Content ─────────────────────────────────────── */
.hero-content {
  max-width: 860px;
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

/* Pill */
.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 18px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: var(--blur-sm);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 20px;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a03cb9;
  animation: pulse-glow 2s ease infinite;
}

/* Title */
.hero-title {
  font-size: clamp(3.2rem, 7vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1.0;
  color: var(--pure-white);
}

.title-mirror {
  display: inline-block;
  background: linear-gradient(270deg, #ffffff, #555555, #f0f0f0, #3f3f3f, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: flowing-glass 10s ease infinite;
}

@keyframes flowing-glass {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.title-sub {
  font-size: 0.55em;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: -0.02em;
  display: inline-block;
  margin-left: 0.3em;
  vertical-align: middle;
}

/* Subtitle */
.hero-subtitle {
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 480px;
}

/* Stats */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  padding: 12px 28px;
  backdrop-filter: var(--blur-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.stat-num {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: #a03cb9;
}

.stat-label {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.05em;
}

.stat-sep {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.12);
}

/* ── Search card ─────────────────────────────────── */
.search-card {
  width: 100%;
  border-radius: var(--radius-xl);
  padding: 8px;
  /* crystal glass white */
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 -1px 0 rgba(0, 0, 0, 0.15) inset;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 3px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: calc(var(--radius-xl) - 10px);
  margin-bottom: 4px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  border-radius: calc(var(--radius-xl) - 14px);
  border: 1px solid transparent;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  white-space: nowrap;
}

.tab-btn:hover {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.08);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.32);
  color: var(--pure-white);
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.3) inset;
}

.tab-icon {
  font-size: 1.05rem;
}

/* Form */
.search-body {
  padding: 14px 12px 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  align-items: end;
}

.form-full {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: left;
}

.search-btn {
  width: 100%;
  justify-content: center;
  gap: 10px;
}

/* Kit CTA */
.kit-cta-area {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.kit-cta-card {
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  text-align: left;
}

.kit-cta-icon {
  font-size: 2.4rem;
  flex-shrink: 0;
}

.kit-cta-text h3 {
  font-family: var(--font-display);
  font-size: 1.05rem;
  margin-bottom: 4px;
}

.kit-cta-text p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

/* Scroll cue */
.scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  opacity: 0.4;
}

.scroll-line {
  width: 1px;
  height: 46px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255));
  animation: pulse-glow 2s ease infinite;
}

.scroll-cue span {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255);
}

/* Transition */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all var(--dur-fast) var(--ease-out);
}

.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Responsive */
@media (max-width: 700px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .tab-lbl {
    display: none;
  }

  .hero-stats {
    padding: 10px 16px;
    gap: 14px;
  }

  .hero-title {
    font-size: clamp(2.6rem, 10vw, 5rem);
  }

  .hero-pill {
    font-size: 0.72rem;
  }
}
</style>
