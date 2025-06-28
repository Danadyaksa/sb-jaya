<?php

namespace App\Http\Controllers;

use App\Models\Product; // <-- Import Product
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // <-- Import Auth

class FavoriteController extends Controller
{
    public function store(Product $product)
{
    $user = Auth::user();

    // toggle() akan mengembalikan array berisi status perubahannya
    $result = $user->favorites()->toggle($product->id);

    // Cek apakah ada item yang 'dilampirkan' (ditambahkan)
    if (count($result['attached']) > 0) {
        $message = 'Produk berhasil ditambahkan ke favorit!';
    } else {
        $message = 'Produk berhasil dihapus dari favorit.';
    }

    return back()->with('success', $message);
}
    public function index()
        {
            // Ambil user yang sedang login
            $user = Auth::user();

            // Ambil semua produk yang ada di dalam relasi 'favorites' milik user ini
            $favoriteProducts = $user->favorites()->latest()->get();

            // Kirim data ke view baru yang akan kita buat
            return view('favorites.index', ['products' => $favoriteProducts]);
        }
}