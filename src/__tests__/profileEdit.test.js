import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useProfileEdit } from '../composables/useProfileEdit.js';
import { api } from '../api.js';

describe('useProfileEdit composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default state', () => {
    const { showEditModal, saving, editError, saveSuccessMsg } = useProfileEdit();
    expect(showEditModal.value).toBe(false);
    expect(saving.value).toBe(false);
    expect(editError.value).toBe('');
    expect(saveSuccessMsg.value).toBe('');
  });

  it('opens and closes edit modal properly', () => {
    const { showEditModal, editError, openEditModal, closeEditModal } = useProfileEdit();
    editError.value = 'Existing Error';

    openEditModal();
    expect(showEditModal.value).toBe(true);
    expect(editError.value).toBe('');

    closeEditModal();
    expect(showEditModal.value).toBe(false);
    expect(editError.value).toBe('');
  });

  describe('saveProfile()', () => {
    it('successfully updates user profile, closes modal, and clears success message after timeout', async () => {
      const updatedUser = { id: 1, name: 'Nama Baru', bio: 'Bio baru' };
      vi.spyOn(api, 'updateProfile').mockResolvedValue({ success: true, user: updatedUser });

      const { showEditModal, saving, saveSuccessMsg, saveProfile } = useProfileEdit();
      showEditModal.value = true;

      const p = saveProfile({ name: 'Nama Baru' });
      expect(saving.value).toBe(true);

      const result = await p;
      expect(result).toBe(true);
      expect(saving.value).toBe(false);
      expect(showEditModal.value).toBe(false);
      expect(saveSuccessMsg.value).toContain('Profil dan foto Anda berhasil diperbarui');

      // Fast-forward timer for timeout
      vi.advanceTimersByTime(3600);
      expect(saveSuccessMsg.value).toBe('');
    });

    it('handles business failure response with custom or default message', async () => {
      vi.spyOn(api, 'updateProfile').mockResolvedValue({ success: false, message: 'Nomor telepon tidak valid' });

      const { saving, editError, saveProfile } = useProfileEdit();
      const res = await saveProfile({ phone: 'invalid' });

      expect(res).toBe(false);
      expect(saving.value).toBe(false);
      expect(editError.value).toBe('Nomor telepon tidak valid');

      // Default message when message is missing
      vi.spyOn(api, 'updateProfile').mockResolvedValue({ success: false });
      await saveProfile({});
      expect(editError.value).toBe('Gagal menyimpan perubahan profil.');
    });

    it('handles unexpected exceptions during save gracefully', async () => {
      vi.spyOn(api, 'updateProfile').mockRejectedValue(new Error('Network Crash'));

      const { saving, editError, saveProfile } = useProfileEdit();
      const res = await saveProfile({});

      expect(res).toBe(false);
      expect(saving.value).toBe(false);
      expect(editError.value).toBe('Terjadi kesalahan server saat memperbarui profil.');
    });
  });
});
