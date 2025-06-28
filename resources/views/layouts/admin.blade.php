<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-t">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Admin Panel - {{ config('app.name', 'Laravel') }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles {{-- <-- TAMBAHKAN INI --}}

    
</head>
<body x-data="{ pageLoaded: false }" x-init="setTimeout(() => { pageLoaded = true }, 250)">
    <div class="flex h-screen bg-gray-100">

        {{-- Sidebar --}}
        <aside class="w-64 bg-white shadow-md flex flex-col">
            <div class="p-6 border-b">
                <a href="{{ route('home') }}">
                    <img src="{{ asset('images/logo.svg') }}" alt="Logo" class="h-10">
                </a>
            </div>

            <div class="p-6 border-b">
                <p class="font-bold text-lg">{{ Auth::user()->name }}</p>
                <p class="text-sm text-gray-500 capitalize">Login as {{ Auth::user()->role }}</p>
            </div>

            <nav class="mt-6 flex-1">
    {{-- MENU UNTUK KASIR --}}
    @if(Auth::user()->role === 'kasir')
        <a href="{{ route('admin.products.index') }}" 
           class="block py-2.5 px-6 font-semibold transition-colors {{ request()->routeIs('admin.products.*') ? 'bg-red-100 text-red-600 border-r-4 border-red-500' : 'text-gray-700 hover:bg-red-50' }}">
            Kelola Produk
        </a>
        <a href="{{ route('admin.reports.index') }}" 
           class="block py-2.5 px-6 font-semibold transition-colors {{ request()->routeIs('admin.reports.*') ? 'bg-red-100 text-red-600 border-r-4 border-red-500' : 'text-gray-700 hover:bg-red-50' }}">
            Laporan
        </a>
        {{-- Di dalam @if(Auth::user()->role === 'kasir') --}}
        <a href="{{ route('admin.kategori.index') }}" 
        class="block py-2.5 px-6 font-semibold transition-colors {{ request()->routeIs('admin.kategori.*') ? 'bg-red-100 text-red-600 border-r-4 border-red-500' : 'text-gray-700 hover:bg-red-50' }}">
            Kelola Kategori
        </a>
    @endif

    {{-- MENU UNTUK GUDANG --}}
    @if(Auth::user()->role === 'gudang')
        <a href="{{ route('admin.stock.index') }}"
           class="block py-2.5 px-6 font-semibold transition-colors {{ request()->routeIs('admin.stock.index') ? 'bg-red-100 text-red-600 border-r-4 border-red-500' : 'text-gray-700 hover:bg-red-50' }}">
            Kelola Stok
        </a>
    @endif

    {{-- ▼▼▼ MENU BERSAMA UNTUK KASIR & GUDANG ▼▼▼ --}}
    @if(in_array(Auth::user()->role, ['kasir', 'gudang']))
        <a href="{{ route('admin.stock.history') }}" 
           class="block py-2.5 px-6 font-semibold transition-colors {{ request()->routeIs('admin.stock.history') ? 'bg-red-100 text-red-600 border-r-4 border-red-500' : 'text-gray-700 hover:bg-red-50' }}">
            Riwayat Stok
        </a>
    @endif
</nav>

            <div class="p-6">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="w-full text-left border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        Logout
                    </button>
                </form>
            </div>
        </aside>

        {{-- Konten Utama --}}
        <main x-show="pageLoaded" x-transition:enter.duration.500ms class="flex-1 p-8 overflow-y-auto">
    {{-- ▼▼▼ TAMBAHKAN BLOK INI ▼▼▼ --}}
    @if (session('success'))
        <div class="bg-green-500 text-white font-bold text-center py-3 mb-6 rounded-lg" role="alert">
            {{ session('success') }}
        </div>
    @endif
    {{-- ▲▲▲ SAMPAI SINI ▲▲▲ --}}

    @yield('content')
</main>

    </div>

            
    @livewireScripts {{-- <-- TAMBAHKAN INI --}}
</body>
</html>