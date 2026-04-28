<template>
  <div class="product-card" :class="{ 'in-kit': inKit, 'in-compare': inCompare, 'is-fav': isFav }"
    @mouseenter="hovered = true" @mouseleave="hovered = false">
    <!-- Stripe -->
    <div class="card-stripe" :style="{ background: item.color || 'rgba(255,255,255,0.5)' }"></div>

    <!-- Glass glare effect -->
    <div class="card-glare" aria-hidden="true"></div>

    <!-- Top row -->
    <div class="card-top">
      <div class="card-icon-wrap">
        <span class="card-icon">{{ displayIcon }}</span>
      </div>

      <div class="card-top-meta">
        <span class="card-type-badge">{{ typeLabel }}</span>
        <div class="card-tags">
          <span v-for="tag in item.tags?.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="card-actions-top">
        <!-- Favorito -->
        <button class="action-icon-btn" :class="{ active: isFav }"
          :title="isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'" @click.stop="$emit('toggle-fav', item)"
          :id="`fav-${item.id}`">
          <svg width="15" height="15" viewBox="0 0 24 24" :fill="isFav ? 'white' : 'none'" stroke="white"
            stroke-width="2">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <!-- Comparar -->
        <button class="action-icon-btn" :class="{ active: inCompare }"
          :title="inCompare ? 'Quitar comparación' : 'Comparar'" @click.stop="$emit('toggle-compare', item)"
          :id="`cmp-${item.id}`">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="18" rx="1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Rating -->
    <div class="card-rating">
      <span class="stars-gold">{{ '★'.repeat(Math.round(item.rating)) }}</span>
      <span class="rating-num">{{ item.rating }}</span>
      <span class="rating-cnt" v-if="item.reviews">({{ item.reviews?.toLocaleString() }})</span>
    </div>

    <!-- Name -->
    <h3 class="card-name">{{ displayName }}</h3>
    <p class="card-loc">{{ displayLocation }}</p>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Type-specific content -->

    <!-- FLIGHT -->
    <div v-if="item.type === 'flight'" class="flight-info">
      <div class="flight-route">
        <div class="route-point">
          <span class="route-time">{{ item.departure }}</span>
          <span class="route-city">{{ item.from?.split(' ')[0] }}</span>
        </div>
        <div class="route-mid">
          <div class="route-progress">
            <div class="route-dot"></div>
            <div class="route-line-inner"></div>
            <div class="route-plane">✈</div>
          </div>
          <span class="route-dur">{{ item.duration }}</span>
          <div class="route-stops" :class="{ direct: item.stops === 'Directo' }">
            {{ item.stops }}
          </div>
        </div>
        <div class="route-point right">
          <span class="route-time">{{ item.arrival }}</span>
          <span class="route-city">{{ item.to?.split(' ')[0] }}</span>
        </div>
      </div>
      <div class="flight-chips">
        <span class="chip">{{ item.airline }}</span>
        <span class="chip">{{ item.class }}</span>
      </div>
    </div>

    <!-- HOTEL -->
    <div v-else-if="item.type === 'hotel'" class="hotel-info">
      <div class="hotel-stars">
        <span v-for="n in item.stars" :key="n" class="star-icon star-align">★</span>
      </div>
      <p class="hotel-desc">{{ item.description }}</p>
      <div class="amenities">
        <span v-for="a in item.amenities?.slice(0, 4)" :key="a" class="chip">{{ a }}</span>
      </div>
    </div>

    <!-- EXPERIENCE -->
    <div v-else-if="item.type === 'experience'" class="exp-info">
      <p class="exp-desc">{{ item.description }}</p>
      <div class="exp-chips">
        <span class="chip">⏱ {{ item.duration }}</span>
        <span class="chip">👥 {{ item.groupSize }}</span>
        <span class="chip">☀︎ {{ item.category }}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <div class="price-area">
        <span class="price-orig" v-if="item.originalPrice">€{{ item.originalPrice }}</span>
        <div class="price-current">
          <span class="price-main">€{{ item.price }}</span>
          <span class="price-sfx">{{ priceSuffix }}</span>
        </div>
        <span class="discount-badge" v-if="discountPct">-{{ discountPct }}%</span>
      </div>

      <button class="kit-toggle-btn" :class="{ added: inKit }" @click="$emit('toggle-kit', item)"
        :id="`kit-toggle-${item.id}`">
        <span v-if="!inKit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Kit
        </span>
        <span v-else>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Añadido
        </span>
      </button>
    </div>

    <!-- Kit indicator -->
    <Transition name="kit-check">
      <div v-if="inKit" class="kit-indicator"><span class="star-align">★</span> En tu Kit</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  item: { type: Object, required: true },
  inKit: { type: Boolean, default: false },
  isFav: { type: Boolean, default: false },
  inCompare: { type: Boolean, default: false },
});

defineEmits(['toggle-kit', 'toggle-fav', 'toggle-compare']);

const hovered = ref(false);

const typeLabel = computed(() => ({
  flight: 'Vuelo ✈', hotel: 'Hotel 𖠿', experience: 'Experiencia ☕︎'
}[props.item.type] || ''));

const displayIcon = computed(() => {
  if (props.item.type === 'flight') return '✈';
  if (props.item.type === 'hotel') return '𖠿';
  return props.item.emoji || '☕︎';
});

