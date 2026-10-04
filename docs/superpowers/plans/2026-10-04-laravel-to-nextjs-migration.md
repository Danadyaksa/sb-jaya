# Migrasi Total Katalog SB Jaya ke Next.js 15 & Supabase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memigrasikan seluruh aplikasi web Katalog SB Jaya dari Laravel 12 ke Next.js 15 (App Router, TypeScript, Tailwind CSS) dengan Supabase sebagai Database, Autentikasi, dan Storage Gambar, menghasilkan tampilan antarmuka yang 98% identik dengan versi Laravel yang telah diinspeksi.

**Architecture:** Menggunakan Next.js 15 App Router dengan Server Components untuk render cepat, Server Actions untuk mutasi data, `@supabase/ssr` untuk autentikasi berbasis cookie, dan Supabase Storage untuk penyimpanan foto produk. Tampilan antarmuka meniru 100% struktur Blade, warna brand merah `#DC2626`, font `Poller One` dan `Poppins`, serta seluruh layout publik dan admin yang telah didokumentasikan lewat screenshot.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, `@supabase/ssr`, `@supabase/supabase-js`, Lucide React, Swiper React.

**Spec:** `docs/superpowers/specs/2026-10-04-laravel-to-nextjs-migration-design.md`

## Global Constraints

- Visual fidelity: 98% sama persis dengan referensi screenshot (`home_page.png`, `products_page.png`, `product_detail_page.png`, `categories_page.png`, `about_page.png`, `admin_products_page.png`, `admin_stock_page.png`, `admin_reports_page.png`).
- Font family: `Poller One` (hero & banner titles) + `Poppins` (sans body, weights 400, 600, 700).
- Brand colors: Red primary `#DC2626` (`bg-red-600`, `hover:bg-red-700`), Dark gray `#111827` (`bg-gray-900`), Dark sub-nav `#1F2937` (`bg-gray-800`), Light background `#F3F4F6` (`bg-gray-100`).
- Database & Auth: Supabase (PostgreSQL + Supabase Auth + Supabase Storage bucket `images`).
- Production build: `npm run build` wajib berhasil 100% tanpa error TypeScript dan linting.

---

### Task 1: Pengarsipan Laravel & Inisialisasi Next.js 15

**Files:**
- Create: `legacy-laravel/` (pindahkan file-file Laravel lama ke folder arsip ini)
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- Create: `app/layout.tsx`, `app/globals.css`
- Copy: `public/images/` (salin seluruh aset gambar dari Laravel ke Next.js `public/images/`)
- Copy: `public/storage/` (salin gambar produk dari `storage/app/public/` ke `public/storage/`)

**Interfaces:**
- Consumes: Aset gambar lokal (`logo.svg`, `kataloghome.png`, gambar produk, gambar kategori)
- Produces: Fondasi Next.js 15 yang siap dijalankan dengan font Google `Poller One` dan `Poppins`

- [ ] **Step 1: Pindahkan file Laravel ke `legacy-laravel/` dengan aman**
- [ ] **Step 2: Inisialisasi Next.js 15 dengan TypeScript dan Tailwind CSS**
- [ ] **Step 3: Konfigurasi font `Poller One` dan `Poppins` di `app/layout.tsx` dan `globals.css`**
- [ ] **Step 4: Salin seluruh aset gambar ke `public/images/` dan `public/storage/`**
- [ ] **Step 5: Verifikasi dev server Next.js berjalan lancar di port 3000**
- [ ] **Step 6: Commit perubahan fondasi awal**

---

### Task 2: Konfigurasi Supabase Client & Skema Database

**Files:**
- Create: `utils/supabase/server.ts`
- Create: `utils/supabase/client.ts`
- Create: `utils/supabase/middleware.ts`
- Create: `middleware.ts`
- Create: `supabase/schema.sql` (skema tabel: `profiles`, `categories`, `products`, `favorites`, `reports`, `report_items`, `stock_movements`)
- Create: `scripts/seed-supabase.ts` (script migrasi data seeder awal produk, kategori, dan akun kasir/gudang)

**Interfaces:**
- Consumes: Kredensial Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- Produces: Supabase clients untuk Server Components, Client Components, dan Middleware

