<template>
  <Transition name="overlay">
    <div v-if="isOpen" class="kit-overlay" @click.self="$emit('close')">
      <div class="kit-panel animate-slide-right">
        <!-- Handle bar (mobile) -->
        <div class="kit-handle" @click="$emit('close')"></div>

        <!-- Header -->
        <div class="kit-header">
          <div class="kit-brand">
            <div class="kit-icon-box"><span class="star-align">★</span></div>
            <div>
              <h2 class="kit-title">Mi Kit de Viaje</h2>
              <p class="kit-sub">{{ items.length }} elemento{{ items.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')" id="kit-close-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Empty state -->
        <div v-if="items.length === 0" class="kit-empty">
          <div class="kit-empty-orb"></div>
          <div class="kit-empty-icon">✦</div>
          <h3>Kit vacío</h3>
          <p>Añade vuelos, hoteles y experiencias para construir tu viaje perfecto.</p>
          <button class="btn btn-outline btn-sm" @click="$emit('close')" id="kit-empty-close">Explorar opciones</button>
        </div>

        <!-- Items list -->
        <div v-else class="kit-body">
          <!-- Section: Vuelos -->
          <div v-if="flights.length" class="kit-section">
            <div class="kit-section-hd">
              <span class="section-icon">✈</span>
              <span class="section-label">Vuelos</span>
              <span class="section-count">{{ flights.length }}</span>
            </div>
            <TransitionGroup name="kit-item" tag="div" class="kit-items-list">
              <div v-for="item in flights" :key="item.id" class="kit-item">
                <div class="kit-item-icon">✈</div>
                <div class="kit-item-body">
                  <span class="kit-item-name">
                    {{ item.from?.split('(')[0].trim() }} &nbsp;&nbsp; → &nbsp;&nbsp; {{ item.to?.split('(')[0].trim()
                    }}
                  </span>
                  <span class="kit-item-sub">{{ item.airline }} · {{ item.departure }}–{{ item.arrival }}</span>
                </div>
                <div class="kit-item-end">
                  <span class="kit-item-price">€{{ item.price }}</span>
                  <button class="remove-btn" @click="$emit('remove', item)" :id="`remove-${item.id}`">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Section: Hoteles -->
          <div v-if="hotels.length" class="kit-section">
            <div class="kit-section-hd">
              <span class="section-icon">𖠿</span>
              <span class="section-label">Hoteles</span>
              <span class="section-count">{{ hotels.length }}</span>
            </div>
            <TransitionGroup name="kit-item" tag="div" class="kit-items-list">
              <div v-for="item in hotels" :key="item.id" class="kit-item">
                <div class="kit-item-icon">𖠿</div>
                <div class="kit-item-body">
                  <span class="kit-item-name">{{ item.name }}</span>
                  <span class="kit-item-sub">{{ item.city }} · {{ item.nights }} noches</span>
                </div>
                <div class="kit-item-end">
                  <span class="kit-item-price">€{{ item.price * (item.nights || 3) }}</span>
                  <button class="remove-btn" @click="$emit('remove', item)" :id="`remove-${item.id}`">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Section: Experiencias -->
          <div v-if="experiences.length" class="kit-section">
            <div class="kit-section-hd">
              <span class="section-icon">☕︎</span>
              <span class="section-label">Experiencias</span>
              <span class="section-count">{{ experiences.length }}</span>
            </div>
            <TransitionGroup name="kit-item" tag="div" class="kit-items-list">
              <div v-for="item in experiences" :key="item.id" class="kit-item">
                <div class="kit-item-icon">{{ item.emoji || '☕︎' }}</div>
                <div class="kit-item-body">
                  <span class="kit-item-name">{{ item.name }}</span>
                  <span class="kit-item-sub">{{ item.city }} · {{ item.duration }}</span>
                </div>
                <div class="kit-item-end">
                  <span class="kit-item-price">€{{ item.price }}</span>
                  <button class="remove-btn" @click="$emit('remove', item)" :id="`remove-${item.id}`">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="items.length > 0" class="kit-summary">
          <div class="summary-inner">
            <div class="summary-rows">
              <div class="summary-row" v-if="flights.length">
                <span>Vuelos</span>
                <span>€{{ flightTotal }}</span>
              </div>
              <div class="summary-row" v-if="hotels.length">
                <span>Hoteles ({{ hotelNights }} noches)</span>
                <span>€{{ hotelTotal }}</span>
              </div>
              <div class="summary-row" v-if="experiences.length">
                <span>Experiencias</span>
                <span>€{{ expTotal }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="summary-total-row">
              <div>
                <span class="summary-total-label">TOTAL ESTIMADO</span>
                <span class="summary-total-note">por persona</span>
              </div>
              <span class="summary-total-val">€{{ grandTotal }}</span>
            </div>

            <!-- Ahorro -->
            <div v-if="totalSavings > 0" class="savings-pill">
              Ahorras <strong>€{{ totalSavings }}</strong> vs precio original
            </div>

            <!-- Desglose visual -->
            <div class="cost-bar" v-if="grandTotal > 0">
              <div class="cost-seg flight-seg" :style="{ width: (flightTotal / grandTotal * 100) + '%' }"
                :title="`Vuelos: €${flightTotal}`"></div>
              <div class="cost-seg hotel-seg" :style="{ width: (hotelTotal / grandTotal * 100) + '%' }"
                :title="`Hoteles: €${hotelTotal}`"></div>
              <div class="cost-seg exp-seg" :style="{ width: (expTotal / grandTotal * 100) + '%' }"
                :title="`Experiencias: €${expTotal}`"></div>
            </div>
            <div class="cost-bar-legend">
              <span class="legend-item"><i class="flight-dot"></i>Vuelos</span>
              <span class="legend-item"><i class="hotel-dot"></i>Hoteles</span>
              <span class="legend-item"><i class="exp-dot"></i>Experiencias</span>
            </div>

            <!-- Actions -->
            <div class="kit-actions">
              <button class="btn btn-outline btn-sm" @click="$emit('clear')" id="kit-clear-btn">
                🗑 &nbsp;Vaciar
              </button>
              <button class="btn btn-primary" id="kit-book-btn" style="flex:1">
                ✦ &nbsp;Reservar todo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  items: { type: Array, default: () => [] },
});

defineEmits(['close', 'remove', 'clear']);

const flights = computed(() => props.items.filter(i => i.type === 'flight'));
const hotels = computed(() => props.items.filter(i => i.type === 'hotel'));
const experiences = computed(() => props.items.filter(i => i.type === 'experience'));

const flightTotal = computed(() => flights.value.reduce((s, i) => s + i.price, 0));
const hotelNights = computed(() => hotels.value.reduce((s, i) => s + (i.nights || 3), 0));
const hotelTotal = computed(() => hotels.value.reduce((s, i) => s + i.price * (i.nights || 3), 0));
const expTotal = computed(() => experiences.value.reduce((s, i) => s + i.price, 0));
const grandTotal = computed(() => flightTotal.value + hotelTotal.value + expTotal.value);

const totalSavings = computed(() =>
  props.items.reduce((s, i) => {
    const orig = i.type === 'hotel'
      ? (i.originalPrice || 0) * (i.nights || 3)
      : (i.originalPrice || 0);
    return s + (orig - i.price);
  }, 0)
);
</script>

<style scoped>
/* Overlay */
.kit-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  justify-content: flex-end;
}