const displayName = computed(() => {
  if (props.item.type === 'flight') return `${props.item.from} \u00A0\u00A0\u00A0 → \u00A0\u00A0\u00A0 ${props.item.to}`;
  return props.item.name;
});

const displayLocation = computed(() => {
  if (props.item.type === 'flight') return `${props.item.airline} \u00A0\u00A0\u00A0>\u00A0\u00A0\u00A0 Clase ${props.item.class}`;
  if (props.item.type === 'hotel') return `${props.item.city}, ${props.item.country}`;
  return `${props.item.city} · ${props.item.category}`;
});

const priceSuffix = computed(() => {
  if (props.item.type === 'hotel') return '/ noche';
  return '/ persona';
});

const discountPct = computed(() => {
  if (!props.item.originalPrice) return null;
  return Math.round((1 - props.item.price / props.item.originalPrice) * 100);
});
</script>

<style scoped>
/* ── Card base ──────────────────────────────────── */
.product-card {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  /* Premium elegant glass */
  background: linear-gradient(135deg, rgb(255 255 255 / 17%) 0%, rgb(69 0 79 / 15%) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
  transition:
    transform var(--dur-base) var(--ease-out),
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out);
}

.product-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), 0 1px 0 rgba(255, 255, 255, 0.15) inset;
  border-color: rgba(255, 255, 255, 0.28);
}

.product-card.in-kit {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), 0 12px 50px rgba(0, 0, 0, 0.7);
}

.product-card.in-compare {
  border-color: rgba(200, 200, 255, 0.3);
}

/* Stripe */
.card-stripe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0.7;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

/* Glare */
.card-glare {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 0%, transparent 100%);
  pointer-events: none;
  border-radius: inherit;
}

/* ── Top row ─────────────────────────────────────── */
.card-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.card-icon-wrap {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
}

.card-top-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-type-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 2px 9px;
  border-radius: var(--radius-full);
  width: fit-content;
}

.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

/* Action icons */
.card-actions-top {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
}

.action-icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--dur-fast) ease;
  opacity: 0.5;
}

.action-icon-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.12);
}

.action-icon-btn.active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* ── Rating ──────────────────────────────────────── */
.card-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stars-gold {
  color: #f0c040;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.rating-num {
  font-weight: 700;
  font-size: 0.9rem;
}

.rating-cnt {
  color: var(--gray-400);
  font-size: 0.75rem;
}

/* ── Name & location ─────────────────────────────── */
.card-name {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--pure-white);
}

.card-loc {
  font-size: 0.8rem;
  color: var(--gray-400);
}

/* ── FLIGHT ──────────────────────────────────────── */
.flight-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flight-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.route-point {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.route-point.right {
  align-items: flex-end;
}

.route-time {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 800;
}

.route-city {
  font-size: 0.7rem;
  color: var(--gray-500);
}

.route-mid {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.route-progress {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  height: 12px;
}

.route-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.route-line-inner {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2));
}

.route-plane {
  font-size: 0.8rem;
  flex-shrink: 0;
}

.route-dur {
  font-size: 0.7rem;
  color: var(--gray-400);
}

.route-stops {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.route-stops.direct {
  background: rgba(74, 222, 128, 0.12);
  color: #86efac;
}

.flight-chips {
  display: flex;
  gap: 6px;
}

/* ── HOTEL ───────────────────────────────────────── */
.hotel-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hotel-stars {
  color: #f4bcffc4;
  font-size: 0.95rem;
  letter-spacing: 2px;
}

.hotel-desc {
  font-size: 0.82rem;
  color: var(--gray-400);
  line-height: 1.55;
}

.amenities {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

/* ── EXPERIENCE ──────────────────────────────────── */
.exp-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exp-desc {
  font-size: 0.82rem;
  color: var(--gray-400);
  line-height: 1.55;
}

.exp-chips {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

/* ── Chips (shared) ──────────────────────────────── */
.chip {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.65);
}

/* ── Footer ──────────────────────────────────────── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
}

.price-area {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.price-orig {
  font-size: 0.8rem;
  color: var(--gray-400);
  text-decoration: line-through;
}

.price-current {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.price-main {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--pure-white);
  letter-spacing: -0.03em;
}

.price-sfx {
  font-size: 0.72rem;
  color: var(--gray-400);
  align-self: flex-end;
  margin-bottom: 3px;
}

.discount-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  align-self: flex-end;
  margin-bottom: 3px;
}

/* Kit toggle button */
.kit-toggle-btn {
  padding: 9px 18px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: var(--pure-white);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-out);
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.kit-toggle-btn span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.kit-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.45);
}

.kit-toggle-btn.added {
  background: var(--pure-white);
  color: var(--pure-black);
  border-color: transparent;
}

.kit-toggle-btn.added:hover {
  background: var(--gray-200);
}

/* Kit indicator */
.kit-indicator {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-30%);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  backdrop-filter: var(--blur-sm);
  color: var(--pure-white);
  white-space: nowrap;
}

.kit-check-enter-active {
  transition: all 0.3s var(--ease-spring);
}

.kit-check-leave-active {
  transition: all 0.2s ease;
}

.kit-check-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px) scale(0.8);
}

.kit-check-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}
</style>
