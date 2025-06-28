@extends('layouts.admin')
@section('content')
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Kelola Kategori</h1>
    <div class="bg-white p-6 rounded-lg shadow-md">
        <table class="w-full">
            <thead>
                <tr class="text-left border-b-2"><th class="p-2">Gambar</th><th class="p-2">Nama Kategori</th><th class="p-2">Aksi</th></tr>
            </thead>
            <tbody>
                @forelse ($categories as $category)
                    <tr class="border-b hover:bg-gray-50">
                        {{-- Kolom Gambar --}}
                        <td class="p-2">
                            <img src="{{ $category->image ? asset('storage/' . $category->image) : 'https://via.placeholder.com/100x100/F3F4F6/000000?text=No+Img' }}" 
                                alt="{{ $category->name }}" 
                                class="w-16 h-16 object-cover rounded-md bg-gray-100">
                        </td>

                        {{-- Kolom Nama Kategori --}}
                        <td class="p-2 font-semibold">
                            {{ $category->name }}
                        </td>

                        {{-- Kolom Aksi --}}
                        <td class="p-2">
                            <a href="{{ route('admin.kategori.edit', $category) }}" class="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-600">
                                Edit
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="3" class="text-center p-8 text-gray-500">
                            Belum ada kategori yang dibuat.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection