<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
        UserSeeder::class, // <-- Tambahkan ini di paling atas
        CategorySeeder::class,
        ProductSeeder::class,
    ]);
        // Panggil CategorySeeder yang baru kita buat
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class, // <-- Tambahkan ini
            // Kamu bisa tambahkan Seeder lain di sini nanti
        ]);   
    }
}