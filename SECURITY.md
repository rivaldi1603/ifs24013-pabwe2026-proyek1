# Security & XSS Mitigation Architecture — JelajahToba

Dokumen ini menjelaskan model ancaman, mitigasi XSS (Cross-Site Scripting), dan arsitektur autentikasi pada aplikasi JelajahToba.

---

## 1. Analisis Model Ancaman & Web Storage
- **Web Storage (`localStorage` / `sessionStorage`)**:
  - Web Storage dapat dibaca oleh konteks JavaScript yang berjalan pada origin yang sama.
  - Risiko utama: jika terdapat kerentanan **XSS (Cross-Site Scripting)**, skrip pihak ketiga yang disusupi dapat membaca token sesi.
- **Strategi Mitigasi**:
  1. **Dual Authentication Support (HttpOnly Cookie & Bearer Token)**:
     - Lapisan jaringan fetch (`src/api.js`) dikonfigurasi dengan `credentials: 'include'`.
     - Ketika server backend mengirimkan cookie `Set-Cookie: jt_token=...; HttpOnly; SameSite=Strict; Secure`, browser menangani penyimpanan dan pengiriman token secara otomatis tanpa eksposur ke JavaScript runtime.
     - Header `Authorization: Bearer <token>` tetap didukung untuk backward compatibility dan API clients.
  2. **In-Memory Caching & Session Prioritization**:
     - Token disimpan dengan prioritas `sessionStorage` (otomatis terhapus saat tab/jendela ditutup) dan di-cache dalam memori runtime (`inMemoryToken`).
     - Token yang kedaluwarsa (`isTokenExpired`) langsung dibersihkan sebelum permintaan dikirim.
  3. **Pembersihan Otomatis pada 401/403**:
     - Interceptor fetch menangani respons 401/403 dengan menghapus kredensial dari memori dan storage serta memicu event `jt:unauthorized`.

---

## 2. Praktik Pencegahan XSS di Frontend
1. **Template Escaping Otomatis**:
   - Komponen Vue menggunakan text interpolation `{{ ... }}` yang secara otomatis melakukan HTML entity escaping.
   - Aplikasi **tidak menggunakan** direktif `v-html` untuk data dinamis yang berasal dari input pengguna atau API, mencegah injeksi kode berbahaya.
2. **Validasi & Sanitasi Input**:
   - Semua input form divalidasi sebelum submit menggunakan composable `useFormValidation`.
   - Format URL divalidasi menggunakan skema aman (`http://` atau `https://`) untuk mencegah URI scheme injection seperti `javascript:...`.
3. **HTTP Security Headers pada Static Server**:
   - Server produksi (`server.js`) menerapkan header keamanan standar:
     - `X-Content-Type-Options: nosniff` (mencegah MIME confusion attacks).
     - `X-Frame-Options: DENY` (mencegah Clickjacking).
     - Directory traversal protection menggunakan `path.resolve` dan verifikasi path prefix.

---

## 3. Rekomendasi Deployment Produksi
Untuk deployment produksi terdistribusi:
- Gunakan domain atau subdomain bersama antara FE dan BE untuk mengaktifkan `HttpOnly`, `SameSite=Lax/Strict`, dan `Secure` cookies.
- Terapkan Content Security Policy (CSP) pada reverse proxy (NGINX/Vercel/Cloudflare):
  ```http
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:;
  ```
