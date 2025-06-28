<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\Category::create(['name' => 'INTERIOR', 'slug' => 'interior', 'image' => 'kategori-interior.jpg']);
    \App\Models\Category::create(['name' => 'EKSTERIOR', 'slug' => 'eksterior', 'image' => 'kategori-eksterior.jpg']);
    \App\Models\Category::create(['name' => 'PELUMAS', 'slug' => 'pelumas', 'image' => 'kategori-pelumas.jpg']);
    \App\Models\Category::create(['name' => 'AUDIO & MULTIMEDIA', 'slug' => 'audio-multimedia', 'image' => 'kategori-audio-multimedia.jpg']);
    \App\Models\Category::create(['name' => 'KEAMANAN & EMERGENCY', 'slug' => 'keamanan-emergency', 'image' => 'kategori-keamanan-emergency.jpg']);
    \App\Models\Category::create(['name' => 'LAMPU & ELEKTRONIK', 'slug' => 'lampu-elektronik', 'image' => 'kategori-lampu-elektronik.jpg']);
}
}