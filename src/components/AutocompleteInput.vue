<template>
  <div class="autocomplete-wrap" ref="wrapRef">
    <div class="autocomplete-input-row">
      <input
        class="input-glass"
        :type="type"
        :placeholder="placeholder"
        :id="id"
        autocomplete="off"
        :value="modelValue"
        @input="onInput"
        @focus="onFocus"
        @keydown.arrow-down.prevent="moveDown"
        @keydown.arrow-up.prevent="moveUp"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="close"
      />
      <span v-if="loading" class="autocomplete-spinner">⟳</span>
    </div>

    <Transition name="ac-drop">
      <ul v-if="open && suggestions.length" class="ac-list" role="listbox">
        <li
          v-for="(s, i) in suggestions"
          :key="s.value"
          class="ac-item"
          :class="{ highlighted: i === highlighted }"
          role="option"
          @mousedown.prevent="selectItem(s)"
          @mouseover="highlighted = i"
        >
          <span class="ac-icon">{{ s.icon }}</span>
          <span class="ac-label">{{ s.label }}</span>
          <span class="ac-sub" v-if="s.sub">{{ s.sub }}</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  id:    { type: String, default: '' },
  type:  { type: String, default: 'text' },
  // 'hotel' | 'flight'
  mode:  { type: String, default: 'hotel' },
});

// v-model for display text + separate emit for resolved meta (dest_id / iata)
const emit = defineEmits(['update:modelValue', 'select-meta']);

const HOST = 'booking-com15.p.rapidapi.com';
const BASE = `https://${HOST}/api/v1`;

function getKey() { return import.meta.env.VITE_RAPIDAPI_KEY || ''; }

const wrapRef     = ref(null);
const open        = ref(false);
const loading     = ref(false);
const suggestions = ref([]);
const highlighted = ref(-1);

let debounceTimer = null;

function onInput(e) {
  const val = e.target.value;
  emit('update:modelValue', val);
  // Notify parent that user is typing freely → clear previously saved meta
  emit('select-meta', null);

  if (val.length < 2) { suggestions.value = []; open.value = false; return; }
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchSuggestions(val), 320);
}

function onFocus() {
  if (suggestions.value.length) open.value = true;
}

async function fetchSuggestions(query) {
  const key = getKey();
  if (!key) return;

  loading.value = true;
  try {
    const endpoint = props.mode === 'flight'
      ? `${BASE}/flights/searchDestination?query=${encodeURIComponent(query)}`
      : `${BASE}/hotels/searchDestination?query=${encodeURIComponent(query)}`;

    const res  = await fetch(endpoint, {
      headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': HOST }
    });
    const json = await res.json();
    const items = json.data || [];

    suggestions.value = items.slice(0, 8).map(item => {
      if (props.mode === 'flight') {
        const icon = item.type === 'AIRPORT' ? '✈' : '🏙';
        return {
          label: item.name || item.cityName || item.code || item.id,
          sub:   item.countryName || item.regionName || '',
          icon,
          // meta for flight search
          meta: {
            type: 'flight',
            iata: item.code || item.id,
            name: item.name || item.cityName,
          },
        };
      } else {
        const iconMap = { city: '🏙', district: '🗺', airport: '✈', landmark: '⭐' };
        return {
          label: item.name,
          sub:   item.region ? `${item.region}, ${item.country}` : (item.country || ''),
          icon:  iconMap[item.dest_type] || '📍',
          // meta for hotel/experience search — pre-resolved dest_id!
          meta: {
            type:      'hotel',
            dest_id:   item.dest_id,
            dest_type: item.dest_type || 'city',
            name:      item.name,
          },
        };
      }
    });

    highlighted.value = -1;
    open.value = suggestions.value.length > 0;
  } catch (err) {
    console.warn('[Autocomplete] error:', err.message);
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
}

function selectItem(s) {
  emit('update:modelValue', s.label);
  emit('select-meta', s.meta);   // ← pass dest_id / iata to parent
  suggestions.value = [];
  open.value = false;
}

function selectHighlighted() {
  if (highlighted.value >= 0 && suggestions.value[highlighted.value]) {
    selectItem(suggestions.value[highlighted.value]);
  }
}

function moveDown() { if (open.value) highlighted.value = Math.min(highlighted.value + 1, suggestions.value.length - 1); }
function moveUp()   { if (open.value) highlighted.value = Math.max(highlighted.value - 1, 0); }
function close()    { open.value = false; highlighted.value = -1; }

function onClickOutside(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) close();
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<style scoped>
.autocomplete-wrap {
  position: relative;
  width: 100%;
}

.autocomplete-input-row {
  position: relative;
  display: flex;
  align-items: center;
}

.autocomplete-spinner {
  position: absolute;
  right: 12px;
  color: rgba(255,255,255,0.4);
  font-size: 1rem;
  animation: spin 0.8s linear infinite;
  pointer-events: none;
}

@keyframes spin { to { transform: rotate(360deg); } }

.ac-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 999;
  list-style: none;
  margin: 0;
  padding: 6px;
  background: rgba(10, 10, 10, 0.94);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 12px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.7);
  max-height: 280px;
  overflow-y: auto;
}

.ac-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.ac-item.highlighted,
.ac-item:hover {
  background: rgba(255,255,255,0.1);
}

.ac-icon {
  font-size: 1rem;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.ac-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  flex: 1;
  text-align: left;
}

.ac-sub {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.45);
  white-space: nowrap;
}

.ac-drop-enter-active { transition: all 0.18s ease; }
.ac-drop-leave-active { transition: all 0.12s ease; }
.ac-drop-enter-from  { opacity: 0; transform: translateY(-6px); }
.ac-drop-leave-to    { opacity: 0; transform: translateY(-4px); }
</style>
