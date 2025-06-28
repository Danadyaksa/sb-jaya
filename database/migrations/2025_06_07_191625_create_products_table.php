<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id(); // ID
        $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Kategori
        $table->string('name'); // Nama
        $table->string('slug')->unique();
        $table->string('brand')->nullable(); // Brand
        $table->text('description')->nullable(); // Deskripsi
        $table->decimal('price', 12, 2); // Harga
        $table->integer('stock')->default(0); // Stok
        $table->string('color')->nullable(); // Warna
        $table->string('image')->nullable(); // Gambar
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
