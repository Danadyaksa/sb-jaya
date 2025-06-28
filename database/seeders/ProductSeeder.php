<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product; // <-- Jangan lupa import

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\Product::create([
        'name' => 'Shell Helix HX8 5W-30',
        'slug' => 'shell-helix-hx8',
        'brand' => 'Shell',
        'description' => 'Deskripsi lengkap untuk Shell Helix...',
        'price' => 500000,
        'stock' => 50,
        'color' => 'Kuning',
        'image' => 'shell-helix.jpg',
        'category_id' => 3 // ID untuk PELUMAS
    ]);

    \App\Models\Product::create([
        'name' => 'STP Tuff Stuff Foam Cleaner',
        'slug' => 'stp-tuff-stuff',
        'brand' => 'STP',
        'description' => 'Deskripsi lengkap untuk STP Tuff Stuff...',
        'price' => 100000,
        'stock' => 25,
        'color' => null,
        'image' => 'stp-tuff-stuff.jpg',
        'category_id' => 1 // ID untuk INTERIOR
    ]);
    // Tambahkan produk lainnya dengan format yang sama...
}
}