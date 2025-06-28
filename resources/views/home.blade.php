@extends('layouts.main')
@section('content')

    {{-- Bagian 1: Hero Section --}}
    <section class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-16">
            <h2 class="text-center text-4xl font-poller tracking-widest uppercase mb-12">CATALOGUE</h2>
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <img src="{{ asset('images/kataloghome.png') }}" alt="Aksesoris Dashboard Mobil" class="rounded-lg shadow-lg w-full">
                </div>
                <div class="text-center md:text-left">
                    <h1 class="text-4xl lg:text-5xl font-poller leading-tight mb-4">
                        Cari Aksesoris Terbaik Untuk Mobilmu
                    </h1>
                    <p class="text-lg text-gray-400 mb-8">Aksesoris Mobil Premium</p>
                    <a href="#produk-baru" class="inline-block bg-red-600 text-white font-bold text-lg px-8 py-3 rounded-md hover:bg-red-700 transition-colors duration-300">Explore</a>
                </div>
            </div>
        </div>
    </section>

    {{-- Bagian 2: Cuplikan Kategori (Carousel) --}}
<section class="bg-white py-16 -mt-16 relative z-10">
    <div class="container mx-auto px-4">

        <div class="swiper category-swiper">
            <div class="swiper-wrapper">

                {{-- Kita loop semua kategori dari database --}}
                @foreach ($categories as $category)
                    <div class="swiper-slide">
                        {{-- Ini adalah kode kartu kategori kita, sekarang di dalam slide --}}
                        <a href="{{ route('products.by_category', $category) }}" class="block group">
                            <div class="relative overflow-hidden rounded-lg shadow-lg border bg-white p-4 text-center h-full">
                                <img src="{{ $category->image ? asset('storage/' . $category->image) : 'https://via.placeholder.com/300x200/EEEEEE/000000?text=No+Image' }}" alt="{{ $category->name }}" class="rounded-lg w-full h-48 object-cover">
                                <h3 class="text-xl font-bold uppercase">{{ $category->name }}</h3>
                                <p class="text-sm text-gray-500">Shop All &rarr;</p>
                            </div>
                        </a>
                    </div>
                @endforeach

            </div>

            {{-- Opsional: Tombol Navigasi & Paginasi --}}
            <div class="swiper-button-next text-red-600"></div>
            <div class="swiper-button-prev text-red-600"></div>
            <div class="swiper-pagination"></div>
        </div>

    </div>
</section>

    {{-- Bagian 3: Layanan Kami --}}
    <section class="bg-gray-50 py-16">
        <div class="container mx-auto px-4 text-center">
            <h3 class="text-red-600 font-bold tracking-wider mb-2">LAYANAN</h3>
            <h2 class="text-4xl font-poller text-gray-900 mb-12">PILIH LAYANAN KAMI</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div class="flex flex-col items-center space-y-3"><svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z"></path></svg><span class="font-semibold text-gray-700">Ganti Oli</span></div>
                <div class="flex flex-col items-center space-y-3"><svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg><span class="font-semibold text-gray-700">Aksesoris Mobil</span></div>
                <div class="flex flex-col items-center space-y-3"><svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.49l-1.955 5.236a1 1 0 01-1.858.068l-2.114-5.96a1 1 0 01.37-1.16l5.236-1.955a1 1 0 011.16.37z"></path></svg><span class="font-semibold text-gray-700">Cek dan Ganti Aki</span></div>
                <div class="flex flex-col items-center space-y-3"><svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg><span class="font-semibold text-gray-700">Servis</span></div>
            </div>
        </div>
    </section>

    {{-- Bagian 4: Produk Baru --}}
    <section id="produk-baru" class="bg-white py-16">
        <div class="container mx-auto px-4">
            <div class="text-center"><h3 class="text-red-600 font-bold tracking-wider mb-2">PRODUK</h3><h2 class="text-4xl font-poller text-gray-900 mb-8">PRODUK BARU</h2></div>
            {{-- Grid Produk --}}
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

    @forelse ($newProducts as $product)
        {{-- Kartu Produk Dinamis --}}
        <div class="border border-gray-200 rounded-lg group overflow-hidden">
    <a href="{{ route('products.show', $product) }}">
        <div class="bg-white p-4"><img src="{{ $product->image ? asset('storage/' . $product->image) : 'https://via.placeholder.com/300x300/F3F4F6/000000?text=No+Image' }}" class="w-full h-56 object-contain"></div>
    </a>
    <div class="p-4">
        <a href="{{ route('products.show', $product) }}"><h3 class="font-bold text-gray-800 text-lg mb-2 truncate hover:text-red-600" title="{{ $product->name }}">{{ $product->name }}</h3></a>
        <p class="text-sm text-gray-500 mb-2">STOK TERSEDIA : {{ $product->stock }}</p>
        <p class="text-2xl font-extrabold text-gray-900 mb-4">Rp {{ number_format($product->price, 0, ',', '.') }}</p>
        {{-- Tombol Add to Fav --}}
{{-- ▼▼▼ GANTI DENGAN SATU BARIS INI ▼▼▼ --}}

