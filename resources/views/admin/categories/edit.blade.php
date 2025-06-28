@extends('layouts.admin')

@section('content')
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Edit Kategori: {{ $category->name }}</h1>

    {{-- Blok untuk menampilkan SEMUA error di bagian atas --}}
    @if ($errors->any())
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong class="font-bold">Oops! Ada yang salah.</strong>
            <ul class="list-disc ml-5 mt-2">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.kategori.update', $category) }}" method="POST" enctype="multipart/form-data" class="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        @csrf
        @method('PUT')

        {{-- Input Nama Kategori dengan Error Handling --}}
        <div class="mb-4">
            <label for="name" class="block text-gray-700 font-bold mb-2">Nama Kategori</label>
            <input type="text" name="name" id="name" class="w-full px-3 py-2 border rounded-lg @error('name') border-red-500 @enderror" value="{{ old('name', $category->name) }}" required>
            @error('name')
                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
            @enderror
        </div>

        {{-- Input Gambar dengan Live Preview menggunakan Alpine.js --}}
        <div class="mb-6" x-data="{ imagePreview: '{{ $category->image ? asset('storage/' . $category->image) : 'https://via.placeholder.com/150' }}' }">
            <label class="block text-gray-700 font-bold mb-2">Preview Gambar</label>
            {{-- Gambar preview akan berubah secara dinamis --}}
            <img :src="imagePreview" alt="Preview Gambar Kategori" class="w-40 h-40 object-cover rounded-lg mb-4 bg-gray-100">
            
            <label for="image" class="block text-gray-700 font-bold mb-2">Ganti Gambar</label>
            <input type="file" name="image" id="image" class="w-full"
                   @change="imagePreview = URL.createObjectURL($event.target.files[0])">
            <small class="text-gray-500">Kosongkan jika tidak ingin mengganti gambar.</small>
             @error('image')
                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div class="text-right">
            <button type="submit" class="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700">
                Update Kategori
            </button>
        </div>
    </form>
@endsection