<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // <-- Jangan lupa import

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Membuat user Kasir
        User::create([
            'name' => 'Kasir Toko',
            'email' => 'kasir@sbjaya.com',
            'password' => bcrypt('kasir123'),
            'role' => 'kasir',
        ]);

        // Membuat user Gudang
        User::create([
            'name' => 'Staff Gudang',
            'email' => 'gudang@sbjaya.com',
            'password' => bcrypt('gudang123'),
            'role' => 'gudang',
        ]);
    }
}
