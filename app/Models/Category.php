<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; // <-- Pastikan ada 'use Model'

class Category extends Model
{
    use HasFactory;

    // Tambahkan relasi ke Product
    protected $fillable = [
        'name',
        'slug',
        'image', // <-- Kita masukkan juga 'image' yang pernah kita tambah
    ];
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function getImageUrlAttribute(): string
    {
        if ($this->image && file_exists(public_path('storage/' . $this->image))) {
            return asset('storage/' . $this->image);
        }
        return asset('images/default-product.svg');
    }
}
?>