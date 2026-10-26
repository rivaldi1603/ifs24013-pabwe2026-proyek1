import { describe, it, expect, beforeEach } from 'vitest';
import { useConfirm } from '../composables/useConfirm.js';

describe('useConfirm composable', () => {
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

  beforeEach(() => {
    confirmState.value.isOpen = false;
    confirmState.value.resolve = null;
  });

  it('opens confirmation modal with default parameters when no options provided', () => {
    confirm();
    expect(confirmState.value.isOpen).toBe(true);
    expect(confirmState.value.title).toBe('Konfirmasi Tindakan');
    expect(confirmState.value.message).toBe('Apakah Anda yakin ingin melanjutkan tindakan ini?');
    expect(confirmState.value.confirmText).toBe('Ya, Lanjutkan');
    expect(confirmState.value.cancelText).toBe('Batal');
    expect(confirmState.value.danger).toBe(false);
  });

  it('opens confirmation modal with customized parameters', () => {
    confirm({
      title: 'Hapus Item',
      message: 'Yakin hapus data ini?',
      confirmText: 'Hapus Sekarang',
      cancelText: 'Batalkan',
      danger: true
    });

    expect(confirmState.value.isOpen).toBe(true);
    expect(confirmState.value.title).toBe('Hapus Item');
    expect(confirmState.value.message).toBe('Yakin hapus data ini?');
    expect(confirmState.value.confirmText).toBe('Hapus Sekarang');
    expect(confirmState.value.cancelText).toBe('Batalkan');
    expect(confirmState.value.danger).toBe(true);
  });

  it('resolves promise to true when handleConfirm is called', async () => {
    const promise = confirm({ title: 'Konfirmasi', message: 'Lanjutkan?' });
    expect(confirmState.value.isOpen).toBe(true);

    handleConfirm();
    const result = await promise;

    expect(result).toBe(true);
    expect(confirmState.value.isOpen).toBe(false);
  });

  it('resolves promise to false when handleCancel is called', async () => {
    const promise = confirm({ title: 'Konfirmasi', message: 'Lanjutkan?' });
    expect(confirmState.value.isOpen).toBe(true);

    handleCancel();
    const result = await promise;

    expect(result).toBe(false);
    expect(confirmState.value.isOpen).toBe(false);
  });

  it('handles handleConfirm and handleCancel safely when resolve is null', () => {
    confirmState.value.isOpen = true;
    confirmState.value.resolve = null;

    handleConfirm();
    expect(confirmState.value.isOpen).toBe(false);

    confirmState.value.isOpen = true;
    confirmState.value.resolve = null;

    handleCancel();
    expect(confirmState.value.isOpen).toBe(false);
  });
});
