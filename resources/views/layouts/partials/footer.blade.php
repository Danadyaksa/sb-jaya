<footer class="bg-red-600">
    <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
            {{-- Logo --}}
            <a href="{{ route('home') }}">
                {{-- Ganti dengan path logo putihmu jika ada, atau biarkan seperti ini untuk efek CSS --}}
                <img src="{{ asset('images/logo.svg') }}" alt="SB Jaya Logo" class="h-12 brightness-0 invert"> 
            </a>

            {{-- Navigasi Footer --}}
            <nav class="flex space-x-6 mt-4 md:mt-0">

                {{-- GANTI link Home yang lama dengan yang ini --}}
                <a href="{{ request()->routeIs('home') ? '#page-top' : route('home') }}" class="text-white font-semibold hover:underline">Home</a>

                <a href="{{ route('about') ? '#page-top' : route('about') }}" class="text-white font-semibold hover:underline">About Us</a>
                <a href="{{ route('products.index') ? '#page-top' : route('products.index') }}" class="text-white font-semibold hover:underline">Products</a>
            </nav>
        </div>
    </div>
</footer>
