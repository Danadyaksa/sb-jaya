@extends('layouts.admin')

@section('content')
    {{-- Header Halaman --}}
    <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
            <span class="text-2xl text-gray-700">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 18h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z"></path></svg>
            </span>
            <h1 class="text-3xl font-bold text-gray-800">Katalog Produk</h1>
        </div>
        <a href="{{ route('admin.products.create') }}" class="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
            Tambah Produk
        </a>
    </div>

    {{-- Grid Produk --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        @forelse ($products as $product)
            {{-- Kartu Produk Dinamis dengan Dropdown --}}
<div class="bg-white border border-gray-200 rounded-lg shadow-md group overflow-hidden">
    <div class="bg-gray-100 p-4 relative">
        <img src="{{ $product->image ? asset('storage/' . $product->image) : 'https://via.placeholder.com/300x300/F3F4F6/000000?text=Produk' }}" 
             alt="{{ $product->name }}" 
             class="w-full h-48 object-contain">

                        <div x-data="{ open: false }" @click.outside="open = false" class="absolute top-2 right-2">
                    <button @click="open = !open" class="bg-white p-2 rounded-full shadow z-20 transition-transform hover:scale-110">
                        <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>
                    
                    <div x-show="open" x-transition class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-30 border" style="display: none;">
                        {{-- PASTIKAN LINK INI BENAR --}}
                        <a href="{{ route('admin.products.edit', $product) }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Edit
                        </a>
                        
                        {{-- PASTIKAN FORM INI BENAR --}}
                        <form action="{{ route('admin.products.destroy', $product) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus produk ini?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                Hapus
                            </button>
                        </form>
                    </div>
                </div>
        {{-- Akhir Dropdown Menu --}}
    </div>
    <div class="p-4 text-center">
        <h3 class="font-bold text-gray-800 text-md mb-2 truncate" title="{{ $product->name }}">{{ $product->name }}</h3>
        <p class="text-lg font-extrabold text-gray-900 mb-2">Rp {{ number_format($product->price, 0, ',', '.') }}</p>
        <p class="text-xs text-gray-500">Stok: {{ $product->stock }}</p>
    </div>
</div>
        @empty
            <div class="col-span-4 text-center py-16 text-gray-500">
                <p class="text-xl">Belum ada produk.</p>
                <a href="#" class="mt-4 text-red-600 font-semibold">Tambah Produk Pertama Anda</a>
            </div>
        @endforelse
    </div>
@endsection