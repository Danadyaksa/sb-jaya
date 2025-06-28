<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Ambil 8 produk yang paling baru ditambahkan dari database
        $newProducts = Product::latest()->take(8)->get();

        // Ambil semua kategori dari database
        $categories = Category::all();

        // Kirim kedua data tersebut ke view 'home'
        return view('home', [
            'newProducts' => $newProducts,
            'categories' => $categories,
        ]);
    }
}