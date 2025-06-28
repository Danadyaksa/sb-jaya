@extends('layouts.main')

@section('content')

    <x-page-title-banner title="Favourites" />

    <div class="container mx-auto px-4 py-12">
        @if ($products->count() > 0)
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                @foreach ($products as $product)
                    <div class="border border-gray-200 rounded-lg group overflow-hidden">
                        <a href="{{ route('products.show', $product) }}">
                            <div class="bg-white p-4">
                                <img src="{{ $product->image ? asset('storage/' . $product->image) : 'https://via.placeholder.com/300x300/F3F4F6/000000?text=No+Image' }}" alt="{{ $product->name }}" class="w-full h-56 object-contain">
                            </div>
                        </a>
                        <div class="p-4">
                            <a href="{{ route('products.show', $product) }}">
                                <h3 class="font-bold text-gray-800 text-lg mb-2 truncate" title="{{ $product->name }}">{{ $product->name }}</h3>
                            </a>
                            <p class="text-sm text-gray-500 mb-2">STOK TERSEDIA : {{ $product->stock }}</p>
                            <p class="text-2xl font-extrabold text-gray-900 mb-4">
                                Rp {{ number_format($product->price, 0, ',', '.') }}
                            </p>
                            {{-- Tombol Remove ini menggunakan logic 'toggle' yang sama --}}
                            <form action="{{ route('favorites.add', $product) }}" method="POST">
                                @csrf
                                <button type="submit" class="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition-colors">
                                    Remove
                                </button>
                            </form>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="text-center py-16 text-gray-500">
                <h3 class="text-2xl font-semibold">Daftar Favorit Kosong</h3>
                <p class="mt-2">Kamu belum menambahkan produk apa pun ke daftar favorit.</p>
                <a href="{{ route('products.index') }}" class="mt-6 inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors">
                    Mulai Eksplor
                </a>
            </div>
        @endif
    </div>
@endsection