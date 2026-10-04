# Desain Spesifikasi: Migrasi Total Katalog SB Jaya (Laravel ke Next.js & Supabase)

**Tanggal:** 2026-10-04  
**Status:** Menunggu Review Pengguna  
**Tujuan:** Memigrasikan seluruh aplikasi Katalog SB Jaya dari Laravel 12 ke Next.js 15 (App Router, TypeScript, Tailwind CSS) dengan Supabase sebagai Database (PostgreSQL), Autentikasi (Supabase Auth), dan File Storage (Supabase Storage).  
**Prioritas Utama:** Menjamin kemiripan visual dan tata letak hingga **98% sama persis** dengan tampilan Laravel yang sudah ada, dengan peningkatan performa, transisi animasi halus (*micro-interactions*), dan kemudahan deploy instan di Vercel secara 100% gratis.

---

## 1. Prinsip Desain & Kemiripan Visual (98% Fidelity)

Semua halaman, komponen, warna, dan tipografi akan diadaptasi langsung dari desain Blade Tailwind yang sudah dibuat:

### Tipografi
* **Font Judul / Hero / Banner:** `Poller One` (Google Fonts), huruf kapital tebal berkarakter tegas (`font-poller tracking-widest`).
* **Font Utama (Body, Tombol, Harga, Form):** `Poppins` (Google Fonts, bobot 400, 600, 700).

### Palet Warna
* **Warna Utama (Brand Red):** Merah `#DC2626` (`bg-red-600`, `hover:bg-red-700`).
* **Warna Gelap (Dark Accents):**
  * Hero & Banner Judul Halaman: `#111827` (`bg-gray-900`).
  * Sub-Navigasi Menu: `#1F2937` (`bg-gray-800`).
* **Warna Latar & Kartu:**
  * Latar Belakang Halaman: `#F3F4F6` (`bg-gray-100`).
  * Kartu Produk & Kontainer: `#FFFFFF` (`bg-white`) dengan border `#E5E7EB` (`border-gray-200`) dan bayangan lembut (`shadow-md`).
  * Footer: `#DC2626` (`bg-red-600`) dengan logo SB Jaya putih invert.

### Peningkatan Interaktivitas & Animasi
* Efek zoom lembut pada foto produk saat hover (`group-hover:scale-105 transition-transform duration-300`).
* Transisi halaman yang mulus menggunakan React Server Components.
* Carousel kategori yang responsif dan interaktif (Swiper / Embla Carousel).
* Notifikasi Toast interaktif saat berhasil menambah favorit atau mengupdate produk.

---

## 2. Struktur Komponen & Layout Global

### Header (2 Tingkat)
1. **Bagian Atas (Header Putih):**
   * Sisi Kiri: Logo resmi SB Jaya (`/images/logo.svg`).
   * Sisi Tengah: Search bar interaktif dengan tombol pencarian merah.
   * Sisi Kanan: 
     * Tombol **FAVOURITES** (ikon hati + badge jumlah).
     * Tombol **LOGIN** (jika tamu) atau Menu Dropdown User (Nama User, Role, link Dashboard Admin untuk Kasir/Gudang, dan tombol Log Out).
2. **Bagian Bawah (Sub-Navigasi Gelap):**
   * Latar abu-abu gelap (`bg-gray-800`).
   * Menu Navigasi di tengah: **HOME**, **ABOUT US**, **PRODUCTS** (tombol aktif berlatar merah `bg-red-600` dengan ikon SVG persis seperti desain Laravel).

### Footer
* Latar merah menyala (`bg-red-600`).
* Logo SB Jaya versi putih (`brightness-0 invert`).
* Navigasi Footer: Home, About Us, Products.

---

## 3. Pemetaan Halaman (Routes)

### A. Halaman Publik
| URL Next.js | Deskripsi Halaman & Komponen |
| :--- | :--- |
| `/` | **Beranda (Home):** Hero banner gelap (`CATALOGUE` Poller One, gambar katalog, tombol Explore merah), Carousel Kategori tumpang tindih (-mt-16), Section Layanan (Ganti Oli, Aksesoris, Aki, Servis), dan Grid 4 kolom Produk Baru dengan harga format Rupiah & tombol Favorit. |
| `/products` | **Katalog Produk:** Banner judul gelap, tombol "View All Categories", Toolbar Filter (Kategori, Brand, Urutan Harga Termurah/Termahal), Grid Produk, dan Paginasi. |
| `/products/[slug]` | **Detail Produk:** Breadcrumb navigasi dinamis, Galeri Gambar dengan zoom hover, Brand, Part Number (format `SB-00000XXX`), Status Stok (Hijau jika ada, Merah jika habis), Pilihan Warna, Harga besar merah, tombol Favorit, dan Tab Deskripsi Produk. |
| `/categories` | **Daftar Kategori:** Banner judul, daftar kategori dengan 4 cuplikan produk per kategori. |
| `/kategori/[slug]` | **Produk per Kategori:** Menampilkan seluruh produk dalam kategori tertentu. |
| `/about-us` | **Tentang Kami:** Banner judul, About Our Website 2 kolom dengan foto tim, Badge "10 Tahun Melayani Anda", dan layanan kami. |
| `/favorites` | **Produk Favorit:** Daftar produk yang disimpan oleh user. |

