<?php

namespace App\Livewire;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class FavoriteButton extends Component
{
    public Product $product;
    public bool $isFavorited;

    // Method ini berjalan saat component pertama kali dimuat
    public function mount()
    {
        // Cek status favorit awal
        $this->isFavorited = Auth::check() && Auth::user()->favorites->contains($this->product);
    }

    // Method ini berjalan saat tombol di-klik
    // app/Livewire/FavoriteButton.php

public function toggleFavorite()
{
    // Kita tidak perlu lagi cek Auth::check() di sini karena component ini
    // sekarang hanya akan di-load untuk user yang sudah login.
    Auth::user()->favorites()->toggle($this->product->id);

    // Update status favorit setelah di-toggle
    $this->isFavorited = !$this->isFavorited;
}

    public function render()
    {
        return view('livewire.favorite-button');
    }
}