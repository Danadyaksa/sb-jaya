@extends('layouts.admin')

@section('content')
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Kelola Stok Produk</h1>

    {{-- ▼▼▼ KOTAK PERINGATAN STOK MENIPIS ▼▼▼ --}}
    @if($lowStockProducts->isNotEmpty())
        <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <p class="font-bold">Peringatan Stok Menipis!</p>
            <p>Produk berikut memiliki stok 5 atau kurang:</p>
            <ul class="list-disc ml-5 mt-2">
                @foreach ($lowStockProducts as $product)
                    <li>{{ $product->name }} (Sisa: {{ $product->stock }})</li>
                @endforeach
            </ul>
        </div>
    @endif
    {{-- ▲▲▲ AKHIR KOTAK PERINGATAN ▲▲▲ --}}

    <div class="bg-white p-6 rounded-lg shadow-md">
        {{-- ... isi tabel ... --}}
        <table class="w-full">
    <thead>
        <tr class="text-left border-b-2">
            <th class="p-2">Nama Produk</th>
            <th class="p-2">Stok Saat Ini</th>
            <th class="p-2">Jumlah Tambahan</th>
            <th class="p-2">Aksi</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($products as $product)
            <tr class="border-b hover:bg-gray-50">
                <td class="p-2 font-semibold">{{ $product->name }}</td>
                <td class="p-2 font-bold">{{ $product->stock }}</td>

                {{-- Form untuk menambah stok --}}
                <form action="{{ route('admin.stock.update', $product) }}" method="POST">
                    @csrf
                    @method('PUT')
                    <td class="p-2">
                        <input type="number" name="added_stock" value="0" min="0" class="w-24 px-2 py-1 border rounded-md focus:ring-red-500 focus:border-red-500">
                    </td>
                    <td class="p-2">
                        <button type="submit" class="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-green-700">
                            Tambah Stok
                        </button>
                    </td>
                </form>
            </tr>
        @endforeach
    </tbody>
</table>
        <div class="mt-6">{{ $products->links() }}</div>
    </div>
@endsection