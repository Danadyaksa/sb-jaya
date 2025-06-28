<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\StockMovement;

class StockController extends Controller
{
    public function index()
{
    // Definisikan batas stok menipis
    $lowStockThreshold = 5;

    $products = Product::latest()->paginate(15);

    // Ambil produk yang stoknya di bawah atau sama dengan batas
    $lowStockProducts = Product::where('stock', '<=', $lowStockThreshold)->orderBy('stock', 'asc')->get();

    return view('admin.stock.index', [
        'products' => $products,
        'lowStockProducts' => $lowStockProducts
    ]);
}
    // Di dalam class StockController

public function history()
{
    // Ambil semua data pergerakan stok, urutkan dari yang paling baru
    // 'with' digunakan untuk mengambil data relasi product dan user-nya
    $movements = StockMovement::with(['product', 'user'])
                                ->latest()
                                ->paginate(20); // Tampilkan 20 data per halaman

    return view('admin.stock.history', ['movements' => $movements]);
}

    public function update(Request $request, Product $product)
{
    $validated = $request->validate(['added_stock' => 'required|integer|min:1']);

    // Tambahkan stok
    $product->increment('stock', $validated['added_stock']);

    // ▼▼▼ TAMBAHKAN PENCATATAN RIWAYAT ▼▼▼
    $product->stockMovements()->create([
        'user_id' => auth()->id(),
        'type' => 'in',
        'quantity' => $validated['added_stock'],
        'remarks' => 'Penambahan stok oleh staff gudang'
    ]);

    return back()->with('success', $validated['added_stock'] . ' stok berhasil ditambahkan untuk ' . $product->name);
}
}