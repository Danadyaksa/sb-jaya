<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Product; // <-- Import Product
use App\Models\Report; // <-- Tambahkan ini
use Illuminate\Support\Facades\Auth; // <-- Tambahkan ini
use Illuminate\Support\Facades\DB;   // <-- Tambahkan ini
use App\Models\StockMovement;

class CreateReport extends Component
{
    public $customer_name = '';

    public $searchTerm = '';
    public $searchResults = [];

    public $cart = []; // Ini akan menyimpan produk yang dipilih

    public function addProductToCart($productId)
    {
        $product = Product::find($productId);
        if (!$product) { return; }

        // Cek apakah produk sudah ada di cart
        foreach ($this->cart as $item) {
            if ($item['id'] === $productId) {
                // Jika sudah ada, jangan tambahkan lagi (atau bisa juga tambah quantity)
                return;
            }
        }

        // Tambahkan produk ke cart dengan qty awal 1
        $this->cart[] = [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'stock' => $product->stock,
            'quantity' => 1,
        ];

        // Kosongkan kembali hasil pencarian
        $this->searchTerm = '';
        $this->searchResults = [];
    }

    // ▼▼▼ TAMBAHKAN METHOD INI JUGA ▼▼▼
    public function removeCartItem($index)
    {
        unset($this->cart[$index]);
        // Re-index array agar tidak ada "lubang"
        $this->cart = array_values($this->cart);
    }

    public function saveReport()
    {
        // Validasi: pastikan keranjang tidak kosong
        if (empty($this->cart)) {
            // Bisa juga kirim notifikasi error
            return;
        }

        // Mulai transaksi database untuk menjaga keamanan data
        DB::transaction(function () {
            // 1. Buat record laporan utama
            $report = Report::create([
                'user_id' => Auth::id(), // ID kasir yang login
                'customer_name' => $this->customer_name,
                'total_amount' => $this->total,
            ]);

            // 2. Loop & simpan item laporan, lalu kurangi stok
            foreach ($this->cart as $item) {
                $product = Product::find($item['id']);
                if ($product) {
                    // Simpan item ke laporan
                    $report->items()->create([
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $item['price'], // Harga saat transaksi
                    ]);

                    // Kurangi stok produk
                    $product->decrement('stock', $item['quantity']);

                    $product->stockMovements()->create([
                        'user_id' => auth()->id(),
                        'type' => 'out',
                        'quantity' => $item['quantity'],
                        'remarks' => 'Laporan Penjualan #' . $report->id
                    ]);
                }
            }
        });

        // Kirim pesan sukses
        session()->flash('success', 'Laporan berhasil disimpan!');

        // Arahkan kembali ke halaman daftar produk admin
        return redirect()->route('admin.products.index');
    }

    public function render()
    {
        return view('livewire.create-report');
    }

    public function getTotalProperty()
{
    // Hitung total dari semua item di keranjang
    return collect($this->cart)->sum(function ($item) {
        // Pastikan quantity valid sebelum dikalikan
        $quantity = is_numeric($item['quantity']) ? $item['quantity'] : 0;
        return $item['price'] * $quantity;
    });
}
    
    public function updatedSearchTerm($value)
    {
        // Pastikan kamu sudah menghapus baris dd($results);

        $this->searchResults = [];

        // Hanya cari jika input tidak kosong
        if (strlen($value) >= 1) {
            $this->searchResults = Product::where('stock', '>', 0) // Pertama, pastikan stok ada
                                    ->where(function ($query) use ($value) {
                                        // Kedua, kelompokkan kondisi OR di sini
                                        $query->where('name', 'like', '%' . $value . '%')
                                            ->orWhere('brand', 'like', '%' . $value . '%');
                                    })
                                    ->limit(5)
                                    ->get();
        }
    }
}
