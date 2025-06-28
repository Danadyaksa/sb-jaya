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
    Schema::create('reports', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->comment('Kasir yang membuat laporan')->constrained();
        $table->string('customer_name')->nullable();
        $table->decimal('total_amount', 12, 2);
        $table->timestamps(); // Ini akan membuat created_at sebagai tanggal laporan
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