- [ ] **Step 1: Install `@supabase/ssr` dan `@supabase/supabase-js`**
- [ ] **Step 2: Buat helper Supabase client (`client.ts`, `server.ts`, `middleware.ts`)**
- [ ] **Step 3: Buat file `supabase/schema.sql` dengan struktur tabel lengkap dan RLS policies**
- [ ] **Step 4: Jalankan script seeding untuk mengisi kategori, produk, dan profil staf ke Supabase**
- [ ] **Step 5: Verifikasi koneksi data Supabase dapat membaca produk dan kategori**
- [ ] **Step 6: Commit konfigurasi Supabase**

---

### Task 3: Komponen Global Layout (Header, Sub-Navbar & Footer)

**Files:**
- Create: `components/layout/Header.tsx` (Logo SB Jaya, Search bar, Favorites link, Login / User Profile menu)
- Create: `components/layout/SubNavbar.tsx` (Navigasi HOME, ABOUT US, PRODUCTS dengan ikon dan tombol aktif merah)
- Create: `components/layout/Footer.tsx` (Footer merah menyala, logo putih, copyright, link navigasi)
- Modify: `app/layout.tsx` (integrasikan Header, SubNavbar, dan Footer)

**Interfaces:**
- Consumes: Data user session dari Supabase Auth
- Produces: Header 2-tingkat dan Footer yang 100% identik dengan `resources/views/layouts/partials/`

- [ ] **Step 1: Implementasi `Header.tsx` lengkap dengan Search input, Fav link, dan login state**
- [ ] **Step 2: Implementasi `SubNavbar.tsx` dengan ikon SVG dan penanda rute aktif merah**
- [ ] **Step 3: Implementasi `Footer.tsx` merah dengan logo terbalik (brightness-0 invert)**
- [ ] **Step 4: Uji responsivitas navigasi pada ukuran layar mobile dan desktop**
- [ ] **Step 5: Commit komponen global layout**

---

### Task 4: Halaman Utama (Home Page `/`)

**Files:**
- Create: `components/home/HeroSection.tsx` (Banner gelap, `CATALOGUE` Poller One, kataloghome.png, tombol Explore)
- Create: `components/home/CategoryCarousel.tsx` (Carousel kartu kategori Swiper tumpang tindih -mt-16)
- Create: `components/home/ServicesSection.tsx` (4 layanan: Ganti Oli, Aksesoris, Aki, Servis)
- Create: `components/home/NewProductsSection.tsx` (Grid produk baru 4 kolom dengan harga Rp dan tombol Fav)
- Create: `components/product/ProductCard.tsx` (Kartu produk standar dengan hover zoom, nama, stok, harga)
- Modify: `app/page.tsx` (gabungkan seluruh section Home)

**Interfaces:**
- Consumes: Query data kategori dan produk terbaru dari Supabase
- Produces: Halaman beranda yang 100% identik dengan screenshot `home_page.png`

- [ ] **Step 1: Buat `HeroSection.tsx` dengan tipografi dan gambar yang sama persis**
- [ ] **Step 2: Buat `CategoryCarousel.tsx` menggunakan Swiper dengan dot paginasi merah**
- [ ] **Step 3: Buat `ServicesSection.tsx` dengan 4 ikon dan teks layanan**
- [ ] **Step 4: Buat `ProductCard.tsx` dan `NewProductsSection.tsx` dengan format harga Rupiah**
- [ ] **Step 5: Render `app/page.tsx` dan bandingkan langsung dengan `home_page.png`**
- [ ] **Step 6: Commit halaman beranda**

---

### Task 5: Halaman Katalog Produk (`/products`) & Detail Produk (`/products/[slug]`)

**Files:**
- Create: `components/ui/PageTitleBanner.tsx` (Banner judul halaman gelap dengan Poller One dan breadcrumbs)
- Create: `components/product/ProductFilterToolbar.tsx` (Dropdown kategori, brand, sort harga, tombol Apply & Reset)
- Create: `app/products/page.tsx` (Halaman katalog lengkap dengan filter dan paginasi)
- Create: `app/products/[slug]/page.tsx` (Halaman detail produk lengkap: galeri zoom, part number, stok, spek, deskripsi tab)

