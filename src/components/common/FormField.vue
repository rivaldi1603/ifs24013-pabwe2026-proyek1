<template>
  <div class="form-group" :class="{ 'full-width': full }">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <slot
      :id="id"
      :invalid="!!error"
      :aria="{ 'aria-invalid': !!error, 'aria-describedby': error ? `${id}-error` : undefined }"
    >
      <input
        :id="id"
        class="form-input"
        :class="{ 'input-error': error }"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </slot>
    <span v-if="error" :id="`${id}-error`" class="field-error-msg">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  error: { type: String, default: '' },
  full: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

defineEmits(['update:modelValue']);
</script>
