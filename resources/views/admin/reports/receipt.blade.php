<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk Laporan #{{ $report->id }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            /* Sembunyikan tombol saat mode print */
            .no-print {
                display: none;
            }
            body {
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body class="bg-gray-100 font-sans">
    <div class="container mx-auto max-w-xl my-8">
        {{-- Tombol Aksi --}}
        <div class="no-print mb-6 text-center space-x-2">
            <a href="{{ route('admin.reports.index') }}" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">← Kembali ke Laporan</a>
            <button onclick="window.print()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cetak Struk</button>
        </div>

        {{-- Isi Struk --}}
        <div class="bg-white p-8 rounded-lg shadow-lg">
            <div class="text-center border-b pb-4 mb-4">
                <h1 class="text-2xl font-bold">SB Jaya</h1>
                <p class="text-sm text-gray-500">Jl. Raya Demak-Kudus no.29</p>
            </div>
            <div class="flex justify-between text-sm mb-4">
                <div>
                    <p><strong>No. Laporan:</strong> #{{ $report->id }}</p>
                    <p><strong>Kasir:</strong> {{ $report->user->name }}</p>
                </div>
                <div>
                    <p><strong>Tanggal:</strong> {{ $report->created_at->format('d M Y H:i') }}</p>
                    <p><strong>Customer:</strong> {{ $report->customer_name ?? '-' }}</p>
                </div>
            </div>
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b-2 border-t-2">
                        <th class="p-2 text-left">PRODUK</th>
                        <th class="p-2 text-right">HARGA</th>
                        <th class="p-2 text-right">JML</th>
                        <th class="p-2 text-right">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($report->items as $item)
                        <tr class="border-b">
                            <td class="p-2">{{ $item->product->name }}</td>
                            <td class="p-2 text-right">@ {{ number_format($item->price, 0, ',', '.') }}</td>
                            <td class="p-2 text-right">{{ $item->quantity }}</td>
                            <td class="p-2 text-right">Rp {{ number_format($item->price * $item->quantity, 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr class="font-bold">
                        <td colspan="3" class="p-2 text-right">GRAND TOTAL</td>
                        <td class="p-2 text-right">Rp {{ number_format($report->total_amount, 0, ',', '.') }}</td>
                    </tr>
                </tfoot>
            </table>
            <p class="text-center text-xs text-gray-500 mt-8">Terima kasih telah berbelanja!</p>
        </div>
    </div>
</body>
</html>