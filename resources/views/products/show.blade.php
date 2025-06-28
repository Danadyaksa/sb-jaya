@extends('layouts.main')

@section('content')

    <x-page-title-banner title="{{ $product->name }}" :breadcrumbs="$breadcrumbs" />

    <div class="container mx-auto px-4 py-12">
        <div class="grid md:grid-cols-2 gap-12 items-start">

            {{-- Kolom Kiri: Galeri Gambar --}}
            <div>
                {{-- Gambar Utama dengan Efek Zoom --}}
                <div class="border border-gray-200 rounded-lg overflow-hidden group"> {{-- <-- Tambah `overflow-hidden` & `group` --}}
                    <img src="{{ $product->image ? asset('storage/' . $product->image) : 'https://via.placeholder.com/600x600/F3F4F6/000000?text=No+Image' }}" 
                         alt="{{ $product->name }}" 
                         class="w-full h-96 object-contain bg-white p-4 transition-transform duration-300 ease-in-out group-hover:scale-110"> {{-- <-- Ukuran diubah & class transisi ditambahkan --}}
                </div>
                
                {{-- Thumbnail (jika nanti ada) --}}
                <div class="grid grid-cols-3 gap-4 mt-4">
                    {{-- Contoh Thumbnail --}}
                    {{-- <div class="border-2 border-red-500 rounded-lg p-1"><img src="{{ $product->image ? asset('storage/' . $product->image) : '...' }}" class="w-full"></div> --}}
                </div>
            </div>

            {{-- Kolom Kanan: Detail & Aksi --}}
            <div class="pt-4">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $product->name }}</h1>
                <p class="font-semibold mb-6 {{ $product->stock > 0 ? 'text-green-600' : 'text-red-600' }}">
                    STOK TERSEDIA : {{ $product->stock }}
                </p>

                <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <p class="text-gray-500">BRAND</p>
                        <p class="font-semibold text-gray-800">{{ $product->brand }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">PART NUMBER</p>
                        <p class="font-semibold text-gray-800">SB-{{ str_pad($product->id, 8, '0', STR_PAD_LEFT) }}</p>
                    </div>
                </div>

                {{-- Opsi Warna jika ada --}}
                @if($product->color)
                <div class="mb-6">
                    <p class="text-gray-500 text-sm mb-2">COLOR</p>
                    <p class="font-semibold text-gray-800">{{ $product->color }}</p>
                </div>
                @endif
                
                <p class="text-4xl font-extrabold text-red-600 mb-8">Rp {{ number_format($product->price, 0, ',', '.') }}</p>

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

        {{-- Bagian Bawah: Deskripsi --}}
        <div class="mt-16 pt-8 border-t border-gray-200">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                    <a href="#" class="border-red-600 text-red-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg">Description</a>
                </nav>
            </div>
            <div class="prose max-w-none py-8 text-gray-600">
                <p>{{ $product->description }}</p>
            </div>
        </div>
    </div>
@endsection