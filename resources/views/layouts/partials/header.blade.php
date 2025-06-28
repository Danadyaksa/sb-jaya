<header class="bg-white shadow-md">
    <div class="container mx-auto px-4">
        {{-- BAGIAN ATAS: LOGO, SEARCH, FAVOURITES, LOGIN --}}
        <div class="flex justify-between items-center py-4">
            <a href="{{ route('home') }}">
                <img src="{{asset('images/logo.svg')}}" alt="SB Jaya Logo" class="h-12"> {{-- Sesuaikan tinggi logo 'h-12' --}}
            </a>

            <div class="w-1/3">
    <form action="{{ route('products.index') }}" method="GET" class="relative">
        <input type="text" name="search" placeholder="Cari produk..." 
               value="{{ request('search') }}"
               class="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
        <button type="submit" class="absolute inset-y-0 right-0 px-4 bg-red-600 text-white rounded-r-md hover:bg-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
        </button>
    </form>
</div>

            {{-- Favourites & Login/Logout --}}
<div class="flex items-center space-x-6">
    
    <a href="{{ route('favorites.index') }}" class="flex items-center space-x-2 text-gray-700 hover:text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="font-semibold">FAVOURITES</span>
    </a>

    @guest
        {{-- TAMPILAN JIKA PENGUNJUNG ADALAH TAMU (BELUM LOGIN) --}}
        <a href="{{ route('login') }}" class="flex items-center space-x-2 text-gray-700 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="font-semibold">LOGIN</span>
        </a>
    @endguest

    @auth
    {{-- TAMPILAN JIKA PENGUNJUNG SUDAH LOGIN --}}
    <div class="flex items-center space-x-4">

        {{-- Tampilkan link Dashboard HANYA jika role-nya BUKAN customer --}}
        @if (Auth::user()->role !== 'customer')
            <a href="{{ route('dashboard') }}" class="font-semibold text-gray-700 hover:text-red-600">
                Dashboard
            </a>
        @endif

        {{-- Form untuk Logout (selalu tampil untuk semua user yang login) --}}
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <a href="{{ route('logout') }}"
                    onclick="event.preventDefault(); this.closest('form').submit();"
                    class="text-gray-700 hover:text-red-600 font-semibold">
                {{ __('LOG OUT') }}
            </a>
        </form>
    </div>
@endauth
</div>
        </div>
    </div>

   
    {{-- BAGIAN BAWAH: NAVIGASI --}}
<nav class="bg-gray-800">
    <div class="container mx-auto px-4">
        {{-- Kita gunakan flex dan justify-center untuk menengahkan seluruh grup menu --}}
        <div class="flex items-center justify-center">

            {{-- Link HOME --}}
            <a href="{{ route('home') }}" 
               class="flex items-center space-x-2 px-5 py-3 text-white font-bold {{ request()->routeIs('home') ? 'bg-red-600' : 'hover:bg-gray-700' }}">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>HOME</span>
            </a>

            {{-- Link ABOUT US --}}
            <a href="{{ route('about') }}" 
               class="flex items-center space-x-2 px-5 py-3 text-white font-bold {{ request()->routeIs('about') ? 'bg-red-600' : 'hover:bg-gray-700' }}">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <span>ABOUT US</span>
            </a>

            {{-- Link PRODUCTS --}}
            <a href="{{ route('products.index') }}"
               class="flex items-center space-x-2 px-5 py-3 text-white font-bold {{ request()->routeIs('products.index') ? 'bg-red-600' : 'hover:bg-gray-700' }}"> 
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>PRODUCTS</span>
            </a>

        </div>
    </div>
</nav>
</header>