**Interfaces:**
- Consumes: URL search parameters (`category`, `brand`, `sort`, `search`, `page`)
- Produces: Halaman katalog dan detail produk yang 100% identik dengan `products_page.png` dan `product_detail_page.png`

- [ ] **Step 1: Buat `PageTitleBanner.tsx` yang dapat digunakan ulang di semua halaman**
- [ ] **Step 2: Buat `ProductFilterToolbar.tsx` untuk filter kategori, brand, dan pengurutan harga**
- [ ] **Step 3: Buat `app/products/page.tsx` dengan grid produk dan paginasi interaktif**
- [ ] **Step 4: Buat `app/products/[slug]/page.tsx` dengan layout 2-kolom galeri dan spesifikasi**
- [ ] **Step 5: Uji filter produk dan verifikasi tampilan dengan screenshot referensi**
- [ ] **Step 6: Commit halaman katalog dan detail produk**

---

### Task 6: Halaman Kategori (`/categories`, `/kategori/[slug]`) & About Us (`/about-us`)

**Files:**
- Create: `app/categories/page.tsx` (Daftar semua kategori beserta cuplikan 4 produk per kategori)
- Create: `app/kategori/[slug]/page.tsx` (Halaman produk khusus satu kategori)
- Create: `app/about-us/page.tsx` (Halaman profil SB Jaya, 2-kolom cerita, badge "10 Tahun", foto tim)

**Interfaces:**
- Consumes: Query kategori dan produk terkait dari Supabase
- Produces: Tampilan yang 100% identik dengan `categories_page.png` dan `about_page.png`

- [ ] **Step 1: Implementasi `app/categories/page.tsx` dengan section header dan grid produk per kategori**
- [ ] **Step 2: Implementasi `app/kategori/[slug]/page.tsx` untuk navigasi kategori spesifik**
- [ ] **Step 3: Implementasi `app/about-us/page.tsx` lengkap dengan badge 10 tahun dan foto tim**
- [ ] **Step 4: Uji navigasi kategori dan verifikasi visual dengan screenshot referensi**
- [ ] **Step 5: Commit halaman kategori dan About Us**

---

### Task 7: Sistem Autentikasi & Hak Akses Berdasarkan Role

**Files:**
- Create: `app/login/page.tsx` (Halaman login kartu terpusat dengan logo SB Jaya)
- Create: `app/register/page.tsx` (Halaman pendaftaran akun customer)
- Create: `app/actions/auth.ts` (Server Actions untuk login, register, dan logout)
- Modify: `middleware.ts` (Proteksi rute `/admin/*` hanya untuk role `kasir` dan `gudang`)

**Interfaces:**
- Consumes: Supabase Auth credentials
- Produces: Alur login/logout yang mengarahkan kasir ke `/admin/products`, gudang ke `/admin/stock`, dan customer ke `/`

- [ ] **Step 1: Implementasi `app/login/page.tsx` persis seperti `login_page.png`**
- [ ] **Step 2: Implementasi `app/register/page.tsx`**
- [ ] **Step 3: Buat Server Actions `auth.ts` untuk autentikasi Supabase yang aman**
- [ ] **Step 4: Pasang middleware untuk memvalidasi role kasir dan gudang**
- [ ] **Step 5: Uji login kasir (`kasir@sbjaya.com`) dan gudang (`gudang@sbjaya.com`)**
- [ ] **Step 6: Commit sistem autentikasi**

---

### Task 8: Panel Admin Kasir (CRUD Produk, Kategori, Laporan & Struk)

**Files:**
- Create: `app/admin/layout.tsx` (Sidebar admin dengan logo, info user, menu kasir/gudang, dan tombol logout)
- Create: `app/admin/products/page.tsx` (Katalog produk admin dengan menu 3-titik edit/hapus dan tombol Tambah Produk)
- Create: `app/admin/products/tambah/page.tsx` (Form tambah produk dengan upload foto ke Supabase Storage)
- Create: `app/admin/products/[id]/edit/page.tsx` (Form edit produk)
- Create: `app/admin/categories/page.tsx` (Kelola kategori dengan foto)
- Create: `app/admin/reports/page.tsx` (Tabel laporan transaksi penjualan kasir)
- Create: `app/admin/reports/[id]/struk/page.tsx` (Tampilan struk transaksi yang siap cetak / print)
- Create: `app/actions/products.ts`, `app/actions/categories.ts`, `app/actions/reports.ts`

