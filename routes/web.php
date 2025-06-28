<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FavoriteController; // Tambahkan ini di atas
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\StockController; // Tambahkan ini di atas
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController; // Gunakan alias agar tidak bentrok

/*
|--------------------------------------------------------------------------
| Rute untuk Halaman Publik (Bisa diakses semua orang)
|--------------------------------------------------------------------------
*/

// Halaman Utama
Route::get('/', [HomeController::class, 'index'])->name('home');

// Halaman Statis About Us
Route::get('/about-us', function () {
    return view('about');
})->name('about');

// Halaman Daftar Semua Produk
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

// Halaman Daftar Semua Kategori
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

// Halaman Daftar Produk per Kategori
Route::get('/kategori/{category:slug}', [ProductController::class, 'indexByCategory'])->name('products.by_category');

// Halaman Detail Produk
Route::get('/produk/{product:slug}', [ProductController::class, 'show'])->name('products.show');


/*
|--------------------------------------------------------------------------
| Rute Bawaan Breeze (Untuk User yang Login)
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    // Langsung arahkan ke halaman utama admin yaitu Kelola Produk
    return redirect()->route('admin.products.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/favorites/{product}', [FavoriteController::class, 'store'])->name('favorites.add');
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
});

Route::middleware(['auth', 'role:kasir,gudang'])->prefix('admin')->name('admin.')->group(function () {    // Halaman Kelola Produk
    Route::get('/produk', [ProductController::class, 'manage'])->name('products.index');
    Route::get('/produk/tambah', [ProductController::class, 'create'])->name('products.create');
    Route::post('/produk', [ProductController::class, 'store'])->name('products.store');
    Route::get('/produk/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::put('/produk/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::get('/laporan/tambah', function() {
    return view('admin.reports.create');
})->name('reports.create');
    Route::get('/laporan', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/laporan/{report}/struk', [ReportController::class, 'showReceipt'])->name('reports.receipt');
    Route::get('/stok', [StockController::class, 'index'])->name('stock.index');
    Route::put('/stok/{product}', [StockController::class, 'update'])->name('stock.update');
    Route::get('/stok/riwayat', [StockController::class, 'history'])->name('stock.history');
    Route::delete('/laporan/{report}', [ReportController::class, 'destroy'])->name('reports.destroy');
    Route::resource('/kategori', AdminCategoryController::class)->except(['show']);

    // Nanti kita tambahkan route lain untuk tambah, edit, hapus di sini
});

// Ini akan memuat semua rute untuk login, register, logout, dll.
require __DIR__.'/auth.php';