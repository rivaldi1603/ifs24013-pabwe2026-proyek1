import { describe, it, expect, beforeEach } from 'vitest';
import { useConfirm } from '../composables/useConfirm.js';

describe('useConfirm composable', () => {
  const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

  beforeEach(() => {
    confirmState.value.isOpen = false;
    confirmState.value.resolve = null;
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
});
