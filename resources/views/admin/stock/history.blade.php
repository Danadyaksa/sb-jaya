@extends('layouts.admin')

@section('content')
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Riwayat Pergerakan Stok</h1>

    <div class="bg-white p-6 rounded-lg shadow-md">
        <table class="w-full">
            <thead>
                <tr class="text-left border-b-2">
                    <th class="p-2">Tanggal</th>
                    <th class="p-2">Produk</th>
                    <th class="p-2">Tipe</th>
                    <th class="p-2">Jumlah</th>
                    <th class="p-2">Oleh</th>
                    <th class="p-2">Catatan</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($movements as $movement)
                    <tr class="border-b hover:bg-gray-50">
                        <td class="p-2 text-sm text-gray-500">{{ $movement->created_at->format('d M Y, H:i') }}</td>
                        <td class="p-2 font-semibold">{{ $movement->product->name }}</td>
                        <td class="p-2">
                            @if($movement->type == 'in')
                                <span class="font-bold text-green-600">IN</span>
                            @else
                                <span class="font-bold text-red-600">OUT</span>
                            @endif
                        </td>
                        <td class="p-2 font-bold">{{ $movement->quantity }}</td>
                        <td class="p-2">{{ $movement->user->name }}</td>
                        <td class="p-2 text-sm">{{ $movement->remarks }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="text-center p-8 text-gray-500">Belum ada riwayat pergerakan stok.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        <div class="mt-6">{{ $movements->links() }}</div>
    </div>
@endsection 