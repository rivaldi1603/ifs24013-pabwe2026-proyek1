import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminUsers } from '../composables/useAdminUsers.js';
import { api } from '../api.js';

describe('useAdminUsers composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const { usersList, loading, searchQuery, filteredUsers } = useAdminUsers();
    expect(usersList.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(searchQuery.value).toBe('');
    expect(filteredUsers.value).toEqual([]);
  });

  describe('loadUsers()', () => {
    it('fetches users list and toggles loading', async () => {
      const mockUsers = [
        { id: 1, name: 'Admin Toba', email: 'admin@jelajahtoba.id', organization: 'Dinas Pariwisata' },
        { id: 2, name: 'Mitra Ulos', email: 'mitra@ulos.id', organization: 'Komunitas Tenun' }
      ];
      vi.spyOn(api, 'getUsers').mockResolvedValue({ success: true, data: mockUsers });

      const { usersList, loading, loadUsers } = useAdminUsers();
      const p = loadUsers();
      expect(loading.value).toBe(true);
      await p;

      expect(loading.value).toBe(false);
      expect(usersList.value).toEqual(mockUsers);
    });

    it('handles empty response gracefully', async () => {
      vi.spyOn(api, 'getUsers').mockResolvedValue({ success: true });

      const { usersList, loadUsers } = useAdminUsers();
      await loadUsers();
      expect(usersList.value).toEqual([]);
    });

    it('handles unsuccessful API response without updating users list', async () => {
      vi.spyOn(api, 'getUsers').mockResolvedValue({ success: false });

      const { usersList, loadUsers } = useAdminUsers();
      await loadUsers();
      expect(usersList.value).toEqual([]);
    });

    it('handles network error and finishes loading', async () => {
      vi.spyOn(api, 'getUsers').mockRejectedValue(new Error('Failed to fetch'));

      const { usersList, loading, loadUsers } = useAdminUsers();
      await loadUsers();

      expect(loading.value).toBe(false);
      expect(usersList.value).toEqual([]);
    });
  });

  describe('filteredUsers computed', () => {
    it('returns all users when searchQuery is blank', () => {
      const { usersList, searchQuery, filteredUsers } = useAdminUsers();
      usersList.value = [
        { id: 1, name: 'Budi' }
      ];
      searchQuery.value = '   ';
      expect(filteredUsers.value).toEqual(usersList.value);
    });

    it('filters users by name, email, or organization', () => {
      const { usersList, searchQuery, filteredUsers } = useAdminUsers();
      usersList.value = [
        { id: 1, name: 'Poltak Sitorus', email: 'poltak@toba.id', organization: 'Pemkab Toba' },
        { id: 2, name: 'Ratna Sarumpaet', email: 'ratna@seni.id', organization: 'Yayasan Budaya' },
        { id: 3, name: null, email: null, organization: null }
      ];

      searchQuery.value = 'poltak';
      expect(filteredUsers.value).toHaveLength(1);
      expect(filteredUsers.value[0].id).toBe(1);

      searchQuery.value = 'seni.id';
      expect(filteredUsers.value).toHaveLength(1);
      expect(filteredUsers.value[0].id).toBe(2);

      searchQuery.value = 'pemkab';
      expect(filteredUsers.value).toHaveLength(1);
      expect(filteredUsers.value[0].id).toBe(1);

      searchQuery.value = 'tidak-ada';
      expect(filteredUsers.value).toHaveLength(0);
    });
  });
});
