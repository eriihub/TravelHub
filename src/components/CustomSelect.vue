<template>
  <div class="custom-select-wrapper" :class="{ 'is-open': isOpen }" @click.stop="toggle" tabindex="0" @blur="isOpen = false">
    <div class="custom-select-display input-glass" :class="customClass">
      <span class="custom-select-value">{{ displayValue }}</span>
    </div>
    <Transition name="dropdown">
      <div class="custom-select-dropdown glass-strong" v-if="isOpen">
        <div 
          v-for="option in options" 
          :key="option.value"
          class="custom-select-option"
          :class="{ active: modelValue === option.value }"
          @mousedown.prevent="selectOption(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true // Format: [{label: 'A', value: 'a'}, ...]
  },
  customClass: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecciona...'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);

const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected ? selected.label : props.placeholder;
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function selectOption(val) {
  emit('update:modelValue', val);
  emit('change', val);
  isOpen.value = false;
}
</script>

<style scoped>
.custom-select-wrapper {
  position: relative;
  width: 100%;
  cursor: pointer;
  outline: none;
  user-select: none;
}

.custom-select-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 32px !important;
}

.custom-select-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-select-wrapper::after {
  content: "▼";
  font-size: 0.6rem;
  color: var(--pure-white);
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.7;
  transition: transform 0.2s ease;
}

.custom-select-wrapper.is-open::after {
  transform: translateY(-50%) rotate(180deg);
}

.custom-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background: rgba(20, 20, 25, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  margin-top: 5px;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
}

.custom-select-dropdown::-webkit-scrollbar {
  width: 6px;
}
.custom-select-dropdown::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.custom-select-dropdown::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-select-dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.custom-select-option {
  padding: 12px 16px;
  color: var(--pure-white);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur-fast) ease;
  text-align: left;
}

.custom-select-option:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #c48df8;
}

.custom-select-option.active {
  background: rgba(160, 60, 185, 0.2);
  color: #d8b4fe;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s var(--ease-out);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