/* Panel */
.kit-panel {
  width: 100%;
  max-width: 480px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Glass dark very strong */
  background: rgba(8, 8, 8, 0.88);
  backdrop-filter: var(--blur-xl);
  -webkit-backdrop-filter: var(--blur-xl);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -30px 0 100px rgba(0, 0, 0, 0.7);
}

.kit-handle {
  width: 36px;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  margin: 14px auto 0;
  display: none;
  cursor: pointer;
}

/* Header */
.kit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 16px;
}

.kit-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.kit-icon-box {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
}

.kit-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--pure-white);
}

.kit-sub {
  font-size: 0.78rem;
  color: var(--gray-500);
  margin-top: 2px;
}

.close-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  color: var(--gray-400);
  transition: all var(--dur-fast) ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--pure-white);
}

/* Empty */
.kit-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 28px;
  text-align: center;
  position: relative;
}

.kit-empty-orb {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

.kit-empty-icon {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.15);
  animation: pulse-glow 2.5s ease infinite;
}

.kit-empty h3 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--pure-white);
}

.kit-empty p {
  color: var(--gray-500);
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 260px;
}

/* Body */
.kit-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.kit-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kit-section-hd {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
}

.section-icon {
  font-size: 0.9rem;
}

.section-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gray-400);
  flex: 1;
}

