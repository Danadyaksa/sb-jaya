<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return view('admin.categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Nanti bisa kita buat jika diperlukan
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Nanti bisa kita buat jika diperlukan
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $kategori) // <-- PERUBAHAN DI SINI
    {
        // Kirim ke view dengan nama variabel 'category' agar view tidak perlu diubah
        return view('admin.categories.edit', ['category' => $kategori]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $kategori) // <-- PERUBAHAN DI SINI
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ];

        if ($request->hasFile('image')) {
            if ($kategori->image) { // <-- Menggunakan $kategori
                Storage::disk('public')->delete($kategori->image);
            }
            $updateData['image'] = $request->file('image')->store('categories', 'public');
        }

        $kategori->update($updateData); // <-- Menggunakan $kategori

        return redirect()->route('admin.kategori.index')->with('success', 'Kategori berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}