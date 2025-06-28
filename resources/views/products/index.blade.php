@extends('layouts.main')
@section('content')

    <x-page-title-banner title="Products" />

    <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-8">
            <a href="{{ route('categories.index') }}" class="inline-block bg-red-600 text-white font-bold text-lg px-10 py-3 rounded-md hover:bg-red-700 transition-colors">
                View All Categories
            </a>
        </div>

        {{-- Bagian 3: Toolbar (Filter & Sort) --}}
{{-- Kita bungkus dengan form GET agar pilihan bisa dikirim lewat URL --}}
<form action="{{ route('products.index') }}" method="GET">
    <div class="flex justify-between items-center border-t border-b border-gray-200 py-4 mb-8">
    <div class="flex items-center gap-4">
        {{-- ... Tombol view switcher ... --}}
        <span class="text-sm text-gray-500 ml-4">
            Showing {{ $products->firstItem() }}–{{ $products->lastItem() }} of {{ $products->total() }} results
        </span>
    </div>
    <div class="flex items-center gap-4">

        {{-- ▼▼▼ DROPDOWN BARU ▼▼▼ --}}

        {{-- Dropdown Kategori --}}
        <select name="category" class="border-gray-300 rounded-md shadow-sm text-sm">
            <option value="">Semua Kategori</option>
            @foreach($categories as $category)
                <option value="{{ $category->slug }}" @selected(request('category') == $category->slug)>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>

        {{-- Dropdown Brand --}}
        <select name="brand" class="border-gray-300 rounded-md shadow-sm text-sm">
             <option value="">Semua Brand</option>
             @foreach($brands as $brand)
                 <option value="{{ $brand->brand }}" @selected(request('brand') == $brand->brand)>
                    {{ $brand->brand }}
                </option>
             @endforeach
        </select>

        {{-- Dropdown Sort --}}
        <select name="sort" class="border-gray-300 rounded-md shadow-sm text-sm">
            <option value="" @selected(request('sort') == '')>Sort Default</option>
            <option value="price_asc" @selected(request('sort') == 'price_asc')>Harga: Termurah</option>
            <option value="price_desc" @selected(request('sort') == 'price_desc')>Harga: Termahal</option>
        </select>

        {{-- Tombol Apply --}}
        <button type="submit" class="bg-gray-800 text-white font-semibold px-5 py-2 rounded-md text-sm hover:bg-red-600">Apply</button>
        <a href="{{ route('products.index') }}" class="text-sm hover:text-red-600">Reset</a>

    </div>
</div>
</form>

        {{-- Grid Produk --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            @forelse ($products as $product)
                {{-- Kartu Produk Dinamis --}}
                <div class="border border-gray-200 rounded-lg group overflow-hidden">
                    {{-- Link ini sekarang punya parameter $product, jadi tidak akan error lagi --}}
                    <a href="{{ route('products.show', $product) }}">
                        <div class="bg-white p-4"><img src="{{ $product->image ? asset('storage/' . $product->image) : 'https://via.placeholder.com/300x300/F3F4F6/000000?text=No+Image' }}" alt="{{ $product->name }}" class="w-full h-56 object-contain"></div>
                    </a>
                    <div class="p-4">
                        <a href="{{ route('products.show', $product) }}"><h3 class="font-bold text-gray-800 text-lg mb-2 truncate hover:text-red-600" title="{{ $product->name }}">{{ $product->name }}</h3></a>
                        <p class="text-sm text-gray-500 mb-2">STOK TERSEDIA : {{ $product->stock }}</p>
                        <p class="text-2xl font-extrabold text-gray-900 mb-4">Rp {{ number_format($product->price, 0, ',', '.') }}</p>
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
                <div class="col-span-4 text-center py-16 text-gray-500">
                    <p class="text-xl">Oops! Belum ada produk yang bisa ditampilkan.</p>
                </div>
            @endforelse
        </div>

        {{-- Pagination Dinamis dari Laravel --}}
        <div class="mt-12">
            {{ $products->links() }}
        </div>
    </div>

@endsection