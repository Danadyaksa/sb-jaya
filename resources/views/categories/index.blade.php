@extends('layouts.main')
@section('content')

    <x-page-title-banner title="Product Categories" :breadcrumbs="$breadcrumbs" />

    <div class="container mx-auto px-4 py-12">
        

        {{-- Kita loop semua kategori dari database --}}
        @forelse ($categories as $category)
            <section class="mb-16">
                {{-- Header Section Kategori --}}
                <div class="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
                    <h3 class="text-2xl font-bold text-gray-800 uppercase">{{ $category->name }}</h3>
                    {{-- Link ini akan mengarah ke halaman daftar produk untuk kategori ini --}}
                    <a href="{{ route('products.by_category', $category) }}" class="text-sm font-semibold text-red-600 hover:underline">View All &rarr;</a>
                </div>

                {{-- Grid Produk dalam Kategori --}}
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {{-- Kita loop 4 produk preview untuk kategori ini dari data relasi --}}
                @forelse ($category->products as $product)
                    {{-- Kartu Produk Dinamis --}}
                    <div class="border border-gray-200 rounded-lg group overflow-hidden">
                        <a href="{{ route('products.show', $product) }}">
                            <div class="bg-white p-4">
                                <img src="{{ $product->image ? asset('storage/' . $product->image) : 'https://via.placeholder.com/300x300/F3F4F6/000000?text=No+Image' }}" 
                                    alt="{{ $product->name }}" 
                                    class="w-full h-56 object-contain">
                            </div>
                        </a>
                        <div class="p-4">
                            <a href="{{ route('products.show', $product) }}">
                                <h3 class="font-bold text-gray-800 text-lg mb-2 truncate hover:text-red-600" title="{{ $product->name }}">{{ $product->name }}</h3>
                            </a>
                            <p class="text-sm text-gray-500 mb-2">STOK TERSEDIA : {{ $product->stock }}</p>
                            <p class="text-2xl font-extrabold text-gray-900 mb-4">
                                Rp {{ number_format($product->price, 0, ',', '.') }}
                            </p>
                            @auth
    {{-- Jika user sudah login, TAMPILKAN component Livewire yang interaktif --}}
                            @livewire('favorite-button', ['product' => $product], key($product->id . '-cat-index'))
                        @else
                            {{-- Jika user adalah tamu, TAMPILKAN tombol biasa yang mengarah ke login --}}
                            <a href="{{ route('login') }}" class="w-full block text-center bg-gray-300 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-400 transition-colors">
                                Login to Fav
                            </a>
                        @endauth
                        </div>
                    </div>
                @empty
                    <div class="col-span-4 text-center py-8 text-gray-500">
                        <p>Belum ada produk di kategori ini.</p>
                    </div>
                @endforelse
            </div>
            </section>
        @empty
            <div class="text-center py-16 text-gray-500">
                <h3 class="text-2xl">Oops!</h3>
                <p>Belum ada kategori yang bisa ditampilkan.</p>
            </div>
        @endforelse

    </div>

@endsection