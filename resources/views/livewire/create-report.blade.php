<div>
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Buat Laporan Baru</h1>
    </div>

    <form wire:submit="saveReport" class="bg-white p-8 rounded-lg shadow-md">
        {{-- Input Nama Customer --}}
        <div class="mb-6">
            <label for="customer_name" class="block text-gray-700 font-bold mb-2">Nama Customer (Opsional)</label>
            <input type="text" id="customer_name" wire:model.live="customer_name" class="w-full px-3 py-2 border rounded-lg" placeholder="Masukkan nama customer">
        </div>

        {{-- Input Cari Produk --}}
        <div class="mb-6 relative">
            <label for="search" class="block text-gray-700 font-bold mb-2">Cari Produk</label>
            <input type="text" id="search" wire:model.live.debounce.300ms="searchTerm" class="w-full px-3 py-2 border rounded-lg" placeholder="Ketik nama atau brand produk...">

            {{-- Hasil Pencarian --}}
            @if(!empty($searchTerm) && !empty($searchResults))
                <ul class="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                    @foreach($searchResults as $product)
                        <li class="px-4 py-2 cursor-pointer hover:bg-gray-100" wire:click="addProductToCart({{ $product->id }})">
                            {{ $product->name }} - (Stok: {{ $product->stock }})
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>

        {{-- Tabel Keranjang/Cart --}}
        <h3 class="text-xl font-bold text-gray-800 border-t pt-6 mt-6 mb-4">Daftar Barang</h3>
        <table class="w-full mb-6">
            <thead>
                <tr class="bg-gray-100">
                    <th class="p-2 text-left">Produk</th>
                    <th class="p-2">Harga</th>
                    <th class="p-2">Jumlah</th>
                    <th class="p-2 text-right">Subtotal</th>
                    <th class="p-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
    @forelse ($cart as $index => $item)
        <tr class="border-b">
            <td class="p-2 font-semibold">
                {{ $item['name'] }}
            </td>
            <td class="p-2 text-center">
                Rp {{ number_format($item['price'], 0, ',', '.') }}
            </td>
            <td class="p-2" style="width: 120px;">
                <input type="number" 
                       wire:model.live="cart.{{ $index }}.quantity" 
                       class="w-full text-center border rounded-md px-2 py-1"
                       min="1"
                       max="{{ $item['stock'] }}">
            </td>
            <td class="p-2 text-right font-bold">
                {{-- Subtotal, nanti kita buat dinamis juga --}}
                Rp {{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }}
            </td>
            <td class="p-2 text-center">
                <button type="button" 
                        wire:click="removeCartItem({{ $index }})" 
                        class="text-red-500 hover:text-red-700 font-semibold">
                    Hapus
                </button>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="5" class="text-center p-8 text-gray-500">
                Keranjang masih kosong. Silakan cari dan pilih produk.
            </td>
        </tr>
    @endforelse
</tbody>
        </table>

        {{-- Total & Tombol Simpan --}}
        <div class="text-right">
            <p class="text-2xl font-bold">Total: Rp {{ number_format($this->total, 0, ',', '.') }}</p>
            <button type="submit" class="mt-4 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors">
                Simpan Laporan
            </button>
        </div>
    </form>
</div>