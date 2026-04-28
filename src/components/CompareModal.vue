<template>
  <Transition name="cmp-overlay">
    <div v-if="isOpen" class="cmp-overlay" @click.self="$emit('close')">
      <div class="cmp-modal glass-strong animate-scale-in">

        <div class="cmp-header">
          <h2 class="cmp-title">Comparando <span class="text-gradient-white">{{ items.length }}</span> opciones</h2>
          <button class="close-btn" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="divider"></div>

        <div v-if="items.length < 2" class="cmp-empty">
          <p>Selecciona al menos 2 elementos para comparar</p>
          <span>Usa el icono ▣ en las tarjetas</span>
        </div>

        <div v-else class="cmp-table-wrap">
          <table class="cmp-table">
            <thead>
              <tr>
                <th class="field-col">Campo</th>
                <th v-for="item in items" :key="item.id" class="item-col">
                  <div class="cmp-item-head">
                    <span class="cmp-item-icon">{{ getIcon(item) }}</span>
                    <span class="cmp-item-name">{{ getShortName(item) }}</span>
                    <button class="remove-cmp-btn" @click="$emit('remove', item)" :id="`cmp-rm-${item.id}`">✕</button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="cmp-row">
                <td class="field-name">Precio</td>
                <td v-for="item in items" :key="item.id" class="cmp-val" :class="{ best: isBestPrice(item) }">
                  <span class="val-price">€{{ item.price }}</span>
                  <span v-if="isBestPrice(item)" class="best-badge">✓ Mejor</span>
                </td>
              </tr>
              <tr class="cmp-row">
                <td class="field-name">Valoración</td>
                <td v-for="item in items" :key="item.id" class="cmp-val" :class="{ best: isBestRating(item) }">
                  <span class="stars-gold">★</span> {{ item.rating }}
                  <span v-if="isBestRating(item)" class="best-badge">✓ Mejor</span>
                </td>
              </tr>
              <tr class="cmp-row" v-if="allFlights">
                <td class="field-name">Duración</td>
                <td v-for="item in items" :key="item.id" class="cmp-val">{{ item.duration }}</td>
              </tr>
              <tr class="cmp-row" v-if="allFlights">
                <td class="field-name">Escalas</td>
                <td v-for="item in items" :key="item.id" class="cmp-val">
                  <span :class="item.stops === 'Directo' ? 'direct-badge' : 'stop-badge'">{{ item.stops }}</span>
                </td>
              </tr>
              <tr class="cmp-row" v-if="allHotels">
                <td class="field-name">Estrellas</td>
                <td v-for="item in items" :key="item.id" class="cmp-val">
                  <span class="stars-gold">{{ '★'.repeat(item.stars || 0) }}</span>
                </td>
              </tr>
              <tr class="cmp-row" v-if="allExps">
                <td class="field-name">Duración</td>
                <td v-for="item in items" :key="item.id" class="cmp-val">{{ item.duration }}</td>
              </tr>
              <tr class="cmp-row" v-if="allExps">
                <td class="field-name">Grupo</td>
                <td v-for="item in items" :key="item.id" class="cmp-val">{{ item.groupSize }}</td>
              </tr>
              <tr class="cmp-row">
                <td class="field-name">Ahorro</td>
                <td v-for="item in items" :key="item.id" class="cmp-val">
                  <span v-if="item.originalPrice" class="saving-val">
                    -{{ Math.round((1 - item.price / item.originalPrice) * 100) }}%
                  </span>
                  <span v-else class="dim-val">—</span>
                </td>
              </tr>
              <tr class="cmp-row action-row">
                <td class="field-name"></td>
                <td v-for="item in items" :key="item.id" class="cmp-val">
                  <button class="btn btn-primary btn-sm" @click="$emit('add-to-kit', item); $emit('close')"
                    :id="`cmp-kit-${item.id}`">
                    + Kit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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

defineEmits(['close', 'remove', 'add-to-kit']);

const allFlights = computed(() => props.items.every(i => i.type === 'flight'));
const allHotels = computed(() => props.items.every(i => i.type === 'hotel'));
const allExps = computed(() => props.items.every(i => i.type === 'experience'));

const minPrice = computed(() => Math.min(...props.items.map(i => i.price)));
const maxRating = computed(() => Math.max(...props.items.map(i => i.rating)));

function isBestPrice(item) { return item.price === minPrice.value; }
function isBestRating(item) { return item.rating === maxRating.value; }

function getIcon(item) {
  if (item.type === 'flight') return '✈';
  if (item.type === 'hotel') return '𖠿';
  return item.emoji || '☕︎';
}

function getShortName(item) {
  if (item.type === 'flight') return `${item.from?.split(' ')[0]} → ${item.to?.split(' ')[0]}`;
  return item.name?.length > 22 ? item.name.slice(0, 22) + '…' : item.name;
}
</script>

<style scoped>
.cmp-overlay {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.cmp-modal {
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cmp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 28px 16px;
}

.cmp-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
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
  color: white;
}

.cmp-empty {
  padding: 40px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cmp-empty p {
  font-size: 1rem;
  font-weight: 600;
}

.cmp-empty span {
  font-size: 0.875rem;
  color: var(--gray-500);
}

.cmp-table-wrap {
  overflow-x: auto;
  overflow-y: auto;
  flex: 1;
  padding: 0 8px 8px;
}

.cmp-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 6px;
}

.field-col {
  width: 120px;
}

.item-col {
  min-width: 180px;
}

.cmp-item-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}

.cmp-item-icon {
  font-size: 1.2rem;
}

.cmp-item-name {
  font-size: 0.8rem;
  font-weight: 600;
  flex: 1;
}

.remove-cmp-btn {
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  font-size: 0.75rem;
  transition: color var(--dur-fast) ease;
}

.remove-cmp-btn:hover {
  color: #fca5a5;
}

.cmp-row td {
  padding: 8px 6px;
  vertical-align: middle;
}

.field-name {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--gray-500);
  padding-left: 8px;
}

.cmp-val {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--radius-md);
  transition: all var(--dur-fast) ease;
}

.cmp-val.best {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
}

.best-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-left: 6px;
  color: var(--pure-white);
}

.direct-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(74, 222, 128, 0.12);
  color: #86efac;
}

.stop-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
}

.val-price {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
}

.saving-val {
  color: #86efac;
  font-weight: 700;
  font-size: 0.9rem;
}

.dim-val {
  color: var(--gray-600);
}

.stars-gold {
  color: #f0c040;
}

.action-row td.cmp-val {
  background: transparent;
  border-color: transparent;
}

/* Transitions */
.cmp-overlay-enter-active,
.cmp-overlay-leave-active {
  transition: opacity var(--dur-base) ease;
}

.cmp-overlay-enter-from,
.cmp-overlay-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .cmp-overlay {
    padding: 12px;
  }

  .field-col {
    width: 80px;
  }

  .cmp-table {
    font-size: 0.85rem;
  }
}
</style>
