<div>
    <form wire:submit="saveProduct" class="bg-white p-8 rounded-lg shadow-md">
        
        {{-- Menampilkan pesan error validasi di atas --}}
        @if ($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong class="font-bold">Oops! Ada yang salah.</strong>
                <ul class="list-disc ml-5 mt-2">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="grid md:grid-cols-2 gap-8">
            {{-- Kolom Kiri --}}
            <div>
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 font-bold mb-2">Nama Produk</label>
                    <input type="text" wire:model.blur="name" id="name" class="w-full px-3 py-2 border rounded-lg @error('name') border-red-500 @enderror" required>
                    @error('name') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
                <div class="mb-4">
                    <label for="brand" class="block text-gray-700 font-bold mb-2">Brand</label>
                    <input type="text" wire:model.blur="brand" id="brand" class="w-full px-3 py-2 border rounded-lg @error('brand') border-red-500 @enderror">
                    @error('brand') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
                 <div class="mb-4">
                    <label for="category_id" class="block text-gray-700 font-bold mb-2">Kategori</label>
                    <div class="flex gap-2">
                        <select wire:model.live="category_id" id="category_id" class="w-full px-3 py-2 border rounded-lg @error('category_id') border-red-500 @enderror" required>
                            <option value="">Pilih Kategori</option>
                            @foreach ($categories as $category)
                                <option value="{{ $category->id }}">{{ $category->name }}</option>
                            @endforeach
                        </select>
                        <button type="button" wire:click="$set('showCategoryModal', true)" class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">+</button>
                    </div>
                    @error('category_id') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
                <div class="mb-4">
                    <label for="price" class="block text-gray-700 font-bold mb-2">Harga</label>
                    <input type="number" wire:model.blur="price" id="price" class="w-full px-3 py-2 border rounded-lg @error('price') border-red-500 @enderror" required>
                    @error('price') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
                <div class="mb-4">
                    <label for="stock" class="block text-gray-700 font-bold mb-2">Stok Awal</label>
                    <input type="number" wire:model.blur="stock" id="stock" class="w-full px-3 py-2 border rounded-lg @error('stock') border-red-500 @enderror" required>
                    @error('stock') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
            </div>

            {{-- Kolom Kanan --}}
            <div>
                 <div class="mb-4">
                    <label for="color" class="block text-gray-700 font-bold mb-2">Warna</label>
                    <input type="text" wire:model.blur="color" id="color" class="w-full px-3 py-2 border rounded-lg @error('color') border-red-500 @enderror">
                    @error('color') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
                <div class="mb-4">
                    <label for="description" class="block text-gray-700 font-bold mb-2">Deskripsi</label>
                    <textarea wire:model.blur="description" id="description" rows="5" class="w-full px-3 py-2 border rounded-lg @error('description') border-red-500 @enderror"></textarea>
                    @error('description') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                </div>
                <div class="mb-4">
                    <label for="image" class="block text-gray-700 font-bold mb-2">Gambar Produk</label>
                    <input type="file" wire:model="image" id="image" class="w-full">
                    @error('image') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror

                    {{-- Loading state untuk upload gambar --}}
                    <div wire:loading wire:target="image" class="text-sm text-gray-500 mt-2">Uploading...</div>
                    
                    {{-- Preview Gambar --}}
                    @if ($image)
                        <div class="mt-4">
                            <p>Preview:</p>
                            <img src="{{ $image->temporaryUrl() }}" class="w-32 h-32 object-cover rounded-lg">
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="mt-8 text-right">
            <button type="submit" class="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors">
                Simpan Produk
            </button>
        </div>
    </form>

    {{-- Modal untuk Tambah Kategori Baru --}}
    @if($showCategoryModal)
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl w-1/3">
            <h3 class="font-bold text-xl mb-4">Tambah Kategori Baru</h3>
            <input type="text" wire:model="newCategoryName" class="w-full px-3 py-2 border rounded-lg mb-4" placeholder="Nama Kategori Baru" wire:keydown.enter="saveNewCategory">
            @error('newCategoryName') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
            <div class="flex justify-end gap-4 mt-4">
                <button type="button" wire:click="$set('showCategoryModal', false)" class="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">Batal</button>
                <button type="button" wire:click="saveNewCategory" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Simpan</button>
            </div>
        </div>
    </div>
    @endif
</div>