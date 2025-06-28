<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str; // <-- Tambahkan ini di atas untuk membuat slug
use Illuminate\Support\Facades\Storage;


class ProductController extends Controller
{
    public function index(Request $request)
{
    $query = Product::query()->with('category');

    // ▼▼▼ LOGIKA PENCARIAN BARU ▼▼▼
    if ($request->filled('search')) {
        $searchTerm = $request->search;
        // Gunakan where() dengan closure untuk mengelompokkan kondisi OR
        $query->where(function ($q) use ($searchTerm) {
            $q->where('name', 'like', '%' . $searchTerm . '%')
              ->orWhere('brand', 'like', '%' . $searchTerm . '%')
              ->orWhere('description', 'like', '%' . $searchTerm . '%');
        });
    }

    // Logika untuk sorting
    if ($request->filled('sort')) {
        if ($request->sort === 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($request->sort === 'price_desc') {
            $query->orderBy('price', 'desc');
        }
    } else {
        $query->latest(); 
    }

    // Logika filter KATEGORI
    if ($request->filled('category')) {
        $query->whereHas('category', function ($q) use ($request) {
            $q->where('slug', $request->category);
        });
    }

    // Logika filter BRAND
    if ($request->filled('brand')) {
        $query->where('brand', 'like', '%' . $request->brand . '%');
    }

    $products = $query->paginate(12)->withQueryString();

    $categories = \App\Models\Category::orderBy('name')->get();
    $brands = Product::select('brand')->whereNotNull('brand')->distinct()->orderBy('brand')->get();

    return view('products.index', [
        'products' => $products,
        'categories' => $categories,
        'brands' => $brands,
    ]);
}
    public function indexByCategory(Category $category)
{
    $products = $category->products()->paginate(12);

    // ▼▼▼ TAMBAHKAN PERSIAPAN BREADCRUMBS INI ▼▼▼
    $breadcrumbs = [
        ['name' => 'Home', 'url' => route('home')],
        ['name' => 'Categories', 'url' => route('categories.index')],
        ['name' => $category->name, 'url' => '#'] // Halaman saat ini
    ];

    return view('categories.show', [
        'category' => $category,
        'products' => $products,
        'breadcrumbs' => $breadcrumbs, // Kirim ke view
    ]);
}
    public function show(Product $product)
{
    // Eager load category untuk efisiensi
    $product->load('category');

    // Siapkan data breadcrumbs secara dinamis
    $breadcrumbs = [
        ['name' => 'Home', 'url' => route('home')],
        ['name' => 'Categories', 'url' => route('categories.index')],
        ['name' => $product->category->name, 'url' => route('products.by_category', $product->category)],
        ['name' => $product->name, 'url' => '#'] // Halaman saat ini tidak perlu link
    ];

    return view('products.show', [
        'product' => $product,
        'breadcrumbs' => $breadcrumbs, // Kirim data breadcrumbs ke view
    ]);
}

    public function manage()
    {
        // Ambil semua produk, yang terbaru di atas
        $products = Product::latest()->get();

        // Tampilkan view baru untuk manajemen produk
        return view('admin.products.index', ['products' => $products]);
    }

    public function create()
{
    // Ambil semua kategori untuk ditampilkan di dropdown form
    $categories = Category::orderBy('name')->get();

    return view('admin.products.create', ['categories' => $categories]);
}

    public function edit(Product $product)
{
    $categories = Category::orderBy('name')->get();
    return view('admin.products.edit', [
        'product' => $product,
        'categories' => $categories,
    ]);
}

    // Di dalam ProductController
public function update(Request $request, Product $product)
{
    // Validasi, tanpa 'stock' karena kasir tidak bisa mengubahnya
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'brand' => 'nullable|string',
        'category_id' => 'required|exists:categories,id',
        'price' => 'required|numeric',
        'color' => 'nullable|string',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
    ]);

    $updateData = $request->except('stock');
    
    if ($request->hasFile('image')) {
        // Hapus gambar lama jika ada
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $updateData['image'] = $request->file('image')->store('products', 'public');
    }
    
    $updateData['slug'] = Str::slug($validated['name']);

    $product->update($updateData);

    return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diupdate!');
}

    // Di dalam ProductController
public function destroy(Product $product)
{
    // Hapus gambar dari storage jika ada
    if ($product->image) {
        Storage::disk('public')->delete($product->image);
    }
    // Hapus produk dari database
    $product->delete();

    return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus!');
}
    public function store(Request $request)
{
    // 1. Validasi data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'brand' => 'nullable|string',
        'category_id' => 'required|exists:categories,id',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'color' => 'nullable|string',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
    ]);

    // 2. Handle upload gambar
    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
    }

    // 3. Buat produk baru
    Product::create([
        'name' => $validated['name'],
        'slug' => Str::slug($validated['name']), // Otomatis membuat slug dari nama
        'brand' => $validated['brand'],
        'category_id' => $validated['category_id'],
        'price' => $validated['price'],
        'stock' => $validated['stock'],
        'color' => $validated['color'],
        'description' => $validated['description'],
        'image' => $imagePath,
    ]);

    

    // 4. Kembali ke halaman daftar produk dengan pesan sukses
    return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan!');
}
}