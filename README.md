# Katalog SB Jaya (Next.js 15 + Supabase)

Web aplikasi resmi **Katalog SB Jaya** (Toko Suku Cadang & Onderdil Motor SB Jaya) yang dimigrasikan secara penuh dari Laravel 12 ke **Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS v4)** dengan backend **Supabase (PostgreSQL, Auth, & Storage)**.

Aplikasi ini dapat di-deploy ke **Vercel Hobby Plan (100% GRATIS tanpa perlu kartu kredit / credit card)** dan Supabase Free Tier.

---

## 🚀 Fitur Unggulan

### 1. Customer & Pengunjung Publik
- **Katalog Produk Dinamis**: Pencarian instan, filter kategori, sorting (Termurah, Termahal, Terlaris, Terbaru), dan pagination.
- **Tampilan Identik 98%+**: Replikasi pixel-perfect dari desain asli (Font Poller One + Poppins, Palet Merah SB Jaya `#DC2626`, Dark Gray `#111827`).
- **Detail Produk Interaktif**: Image zoom hover, kode part SB otomatis (`SB-00000XXX`), badge stok real-time, dan status ketersediaan.
- **Wishlist / Favorit**: Tersimpan di `localStorage` untuk pengunjung umum dan sinkron ke database untuk pengguna terdaftar.
- **Halaman About Us**: Profil SB Jaya, statistik 10+ tahun pengalaman, daftar layanan bengkel/onderdil, jam operasional, kontak WhatsApp, dan embed Google Maps.

### 2. Panel Admin Kasir (`/admin/products`, `/admin/reports`)
- **Manajemen Produk (CRUD)**: Tambah, edit, dan hapus suku cadang lengkap dengan upload foto dan modal pembuatan kategori baru instan.
- **Manajemen Kategori**: Buat dan perbarui kategori onderdil.
- **POS / Kasir Penjualan**: Keranjang kasir real-time, pencarian barcode/nama produk instan, penyesuaian kuantitas, kalkulasi total & kembalian, cetak struk nota belanja thermal otomatis (`/receipt`), dan pengurangan stok otomatis.

### 3. Panel Admin Gudang (`/admin/stock`, `/admin/stock/history`)
- **Kontrol Stok Real-time**: Indikator status stok aman (Hijau) vs menipis/kritis (Merah <= 5 pcs).
- **Penyesuaian Stok Cepat**: Quick-action modal untuk menambah atau mengoreksi stok barang masuk/keluar.
- **Audit Log Pergerakan Stok**: Riwayat pencatatan keluar/masuk suku cadang dengan tipe `RESTOCK`, `SALE`, atau `CORRECTION`.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **UI Library**: React 19, Lucide React Icons, Swiper.js
- **Styling**: Tailwind CSS v4
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL Database, Storage Buckets, Row Level Security)
- **Deployment**: [Vercel](https://vercel.com/) (Free Tier, Zero Config, No Credit Card)

---

## 💻 Panduan Menjalankan Secara Lokal

1. **Clone Repository & Masuk Direktori**:
   ```bash
   git clone https://github.com/Danadyaksa/sb-jaya.git
   cd sb-jaya
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Salin File Environment**:
   ```bash
   cp .env.example .env.local
   ```
   *(Catatan: Aplikasi memiliki mode fallback otomatis. Anda dapat langsung menjalankan web meskipun belum mengisi kunci Supabase!)*

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🌐 Panduan Deploy ke Vercel (100% GRATIS)

### Langkah 1: Buat Project Supabase (Gratis)
1. Buka [Supabase](https://supabase.com) dan buat akun gratis (bisa login menggunakan akun GitHub).
2. Buat project baru bernama `katalog-sbjaya`.
3. Masuk ke menu **SQL Editor**, buka file `supabase/schema.sql` dari repo ini, copy isinya dan klik **Run**.
4. Masuk ke menu **Storage**, buat 2 bucket publik:
   - `products` (Public: Yes)
   - `categories` (Public: Yes)
5. Masuk ke **Project Settings -> API**, salin `Project URL` dan `anon public key`.

### Langkah 2: Deploy ke Vercel (Tanpa Kartu Kredit)
1. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **Add New... -> Project**, lalu pilih repository `Danadyaksa/sb-jaya`.
3. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Project URL dari Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon public key dari Supabase)
4. Klik **Deploy**! Web Katalog SB Jaya Anda akan online dalam waktu kurang dari 2 menit.

---

## 👥 Akun Demo & Role Akses
Untuk mencoba modul Kasir atau Gudang:
- **Kasir**: Email `kasir@sbjaya.com` / Password: `password123`
- **Gudang**: Email `gudang@sbjaya.com` / Password: `password123`
- **Customer**: Pengunjung umum dapat langsung berbelanja katalog atau mendaftar di `/register`.

---

© 2026 Toko SB Jaya Motor. All Rights Reserved.
