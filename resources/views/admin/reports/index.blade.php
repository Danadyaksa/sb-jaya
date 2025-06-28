@extends('layouts.admin')

@section('content')
    <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
            <span class="text-2xl text-gray-700"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></span>
            <h1 class="text-3xl font-bold text-gray-800">Laporan Penjualan</h1>
        </div>
        <a href="{{ route('admin.reports.create') }}" class="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors">
            Tambah Laporan
        </a>
    </div>

    <div class="space-y-8">
        @forelse ($reports as $report)
            <div class="bg-white p-6 rounded-lg shadow-md">
                
                {{-- ▼▼▼ INI BAGIAN HEADER YANG SUDAH DIPERBAIKI TOTAL ▼▼▼ --}}
                <div class="flex justify-between items-center border-b pb-4 mb-4">
                    {{-- Sisi Kiri: Info Laporan & Tombol Aksi --}}
                    <div class="flex items-center gap-4">
                        <div>
                            <h2 class="font-bold text-xl text-gray-800">Laporan #{{ $report->id }}</h2>
                            <p class="text-sm text-gray-500">{{ $report->created_at->format('d F Y H:i') }}</p>
                        </div>
                        <a href="{{ route('admin.reports.receipt', $report) }}" target="_blank" class="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-600">
                            Lihat Struk
                        </a>
                        {{-- Tombol Hapus Baru --}}
                        <form action="{{ route('admin.reports.destroy', $report) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus laporan ini? Tindakan ini tidak bisa dibatalkan.');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="bg-gray-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-200">
                                Hapus
                            </button>
                        </form>
                    </div>

                    {{-- Sisi Kanan: Info Customer & Kasir --}}
                    <div class="text-right text-sm text-gray-500">
                        <p>Customer: {{ $report->customer_name ?? '-' }}</p>
                        <p>Kasir: {{ $report->user->name }}</p>
                    </div>
                </div>
                {{-- ▲▲▲ AKHIR DARI BAGIAN HEADER YANG DIPERBAIKI ▲▲▲ --}}

                <table class="w-full">
                    <thead>
                        <tr class="text-left text-gray-600 text-sm">
                            <th class="p-2">Produk</th>
                            <th class="p-2">Harga</th>
                            <th class="p-2">Jumlah</th>
                            <th class="p-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($report->items as $item)
                            <tr class="border-b">
                                <td class="p-2 flex items-center gap-4"><img src="{{ $item->product->image ? asset('storage/' . $item->product->image) : 'https://via.placeholder.com/100' }}" class="w-12 h-12 object-contain rounded-md bg-gray-100 p-1"><span>{{ $item->product->name }}</span></td>
                                <td class="p-2">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                                <td class="p-2">{{ $item->quantity }} Pcs</td>
                                <td class="p-2 text-right font-bold">Rp {{ number_format($item->price * $item->quantity, 0, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <div class="text-right mt-4 border-t pt-4">
                    <span class="text-gray-600 font-semibold">Grand Total:</span>
                    <span class="font-bold text-xl text-gray-900">Rp {{ number_format($report->total_amount, 0, ',', '.') }}</span>
                </div>
            </div>
        @empty
            <div class="text-center py-16 text-gray-500">
                <p class="text-xl">Belum ada laporan yang dibuat.</p>
            </div>
        @endforelse
    </div>
@endsection