### B. Autentikasi
| URL Next.js | Deskripsi Halaman |
| :--- | :--- |
| `/login` | Form login modern (Email & Password) terhubung ke Supabase Auth. Redirect otomatis sesuai role: Kasir $\rightarrow$ `/admin/products`, Gudang $\rightarrow$ `/admin/stock`, Customer $\rightarrow$ `/`. |
| `/register` | Form pendaftaran customer baru. |
| `/profile` | Kelola profil pengguna dan ganti kata sandi. |

### C. Panel Admin & Staf (Sidebar Navigation)
Layout sidebar putih dengan informasi profil dan navigasi hak akses:
* **Role Kasir:**
  * `/admin/products`: Katalog Produk Admin (Grid kartu produk dengan menu aksi Edit & Hapus, tombol "Tambah Produk").
  * `/admin/products/tambah`: Form input produk lengkap dengan upload foto langsung ke Supabase Storage.
  * `/admin/products/[id]/edit`: Form edit produk dan preview foto.
  * `/admin/categories`: Kelola Kategori (CRUD kategori + foto).
  * `/admin/reports`: Laporan penjualan & aktivitas kasir.
  * `/admin/reports/[id]/struk`: Tampilan struk nota yang siap dicetak.
* **Role Gudang:**
  * `/admin/stock`: Kelola Stok Produk (tambah stok masuk / penyesuaian stok).
  * `/admin/stock/history`: Riwayat mutasi pergerakan barang masuk dan keluar.

---

## 4. Arsitektur Database & Penyimpanan (Supabase)

### A. Skema Tabel PostgreSQL di Supabase
1. **`profiles`**:
   * `id` (UUID, relasi ke `auth.users`)
   * `name` (text)
   * `role` (enum / text: `'customer'`, `'kasir'`, `'gudang'`)
   * `created_at` (timestamp)
2. **`categories`**:
   * `id` (bigserial primary key)
   * `name` (text)
   * `slug` (text unique)
   * `image` (text, URL Supabase Storage)
3. **`products`**:
   * `id` (bigserial primary key)
   * `name` (text)
   * `slug` (text unique)
   * `brand` (text)
   * `description` (text)
   * `price` (numeric)
   * `stock` (integer)
   * `color` (text)
   * `image` (text, URL Supabase Storage)
   * `category_id` (foreign key ke `categories.id`)
4. **`favorites`**:
   * `id` (bigserial primary key)
   * `user_id` (UUID ke `auth.users`)
   * `product_id` (bigint ke `products.id`)
5. **`reports` & `report_items`**:
   * Rekap transaksi laporan dan detail item untuk cetak struk kasir.
6. **`stock_movements`**:
   * Pencatatan riwayat stok (`product_id`, `type`, `quantity`, `notes`, `user_id`).

### B. Supabase Storage
* **Bucket:** `images` (Public).
* **Struktur Folder:**
  * `images/products/`
  * `images/categories/`
* Seluruh 32 gambar produk dan 7 gambar kategori yang ada saat ini akan di-upload ke bucket ini agar langsung aktif.

---

## 5. Rencana Tahapan Migrasi

1. **Pengarsipan Aman:** Memindahkan kodingan Laravel lama ke folder `legacy-laravel/` agar aset gambar dan kodingan lama tetap tersimpan rapi sebagai cadangan.
2. **Inisialisasi Projek:** Setup Next.js 15 (App Router, TypeScript, Tailwind CSS, Lucide React).
3. **Penyusunan Desain Basis (Tokens & Layout):** Pasang font `Poller One` & `Poppins`, susun Header dan Footer identik.
4. **Setup Supabase:** Konfigurasi skema database di Supabase dan buat script migrasi data/seed produk.
5. **Pembangunan Halaman Publik:** Home, Catalog, Detail Produk, Categories, About Us.
6. **Pembangunan Sistem Auth & Role:** Supabase Auth untuk Kasir, Gudang, dan Customer.
7. **Pembangunan Panel Admin:** CRUD Produk & Kategori dengan upload Supabase Storage, Kelola Stok Gudang, dan Laporan Kasir.
8. **Verifikasi & Deploy Vercel:** Deploy 1-klik ke Vercel via GitHub `Danadyaksa/sb-jaya`.
