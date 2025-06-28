<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with(['products' => function ($query) {
            $query->take(4);
        }])->get();

        // PASTIKAN BLOK INI ADA
        $breadcrumbs = [
            ['name' => 'Home', 'url' => route('home')],
            ['name' => 'Products', 'url' => route('products.index')],
            ['name' => 'Categories', 'url' => '#'] 
        ];

        // PASTIKAN 'breadcrumbs' DIKIRIM KE VIEW
        return view('categories.index', [
            'categories' => $categories,
            'breadcrumbs' => $breadcrumbs
        ]);
    }
}