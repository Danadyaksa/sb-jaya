<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Livewire\WithFileUploads; // Untuk handle upload gambar

class ProductForm extends Component
{
    use WithFileUploads;

    // Properti untuk menampung data dari form
    public $name, $brand, $category_id, $price, $stock, $color, $description, $image;

    // Properti untuk modal tambah kategori
    public $showCategoryModal = false;
    public $newCategoryName = '';

    public function saveProduct()
    {
        $validated = $this->validate([
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'color' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = $this->image ? $this->image->store('products', 'public') : null;

        Product::create([
            'name' => $this->name,
            'slug' => Str::slug($this->name),
            'brand' => $this->brand,
            'category_id' => $this->category_id,
            'price' => $this->price,
            'stock' => $this->stock,
            'color' => $this->color,
            'description' => $this->description,
            'image' => $imagePath,
        ]);

        session()->flash('success', 'Produk berhasil ditambahkan!');
        return redirect()->route('admin.products.index');
    }

    public function saveNewCategory()
    {
        $this->validate(['newCategoryName' => 'required|string|unique:categories,name']);

        $category = Category::create([
            'name' => strtoupper($this->newCategoryName),
            'slug' => Str::slug($this->newCategoryName),
        ]);

        $this->category_id = $category->id; // Langsung pilih kategori yang baru dibuat
        $this->showCategoryModal = false; // Tutup modal
        $this->newCategoryName = ''; // Kosongkan input modal
    }

    public function render()
    {
        $categories = Category::orderBy('name')->get();
        return view('livewire.product-form', [
            'categories' => $categories
        ]);
    }
}