import { describe, it, expect } from 'vitest';
import { useFormValidation, isRequired, isValidUrl } from '../composables/useFormValidation.js';

describe('useFormValidation composable and rules', () => {
  it('validates isRequired rule accurately', () => {
    expect(isRequired('')).toBe(false);
    expect(isRequired('   ')).toBe(false);
    expect(isRequired(null)).toBe(false);
    expect(isRequired(undefined)).toBe(false);
    expect(isRequired([])).toBe(false);

    expect(isRequired('Danau Toba')).toBe(true);
    expect(isRequired([1])).toBe(true);
    expect(isRequired(0)).toBe(true);
    expect(isRequired(false)).toBe(true);
  });

  it('validates isValidUrl rule accurately', () => {
    expect(isValidUrl('')).toBe(true); // Optional
    expect(isValidUrl(null)).toBe(true);
    expect(isValidUrl('https://example.com/image.jpg')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);

    expect(isValidUrl('not-a-valid-url')).toBe(false);
    expect(isValidUrl('ftp://invalidscheme.com')).toBe(false);
  });

  it('executes schema validation and sets errors correctly', () => {
    const { errors, hasErrors, validate, clearError, clearAllErrors, setFieldError, getAriaProps } =
      useFormValidation({
        name: [{ validate: isRequired, message: 'Nama wajib diisi' }],
        url: [{ validate: isValidUrl, message: 'URL tidak valid' }]
      });

    expect(hasErrors.value).toBe(false);

    // Invalid form
    const valid1 = validate({ name: '', url: 'bad-url' });
    expect(valid1).toBe(false);
    expect(hasErrors.value).toBe(true);
    expect(errors.value.name).toBe('Nama wajib diisi');
    expect(errors.value.url).toBe('URL tidak valid');

    // ARIA props
    const ariaName = getAriaProps('name');
    expect(ariaName['aria-invalid']).toBe('true');
    expect(ariaName['aria-describedby']).toBe('name-error');

    // Clear single error
    clearError('name');
    expect(errors.value.name).toBeUndefined();

    // Set custom error
    setFieldError('custom', 'Pesan custom');
    expect(errors.value.custom).toBe('Pesan custom');

    // Clear all
    clearAllErrors();
    expect(hasErrors.value).toBe(false);

    // Valid form
    const valid2 = validate({ name: 'Balige', url: 'https://example.com' });
    expect(valid2).toBe(true);
    expect(hasErrors.value).toBe(false);
  });

  it('validates individual field with validateField', () => {
    const { errors, validateField, clearError } = useFormValidation({
      title: [{ validate: isRequired, message: 'Judul wajib diisi' }]
    });

    const isInvalid = validateField('title', '');
    expect(isInvalid).toBe(false);
    expect(errors.value.title).toBe('Judul wajib diisi');

    const isValid = validateField('title', 'Danau Toba Indah');
    expect(isValid).toBe(true);
    expect(errors.value.title).toBeUndefined();

    // Field without schema
    expect(validateField('noSchema', 'anything')).toBe(true);

    // Field with custom inline schema override
    expect(validateField('customField', '', [{ validate: isRequired, message: 'Inline error' }])).toBe(false);
    expect(errors.value.customField).toBe('Inline error');

    // clearError on non-existent field does not mutate
    clearError('non_existent_key');
  });

  it('handles null formData and aria-props without error', () => {
    const { errors, getAriaProps, validate } = useFormValidation({
      requiredField: [{ validate: isRequired, message: 'Required' }]
    });

    const ariaClean = getAriaProps('cleanField');
    expect(ariaClean['aria-invalid']).toBe('false');
    expect(ariaClean['aria-describedby']).toBeUndefined();

    const result = validate(null);
    expect(result).toBe(false);
    expect(errors.value.requiredField).toBe('Required');
  });
});
