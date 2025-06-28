@props(['title', 'breadcrumbs' => []]) {{-- Defaultnya sekarang array kosong --}}

<section class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8 text-center">
        <h1 class="text-4xl font-poller uppercase">{{ $title }}</h1>

        {{-- Tampilkan breadcrumbs hanya jika array-nya tidak kosong --}}
        @if(count($breadcrumbs) > 0)
            <nav class="text-sm text-gray-400 mt-2 flex justify-center items-center space-x-2">
                {{-- Loop setiap item breadcrumb --}}
                @foreach ($breadcrumbs as $breadcrumb)
                    {{-- Jika item punya URL, buat menjadi link. Jika tidak, tampilkan sebagai teks biasa. --}}
                    @if($breadcrumb['url'] !== '#')
                        <a href="{{ $breadcrumb['url'] }}" class="hover:text-white transition-colors">{{ $breadcrumb['name'] }}</a>
                    @else
                        <span class="text-white font-semibold">{{ $breadcrumb['name'] }}</span>
                    @endif

                    {{-- Tampilkan pemisah '/' jika ini bukan item terakhir --}}
                    @if (!$loop->last)
                        <span>/</span>
                    @endif
                @endforeach
            </nav>
        @endif
    </div>
</section>