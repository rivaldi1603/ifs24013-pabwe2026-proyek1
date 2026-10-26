import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToast } from '../composables/useToast.js';

describe('useToast composable', () => {
  const { toasts, add, remove, clear, success, error, warning, info } = useToast();

  beforeEach(() => {
    clear();
  });

  it('adds a toast with generated id and specified type', () => {
    const id = add('Operasi berhasil dilakukan', 'success');
    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].id).toBe(id);
    expect(toasts.value[0].message).toBe('Operasi berhasil dilakukan');
    expect(toasts.value[0].type).toBe('success');
  });

  it('supports duration 0 without setting timeout', () => {
    add('Persistent toast', 'info', 0);
    expect(toasts.value).toHaveLength(1);
  });

  it('supports convenience methods for success, error, warning, and info', () => {
    success('Berhasil');
    error('Terjadi kesalahan');
    warning('Peringatan kuota');
    info('Informasi pembaruan');

    expect(toasts.value).toHaveLength(4);
    expect(toasts.value[0].type).toBe('success');
    expect(toasts.value[1].type).toBe('error');
    expect(toasts.value[2].type).toBe('warning');
    expect(toasts.value[3].type).toBe('info');
  });

  it('removes a toast by id and handles non-existent id gracefully', () => {
    const id1 = success('Pesan 1');
    const id2 = success('Pesan 2');
    expect(toasts.value).toHaveLength(2);

    remove(id1);
    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0].id).toBe(id2);

    // Non-existent id
    remove(9999);
    expect(toasts.value).toHaveLength(1);
  });

  it('clears all active toasts', () => {
    success('Pesan 1');
    error('Pesan 2');
    expect(toasts.value).toHaveLength(2);

    clear();
    expect(toasts.value).toHaveLength(0);
  });

  it('auto removes toast after duration expires', async () => {
    vi.useFakeTimers();
    add('Pesan berdurasi singkat', 'info', 1000);
    expect(toasts.value).toHaveLength(1);

    vi.advanceTimersByTime(1000);
    expect(toasts.value).toHaveLength(0);
    vi.useRealTimers();
  });
});
