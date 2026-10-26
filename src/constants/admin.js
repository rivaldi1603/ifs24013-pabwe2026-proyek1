/**
 * Admin Panel Constants and Configurations
 * Centralizes tab definitions, table schemas, default form states, and master options.
 */

export const ADMIN_TABS = Object.freeze([
  { id: 'destinations', label: 'Destinasi', icon: '📍', themeClass: 'theme-blue' },
  { id: 'services', label: 'Jasa & Homestay', icon: '🧶', themeClass: 'theme-green' },
  { id: 'transport', label: 'Jadwal Ferry', icon: '🚢', themeClass: 'theme-indigo' },
  { id: 'culinary', label: 'Kuliner Khas', icon: '🍲', themeClass: 'theme-orange' },
  { id: 'articles', label: 'Cerita Toba', icon: '📖', themeClass: 'theme-amber' },
  { id: 'reviews', label: 'Moderasi Ulasan', icon: '💬', themeClass: 'theme-red' },
  { id: 'users', label: 'Pengguna', icon: '👥', themeClass: 'theme-purple' }
]);

export const DESTINATION_COLUMNS = Object.freeze([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nama Destinasi' },
  { key: 'regency', label: 'Kabupaten' },
  { key: 'price', label: 'Tarif' },
  { key: 'rating', label: 'Rating' },
  { key: 'actions', label: 'Aksi' }
]);

export const SERVICE_COLUMNS = Object.freeze([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Layanan' },
  { key: 'provider', label: 'Penyedia / Warga' },
  { key: 'service_type', label: 'Tipe' },
  { key: 'price', label: 'Tarif' },
  { key: 'contact_wa', label: 'WhatsApp' },
  { key: 'actions', label: 'Aksi' }
]);

export const TRANSPORT_COLUMNS = Object.freeze([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nama Rute Penyeberangan' },
  { key: 'transport_type', label: 'Jenis' },
  { key: 'route_direction', label: 'Arah / Lintasan' },
  { key: 'departure_hours', label: 'Jadwal / Jam Berangkat' },
  { key: 'price_display', label: 'Tarif' },
  { key: 'actions', label: 'Aksi' }
]);

export const CULINARY_COLUMNS = Object.freeze([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nama Kuliner' },
  { key: 'halal_status', label: 'Status Halal' },
  { key: 'origin_region', label: 'Asal Daerah' },
  { key: 'description', label: 'Deskripsi Singkat' },
  { key: 'actions', label: 'Aksi' }
]);

export const ARTICLE_COLUMNS = Object.freeze([
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Judul Cerita / Artikel' },
  { key: 'regency', label: 'Wilayah Kabupaten' },
  { key: 'summary', label: 'Ringkasan Cerita' },
  { key: 'published_at', label: 'Tanggal Publikasi' },
  { key: 'actions', label: 'Aksi' }
]);

export const REVIEW_COLUMNS = Object.freeze([
  { key: 'id', label: 'ID' },
  { key: 'reviewer', label: 'Pengulas' },
  { key: 'target', label: 'Target Tempat' },
  { key: 'rating', label: 'Rating' },
  { key: 'review_text', label: 'Komentar' },
  { key: 'created_at', label: 'Waktu' },
  { key: 'actions', label: 'Aksi' }
]);

export const USER_COLUMNS = Object.freeze([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nama Lengkap' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'phone', label: 'Nomor HP' },
  { key: 'bio', label: 'Bio Pengguna' },
  { key: 'created_at', label: 'Terdaftar' }
]);

export const HALAL_STATUS_OPTIONS = Object.freeze([
  { value: 'Halal', label: 'Halal (Ikan / Sayur / Ayam / Kue)' },
  { value: 'Non-Halal', label: 'Non-Halal (Tradisional Khas)' }
]);

export const TRANSPORT_TYPE_OPTIONS = Object.freeze([
  { value: 'ferry', label: '🚢 Ferry KMP', badgeClass: 'badge-role-admin' },
  { value: 'traditional_boat', label: '⛵ Kapal Tradisional', badgeClass: 'badge-role-partner' },
  { value: 'shuttle', label: '🚐 Shuttle Darat', badgeClass: 'badge-role-user' }
]);
