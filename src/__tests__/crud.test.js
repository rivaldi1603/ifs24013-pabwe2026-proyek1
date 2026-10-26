import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminCrud } from '../composables/useAdminCrud.js';
import { useToast } from '../composables/useToast.js';
import { useConfirm } from '../composables/useConfirm.js';

describe('useAdminCrud composable', () => {
  const mockFetch = vi.fn();
  const mockCreate = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const { clear } = useToast();
    clear();
  });

  function createCrudInstance(options = {}) {
    return useAdminCrud({
      entityLabel: 'Destinasi',
      fetchFn: mockFetch,
      createFn: mockCreate,
      updateFn: mockUpdate,
      deleteFn: mockDelete,
      defaultForm: () => ({ name: '', category_id: 1 }),
      filterFn: (item, q) => item.name.toLowerCase().includes(q),
      onSuccess: mockOnSuccess,
      ...options
    });
  }

  it('initializes with default parameter fallbacks when options are omitted', async () => {
    const defaultCrud = useAdminCrud();
    expect(defaultCrud.items.value).toEqual([]);
    expect(defaultCrud.form.value).toEqual({});
    expect(defaultCrud.searchQuery.value).toBe('');
    expect(defaultCrud.filteredItems.value).toEqual([]);

    // load does nothing without fetchFn
    await defaultCrud.load();
    expect(defaultCrud.loading.value).toBe(false);

    // filterFn default returns true
    defaultCrud.items.value = [{ id: 1, name: 'Sample' }];
    defaultCrud.searchQuery.value = 'any';
    expect(defaultCrud.filteredItems.value).toHaveLength(1);
  });

  it('initializes with default state values and supports closeModal', () => {
    const crud = createCrudInstance();
    expect(crud.items.value).toEqual([]);
    expect(crud.loading.value).toBe(false);
    expect(crud.saving.value).toBe(false);
    expect(crud.modalOpen.value).toBe(false);
    expect(crud.form.value).toEqual({ name: '', category_id: 1 });
    expect(crud.searchQuery.value).toBe('');

    crud.modalOpen.value = true;
    crud.closeModal();
    expect(crud.modalOpen.value).toBe(false);
  });

  it('loads data successfully through fetchFn', async () => {
    const sampleData = [{ id: 1, name: 'Bukit Holbung' }];
    mockFetch.mockResolvedValueOnce({ success: true, data: sampleData });

    const crud = createCrudInstance();
    await crud.load();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(crud.items.value).toEqual(sampleData);
    expect(crud.loading.value).toBe(false);
  });

  it('handles load returning success false or null data', async () => {
    mockFetch.mockResolvedValueOnce({ success: false });
    const crud = createCrudInstance();
    await crud.load();
    expect(crud.items.value).toEqual([]);

    mockFetch.mockResolvedValueOnce({ success: true, data: null });
    await crud.load();
    expect(crud.items.value).toEqual([]);
  });

  it('handles load failure or exception gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const crud = createCrudInstance();
    await crud.load();
    expect(crud.items.value).toEqual([]);
    expect(crud.loading.value).toBe(false);
  });

  it('opens add modal with clean default form and overrides', () => {
    const crud = createCrudInstance();
    crud.openAdd({ name: 'Air Terjun Sipiso-piso' });

    expect(crud.modalOpen.value).toBe(true);
    expect(crud.form.value.name).toBe('Air Terjun Sipiso-piso');
    expect(crud.form.value.category_id).toBe(1);
  });

  it('opens edit modal populated with item data', () => {
    const crud = createCrudInstance();
    crud.openEdit({ id: 99, name: 'Tuk-tuk Siadong', category_id: 2 });

    expect(crud.modalOpen.value).toBe(true);
    expect(crud.form.value.id).toBe(99);
    expect(crud.form.value.name).toBe('Tuk-tuk Siadong');
  });

  it('saves new item using createFn when id is absent', async () => {
    mockCreate.mockResolvedValueOnce({ success: true, data: { id: 10 } });
    mockFetch.mockResolvedValueOnce({ success: true, data: [] });

    const crud = createCrudInstance();
    crud.openAdd({ name: 'Lumban Bulbul' });
    const success = await crud.save();

    expect(success).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith({ name: 'Lumban Bulbul', category_id: 1 });
    expect(crud.modalOpen.value).toBe(false);
    expect(mockOnSuccess).toHaveBeenCalledWith({ id: 10 });
  });

  it('saves item successfully when onSuccess is not provided', async () => {
    mockCreate.mockResolvedValueOnce({ success: true, data: { id: 15 } });
    mockFetch.mockResolvedValueOnce({ success: true, data: [] });

    const crud = createCrudInstance({ onSuccess: undefined });
    crud.openAdd({ name: 'Tanpa Callback' });
    const success = await crud.save();

    expect(success).toBe(true);
  });

  it('handles save failure without custom error message', async () => {
    mockCreate.mockResolvedValueOnce({ success: false });

    const crud = createCrudInstance();
    crud.openAdd({ name: 'Gagal Default Message' });
    const success = await crud.save();

    expect(success).toBe(false);
    expect(crud.saving.value).toBe(false);
  });

  it('handles save exception gracefully', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Fatal API crash'));

    const crud = createCrudInstance();
    crud.openAdd({ name: 'Gagal Crash' });
    const success = await crud.save();

    expect(success).toBe(false);
    expect(crud.saving.value).toBe(false);
  });

  it('updates existing item using updateFn when id is present', async () => {
    mockUpdate.mockResolvedValueOnce({ success: true, data: { id: 5 } });
    mockFetch.mockResolvedValueOnce({ success: true, data: [] });

    const crud = createCrudInstance();
    crud.openEdit({ id: 5, name: 'Pantai Pasir Putih Parbaba' });
    const success = await crud.save();

    expect(success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(5, { id: 5, name: 'Pantai Pasir Putih Parbaba' });
    expect(crud.modalOpen.value).toBe(false);
  });

  it('filters items correctly based on searchQuery', () => {
    const crud = createCrudInstance();
    crud.items.value = [
      { id: 1, name: 'Parapat' },
      { id: 2, name: 'Tomok' },
      { id: 3, name: 'Balige' }
    ];

    crud.searchQuery.value = 'to';
    expect(crud.filteredItems.value).toHaveLength(1);
    expect(crud.filteredItems.value[0].name).toBe('Tomok');

    crud.searchQuery.value = '';
    expect(crud.filteredItems.value).toHaveLength(3);
  });

  it('handles item deletion when confirmed', async () => {
    const { confirmState, handleConfirm } = useConfirm();
    mockDelete.mockResolvedValueOnce({ success: true });
    mockFetch.mockResolvedValueOnce({ success: true, data: [] });

    const crud = createCrudInstance();
    const removePromise = crud.remove(1, 'Pantai Bulbul');

    expect(confirmState.value.isOpen).toBe(true);
    handleConfirm();

    const result = await removePromise;
    expect(result).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('handles deletion without displayLabel and handles delete failure with default error message', async () => {
    const { handleConfirm } = useConfirm();
    mockDelete.mockResolvedValueOnce({ success: false });

    const crud = createCrudInstance();
    const removePromise = crud.remove(9);

    handleConfirm();
    const result = await removePromise;
    expect(result).toBe(false);
  });

  it('aborts item deletion when cancelled', async () => {
    const { confirmState, handleCancel } = useConfirm();

    const crud = createCrudInstance();
    const removePromise = crud.remove(2, 'Batal Hapus');

    expect(confirmState.value.isOpen).toBe(true);
    handleCancel();

    const result = await removePromise;
    expect(result).toBe(false);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('handles delete failure or exception', async () => {
    const { handleConfirm } = useConfirm();
    mockDelete.mockRejectedValueOnce(new Error('Delete error'));

    const crud = createCrudInstance();
    const removePromise = crud.remove(3, 'Item Error');

    handleConfirm();
    const result = await removePromise;
    expect(result).toBe(false);
  });
});
