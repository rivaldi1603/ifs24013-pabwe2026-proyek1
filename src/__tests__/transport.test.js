import { describe, it, expect } from 'vitest';
import {
  TRANSPORT_TYPES,
  TRANSPORT_TYPE_OPTIONS,
  getTransportMeta,
  getTransportIcon
} from '../constants/transport.js';

describe('transport.js constants and helpers', () => {
  it('defines frozen transport types correctly', () => {
    expect(TRANSPORT_TYPES.FERRY).toBe('ferry');
    expect(TRANSPORT_TYPES.TRADITIONAL_BOAT).toBe('traditional_boat');
    expect(TRANSPORT_TYPES.SPEEDBOAT).toBe('speedboat');
    expect(TRANSPORT_TYPES.LAND_SHUTTLE).toBe('land_shuttle');
    expect(Object.isFrozen(TRANSPORT_TYPES)).toBe(true);
  });

  it('defines 4 transport options with badge classes', () => {
    expect(TRANSPORT_TYPE_OPTIONS).toHaveLength(4);
    expect(TRANSPORT_TYPE_OPTIONS[0].value).toBe('ferry');
    expect(TRANSPORT_TYPE_OPTIONS[0].badgeClass).toBe('badge-role-admin');
    expect(Object.isFrozen(TRANSPORT_TYPE_OPTIONS)).toBe(true);
  });

  describe('getTransportMeta()', () => {
    it('returns corresponding metadata for valid types', () => {
      const ferry = getTransportMeta('ferry');
      expect(ferry.value).toBe('ferry');
      expect(ferry.label).toContain('Ferry');

      const boat = getTransportMeta('traditional_boat');
      expect(boat.value).toBe('traditional_boat');

      const speed = getTransportMeta('speedboat');
      expect(speed.value).toBe('speedboat');

      const shuttle = getTransportMeta('land_shuttle');
      expect(shuttle.value).toBe('land_shuttle');
    });

    it('falls back to default first option when type is not found or empty', () => {
      const fallback = getTransportMeta('unknown-type-xyz');
      expect(fallback).toEqual(TRANSPORT_TYPE_OPTIONS[0]);

      const nullFallback = getTransportMeta(null);
      expect(nullFallback).toEqual(TRANSPORT_TYPE_OPTIONS[0]);
    });
  });

  describe('getTransportIcon()', () => {
    it('returns appropriate emoji for each transport type', () => {
      expect(getTransportIcon(TRANSPORT_TYPES.FERRY)).toBe('🚢');
      expect(getTransportIcon(TRANSPORT_TYPES.TRADITIONAL_BOAT)).toBe('⛵');
      expect(getTransportIcon(TRANSPORT_TYPES.SPEEDBOAT)).toBe('🚤');
      expect(getTransportIcon(TRANSPORT_TYPES.LAND_SHUTTLE)).toBe('🚐');
      expect(getTransportIcon('other')).toBe('🚐');
    });
  });
});