{{-- ▼▼▼ GANTI SATU BARIS LIVEWIRE DI ATAS DENGAN BLOK DI BAWAH INI ▼▼▼ --}}

@auth
    {{-- Jika user sudah login, TAMPILKAN component Livewire yang interaktif --}}
    @livewire('favorite-button', ['product' => $product], key($product->id))
@else
    {{-- Jika user adalah tamu, TAMPILKAN tombol biasa yang mengarah ke halaman login --}}
    <a href="{{ route('login') }}" class="w-full block text-center bg-gray-300 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-400 transition-colors">
        Login to Fav
    </a>
@endauth
    </div>
</div>
    @empty
        {{-- Tampilan jika tidak ada produk sama sekali --}}
        <div class="col-span-4 text-center py-8 text-gray-500">
            <p>Belum ada produk baru untuk ditampilkan.</p>
        </div>
    @endforelse

</div>
        </div>
    </section>

    {{-- ▼▼▼ GANTI DENGAN KODE BARU INI ▼▼▼ --}}

{{-- Bagian 5: Kategori Teratas (Desain Baru) --}}
<section class="bg-white py-16">
    <div class="container mx-auto px-4">
        <div class="text-center">
            <h3 class="text-red-600 font-bold tracking-wider mb-2">SEDANG TRENDING</h3>
            <h2 class="text-4xl font-poller text-gray-900 mb-12">KATEGORI TERATAS</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            {{-- Kita loop data $categories dari controller, dan batasi hanya 4 sesuai desain --}}
            @forelse ($categories->take(4) as $category)
                {{-- Kartu Kategori Dinamis --}}
                <div class="border border-gray-200 rounded-lg p-6 flex items-center justify-between gap-6">
                    {{-- Teks --}}
                    <div class="w-1/2">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2 uppercase">{{ $category->name }}</h3>
                        <a href="{{ route('products.by_category', $category) }}" class="text-gray-500 hover:text-red-600 text-sm">
                            View All &rarr;
                        </a>
                    </div>
                    {{-- Gambar --}}
                    <div class="w-1/2">
                         {{-- Ini bagian yang diganti untuk menampilkan gambar dinamis --}}
                         <img src="{{ $category->image ? asset('storage/' . $category->image) : 'https://via.placeholder.com/300x200/EEEEEE/000000?text=No+Image' }}" alt="{{ $category->name }}" class="rounded-lg w-full h-32 object-cover">
                    </div>
                </div>
            @empty
                <div class="col-span-2 text-center text-gray-500">
                    <p>Belum ada kategori untuk ditampilkan.</p>
                </div>
            @endforelse

        </div>

        <div class="text-center mt-12">
            <a href="{{ route('categories.index') }}" class="inline-block bg-red-600 text-white font-bold text-lg px-10 py-3 rounded-md hover:bg-red-700 transition-colors">
                View All Categories
            </a>
        </div>
    </div>
</section>

    {{-- Bagian 6: Blok Promo (Oli & Kaca Film) --}}
    {{-- Bagian 6: Blok Promo --}}
<section class="bg-gray-900 text-white py-20 mt-16" style="clip-path: polygon(0 15%, 100% 0, 100% 85%, 0 100%);">
    <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-16 items-center">

            {{-- Kita cari data kategori 'Pelumas' dan 'Keamanan' dari variabel $categories --}}
            @php
                $pelumasCategory = $categories->firstWhere('slug', 'pelumas');
                $keamananCategory = $categories->firstWhere('slug', 'keamanan-emergency');
            @endphp

            {{-- Blok Kiri: Pelumas --}}
            @if($pelumasCategory)
                <div class="flex items-center gap-6">
                    <img src="{{ asset('images/categories/kategori-pelumas.jpg') }}" alt="Oli Mesin" class="w-1/3 rounded-lg h-32 object-cover">
                    <div class="w-2/3">
                        <h3 class="text-2xl font-bold mb-2 uppercase">{{ $pelumasCategory->name }}</h3>
                        <p class="text-gray-400 mb-4">Oli mesin & rantai terbaik dari merek favorit Anda.</p>
                        <a href="{{ route('products.by_category', $pelumasCategory) }}" class="bg-red-600 text-white font-bold px-5 py-2 rounded-md text-sm hover:bg-red-700">
                            Cek Sekarang
                        </a>
                    </div>
                </div>
            @endif

            {{-- Blok Kanan: Keamanan & Emergency --}}
            @if($keamananCategory)
                <div class="flex items-center gap-6">
                     <img src="{{ asset('images/categories/kategori-keamanan-emergency.jpg') }}" alt="Keamanan Emergency" class="w-1/3 rounded-lg h-32 object-cover">
                     <div class="w-2/3">
                        <h3 class="text-2xl font-bold mb-2 uppercase">{{ $keamananCategory->name }}</h3>
                        <p class="text-gray-400 mb-4">Perlengkapan untuk keamanan dan keadaan darurat di perjalanan.</p>
                        <a href="{{ route('products.by_category', $keamananCategory) }}" class="bg-red-600 text-white font-bold px-5 py-2 rounded-md text-sm hover:bg-red-700">
                            Cek Sekarang
                        </a>
                    </div>
                </div>
            @endif

        </div>
    </div>
</section>

@endsection