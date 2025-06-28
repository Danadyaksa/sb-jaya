@extends('layouts.admin')

@section('content')
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Edit Produk: {{ $product->name }}</h1>

    <form action="{{ route('admin.products.update', $product) }}" method="POST" enctype="multipart/form-data" class="bg-white p-8 rounded-lg shadow-md">
        @csrf
        @method('PUT') {{-- <-- Method penting untuk Update --}}
        
        <div class="grid md:grid-cols-2 gap-8">
            {{-- Kolom Kiri --}}
            <div>
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 font-bold mb-2">Nama Produk</label>
                    <input type="text" name="name" id="name" class="w-full px-3 py-2 border rounded-lg" value="{{ old('name', $product->name) }}" required>
                </div>
                <div class="mb-4">
                    <label for="brand" class="block text-gray-700 font-bold mb-2">Brand</label>
                    <input type="text" name="brand" id="brand" class="w-full px-3 py-2 border rounded-lg" value="{{ old('brand', $product->brand) }}">
                </div>
                 <div class="mb-4">
                    <label for="category_id" class="block text-gray-700 font-bold mb-2">Kategori</label>
                    <select name="category_id" id="category_id" class="w-full px-3 py-2 border rounded-lg" required>
                        @foreach ($categories as $category)
                            <option value="{{ $category->id }}" @selected(old('category_id', $product->category_id) == $category->id)>
                                {{ $category->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="mb-4">
                    <label for="price" class="block text-gray-700 font-bold mb-2">Harga</label>
                    <input type="number" name="price" id="price" class="w-full px-3 py-2 border rounded-lg" value="{{ old('price', $product->price) }}" required>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Stok Saat Ini (Hanya bisa diubah oleh Gudang)</label>
                    <p class="w-full px-3 py-2 bg-gray-100 rounded-lg">{{ $product->stock }}</p>
                </div>
            </div>

            {{-- Kolom Kanan --}}
            <div>
                 <div class="mb-4">
                    <label for="color" class="block text-gray-700 font-bold mb-2">Warna</label>
                    <input type="text" name="color" id="color" class="w-full px-3 py-2 border rounded-lg" value="{{ old('color', $product->color) }}">
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-gray-700 font-bold mb-2">Deskripsi</label>
                    <textarea name="description" id="description" rows="5" class="w-full px-3 py-2 border rounded-lg">{{ old('description', $product->description) }}</textarea>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Gambar Saat Ini</label>
                    @if($product->image)
                        <img src="{{ asset('storage/' . $product->image) }}" alt="{{ $product->name }}" class="w-32 h-32 object-cover mb-4 rounded-lg">
                    @else
                        <p class="text-sm text-gray-500">Tidak ada gambar.</p>
                    @endif
                    <label for="image" class="block text-gray-700 font-bold mb-2">Ganti Gambar</label>
                    <input type="file" name="image" id="image" class="w-full">
                    <small class="text-gray-500">Kosongkan jika tidak ingin mengganti gambar.</small>
                </div>
            </div>
        </div>

        <div class="mt-8 text-right">
            <button type="submit" class="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors">
                Update Produk
            </button>
        </div>
    </form>
@endsection