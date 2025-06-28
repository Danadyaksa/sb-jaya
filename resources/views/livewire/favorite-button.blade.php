<div>
    @if ($isFavorited)
        {{-- Tombol jika SUDAH jadi favorit --}}
        <button wire:click="toggleFavorite" class="w-full bg-gray-500 text-white font-bold py-2 rounded-md hover:bg-gray-600 transition-colors">
            Remove from Fav
        </button>
    @else
        {{-- Tombol jika BELUM jadi favorit --}}
        <button wire:click="toggleFavorite" class="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition-colors">
            Add to Fav
        </button>
    @endif
</div>