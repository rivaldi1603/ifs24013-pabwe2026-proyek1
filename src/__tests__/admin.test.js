import { describe, it, expect } from 'vitest';
import {
  ADMIN_TABS,
  DESTINATION_COLUMNS,
  SERVICE_COLUMNS,
  TRANSPORT_COLUMNS,
  CULINARY_COLUMNS,
  ARTICLE_COLUMNS,
  REVIEW_COLUMNS,
  USER_COLUMNS,
  HALAL_STATUS_OPTIONS,
  TRANSPORT_TYPE_OPTIONS
} from '../constants/admin.js';

describe('admin.js constants and schemas', () => {
  it('exports frozen ADMIN_TABS configuration array', () => {
    expect(ADMIN_TABS).toHaveLength(7);
    expect(ADMIN_TABS[0].id).toBe('destinations');
    expect(Object.isFrozen(ADMIN_TABS)).toBe(true);
  });

  it('exports column definitions for all admin entities', () => {
    expect(DESTINATION_COLUMNS.length).toBeGreaterThan(0);
    expect(SERVICE_COLUMNS.length).toBeGreaterThan(0);
    expect(TRANSPORT_COLUMNS.length).toBeGreaterThan(0);
    expect(CULINARY_COLUMNS.length).toBeGreaterThan(0);
    expect(ARTICLE_COLUMNS.length).toBeGreaterThan(0);
    expect(REVIEW_COLUMNS.length).toBeGreaterThan(0);
    expect(USER_COLUMNS.length).toBeGreaterThan(0);
  });

  it('exports valid options for select fields', () => {
    expect(HALAL_STATUS_OPTIONS).toHaveLength(2);
    expect(TRANSPORT_TYPE_OPTIONS).toHaveLength(3);
  });
});
