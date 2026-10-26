/**
 * Transport Constants & Single Source of Truth for Mobility in Lake Toba
 */

export const TRANSPORT_TYPES = Object.freeze({
  FERRY: 'ferry',
  TRADITIONAL_BOAT: 'traditional_boat',
  SPEEDBOAT: 'speedboat',
  LAND_SHUTTLE: 'land_shuttle'
});

export const TRANSPORT_TYPE_OPTIONS = Object.freeze([
  { value: TRANSPORT_TYPES.FERRY, label: '🚢 Kapal Ferry (KMP)', badgeClass: 'badge-role-admin' },
  { value: TRANSPORT_TYPES.TRADITIONAL_BOAT, label: '⛵ Kapal Tradisional Kayu', badgeClass: 'badge-role-partner' },
  { value: TRANSPORT_TYPES.SPEEDBOAT, label: '🚤 Speedboat Cepat', badgeClass: 'badge-role-partner' },
  { value: TRANSPORT_TYPES.LAND_SHUTTLE, label: '🚐 Shuttle / Bus Darat', badgeClass: 'badge-role-user' }
]);

/**
 * Retrieves metadata for a given transport type.
 * @param {string} type
 * @returns {{ value: string, label: string, badgeClass: string }}
 */
export const getTransportMeta = (type) =>
  TRANSPORT_TYPE_OPTIONS.find(o => o.value === type) ?? TRANSPORT_TYPE_OPTIONS[0];

/**
 * Helper to get the representative emoji icon for a transport type.
 * @param {string} type
 * @returns {string}
 */
export const getTransportIcon = (type) => {
  if (type === TRANSPORT_TYPES.FERRY) return '🚢';
  if (type === TRANSPORT_TYPES.TRADITIONAL_BOAT) return '⛵';
  if (type === TRANSPORT_TYPES.SPEEDBOAT) return '🚤';
  return '🚐';
};
