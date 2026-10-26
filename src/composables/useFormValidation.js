import { ref, computed } from 'vue';

/**
 * Validates whether a value is non-empty.
 * @param {any} value
 * @returns {boolean}
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL.
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrl(url) {
  if (!url) return true; // Optional URL check
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Form Validation Composable (useFormValidation)
 * Provides centralized, reactive validation schema execution and error state management.
 *
 * @param {object} [schemas] - Object mapping field names to array of validator functions: { field: [ { validate: fn, message: '' } ] }
 */
export function useFormValidation(schemas = {}) {
  const errors = ref({});

  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  function clearError(field) {
    if (errors.value[field]) {
      const copy = { ...errors.value };
      delete copy[field];
      errors.value = copy;
    }
  }

  function clearAllErrors() {
    errors.value = {};
  }

  function setFieldError(field, message) {
    errors.value = {
      ...errors.value,
      [field]: message
    };
  }

  function validateField(field, value, fieldSchema) {
    const rules = fieldSchema || schemas[field] || [];
    for (const rule of rules) {
      const isValid = rule.validate(value);
      if (!isValid) {
        setFieldError(field, rule.message);
        return false;
      }
    }
    clearError(field);
    return true;
  }

  function validate(formData, customSchemas = schemas) {
    const newErrors = {};
    let valid = true;

    for (const [field, rules] of Object.entries(customSchemas)) {
      const value = formData ? formData[field] : undefined;
      for (const rule of rules) {
        if (!rule.validate(value)) {
          newErrors[field] = rule.message;
          valid = false;
          break; // Stop at first rule failure for this field
        }
      }
    }

    errors.value = newErrors;
    return valid;
  }

  function getAriaProps(field) {
    const hasErr = Boolean(errors.value[field]);
    return {
      'aria-invalid': hasErr ? 'true' : 'false',
      'aria-describedby': hasErr ? `${field}-error` : undefined
    };
  }

  return {
    errors,
    hasErrors,
    validate,
    validateField,
    clearError,
    clearAllErrors,
    setFieldError,
    getAriaProps
  };
}
