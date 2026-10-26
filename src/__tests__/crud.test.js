import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAdminCrud } from '../composables/useAdminCrud.js';
import { useToast } from '../composables/useToast.js';
import { useConfirm } from '../composables/useConfirm.js';

describe('useAdminCrud composable', () => {
  const mockFetch = vi.fn();
  const mockCreate = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const { clear } = useToast();
    clear();
  });

  function createCrudInstance() {
    return useAdminCrud({
      entityLabel: 'Destinasi',
      fetchFn: mockFetch,
      createFn: mockCreate,
      updateFn: mockUpdate,
      deleteFn: mockDelete,
      defaultForm: () => ({ name: '', category_id: 1 }),
      filterFn: (item, q) => item.name.toLowerCase().includes(q)
    });
  }

  it('initializes with default state values', () => {
    const crud = createCrudInstance();
    expect(crud.items.value).toEqual([]);
    expect(crud.loading.value).toBe(false);
    expect(crud.saving.value).toBe(false);
    expect(crud.modalOpen.value).toBe(false);
    expect(crud.form.value).toEqual({ name: '', category_id: 1 });
    expect(crud.searchQuery.value).toBe('');
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

  it('handles item deletion with confirmation', async () => {
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
});
