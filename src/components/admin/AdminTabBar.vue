<template>
  <nav class="dash-tabs fade-in" aria-label="Navigasi Tab Admin">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="dash-tab-btn"
      :class="{ active: modelValue === tab.id }"
      @click="$emit('update:modelValue', tab.id)"
    >
      {{ tab.icon }} {{ tab.label }} ({{ count(tab.id) }})
    </button>
  </nav>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  },
  count: {
    type: Function,
    default: () => 0
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.dash-tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  scrollbar-width: thin;
}

.dash-tab-btn {
  background: white;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: var(--radius-md, 8px);
  padding: 0.65rem 1.15rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color, #334155);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.dash-tab-btn:hover {
  background: var(--bg-hover, #f8fafc);
  border-color: var(--primary-color, #0284c7);
}

.dash-tab-btn.active {
  background: var(--primary-color, #0284c7);
  color: white;
  border-color: var(--primary-color, #0284c7);
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);
}
</style>