.section-count {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1px 7px;
  border-radius: var(--radius-full);
  color: var(--gray-400);
}

.kit-items-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color var(--dur-fast) ease;
}

.kit-item:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.kit-item-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
}

.kit-item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kit-item-name {
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--pure-white);
}

.kit-item-sub {
  font-size: 0.73rem;
  color: var(--gray-400);
}

.kit-item-end {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
}

.kit-item-price {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
  color: var(--pure-white);
}

.remove-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 50%;
  cursor: pointer;
  color: #fca5a5;
  transition: all var(--dur-fast) ease;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.22);
}

/* Summary */
.kit-summary {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 20px;
  flex-shrink: 0;
}

.summary-inner {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--gray-400);
}

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-total-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--gray-300);
}

.summary-total-note {
  font-size: 0.68rem;
  color: var(--gray-400);
}

.summary-total-val {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--pure-white);
  letter-spacing: -0.04em;
}

/* Savings pill */
.savings-pill {
  text-align: center;
  font-size: 0.8rem;
  color: #d583ff;
  background: rgb(178 74 222 / 8%);
  border: 1px solid rgb(164 63 210 / 37%);
  border-radius: var(--radius-full);
  padding: 7px 14px;
}

/* Cost bar */
.cost-bar {
  height: 6px;
  border-radius: var(--radius-full);
  overflow: hidden;
  display: flex;
  background: rgba(255, 255, 255, 0.05);
}

.cost-seg {
  height: 100%;
  transition: width 0.5s var(--ease-out);
}

.flight-seg {
  background: rgba(255, 255, 255, 0.7);
}

.hotel-seg {
  background: rgba(200, 200, 200, 0.5);
}

.exp-seg {
  background: rgba(160, 160, 160, 0.4);
}

.cost-bar-legend {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  color: var(--gray-500);
}

.legend-item i {
  display: block;
  width: 10px;
  height: 3px;
  border-radius: 2px;
}

.flight-dot {
  background: rgba(255, 255, 255, 0.7);
}

.hotel-dot {
  background: rgba(200, 200, 200, 0.6);
}

.exp-dot {
  background: rgba(160, 160, 160, 0.5);
}

/* Actions */
.kit-actions {
  display: flex;
  gap: 8px;
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--dur-base) ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-active .kit-panel,
.overlay-leave-active .kit-panel {
  transition: transform var(--dur-slow) var(--ease-out);
}

.overlay-enter-from .kit-panel,
.overlay-leave-to .kit-panel {
  transform: translateX(100%);
}

.kit-item-enter-active {
  transition: all 0.3s var(--ease-spring);
}

.kit-item-leave-active {
  transition: all 0.2s ease;
}

.kit-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.kit-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 520px) {
  .kit-panel {
    max-width: 100%;
  }

  .kit-handle {
    display: block;
  }

  .kit-header {
    padding: 14px 18px 12px;
  }

  .summary-inner {
    padding: 14px;
  }
}
</style>