**Interfaces:**
- Consumes: Supabase Storage bucket `images` dan tabel PostgreSQL
- Produces: Panel kasir lengkap yang identik dengan `admin_products_page.png`, `admin_categories_page.png`, `admin_reports_page.png`

- [ ] **Step 1: Buat `app/admin/layout.tsx` dengan sidebar navigasi kasir/gudang**
- [ ] **Step 2: Buat `app/admin/products/page.tsx` dengan grid kartu dan dropdown aksi 3-titik**
- [ ] **Step 3: Buat form tambah & edit produk dengan upload gambar langsung ke Supabase Storage**
- [ ] **Step 4: Buat halaman kelola kategori dan form upload kategori**
- [ ] **Step 5: Buat halaman laporan kasir dan tampilan cetak struk**
- [ ] **Step 6: Uji fitur upload foto produk dan pastikan foto tersimpan di Supabase Storage**
- [ ] **Step 7: Commit panel admin kasir**

---

### Task 9: Panel Admin Gudang (Kelola Stok & Riwayat Mutasi)

**Files:**
- Create: `app/admin/stock/page.tsx` (Daftar stok produk dengan tombol cepat Stok Masuk / Stok Keluar)
- Create: `app/admin/stock/riwayat/page.tsx` (Tabel riwayat mutasi stok barang)
- Create: `app/actions/stock.ts` (Server Action penyesuaian stok dan pencatatan mutasi)

**Interfaces:**
- Consumes: Tabel `products` dan `stock_movements` di Supabase
- Produces: Panel gudang yang identik dengan `admin_stock_page.png` dan `admin_stock_history_page.png`

- [ ] **Step 1: Implementasi `app/admin/stock/page.tsx` dengan modal penyesuaian stok masuk/keluar**
- [ ] **Step 2: Implementasi `app/admin/stock/riwayat/page.tsx` dengan tabel log mutasi barang**
- [ ] **Step 3: Uji penambahan stok barang dan pastikan angka stok terupdate secara realtime**
- [ ] **Step 4: Commit panel admin gudang**

---

### Task 10: Fitur Favorit (Wishlist)

**Files:**
- Create: `components/product/FavoriteButton.tsx` (Tombol hati interaktif dengan update optimis)
- Create: `app/favorites/page.tsx` (Halaman daftar produk yang disimpan oleh user)
- Create: `app/actions/favorites.ts` (Server Action tambah/hapus favorit di Supabase)

**Interfaces:**
- Consumes: Tabel `favorites` di Supabase
- Produces: Fitur favorit interaktif yang menggantikan fungsi Livewire `favorite-button`

- [ ] **Step 1: Implementasi Server Action `favorites.ts`**
- [ ] **Step 2: Buat `FavoriteButton.tsx` dengan feedback animasi klik dan status favorit**
- [ ] **Step 3: Buat `app/favorites/page.tsx` untuk menampilkan semua produk favorit user**
- [ ] **Step 4: Uji tambah/hapus favorit dan verifikasi counter di Header**
- [ ] **Step 5: Commit fitur favorit**

---

### Task 11: Pengujian Menyeluruh & Kesiapan Deploy Vercel

**Files:**
- Create: `README.md` (Dokumentasi lengkap proyek Next.js dan variabel lingkungan)
- Verify: `next.config.ts`, `package.json`

**Interfaces:**
- Consumes: Seluruh modul aplikasi
- Produces: Repositori yang siap 100% di-deploy ke Vercel tanpa error

- [ ] **Step 1: Jalankan `npm run build` dan pastikan tidak ada error tipe data atau sintaks**
- [ ] **Step 2: Lakukan perbandingan visual akhir dengan seluruh screenshot referensi**
- [ ] **Step 3: Siapkan daftar Environment Variables untuk Vercel**
- [ ] **Step 4: Push commit final ke GitHub `Danadyaksa/sb-jaya`**
