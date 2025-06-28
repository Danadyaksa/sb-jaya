@extends('layouts.main')
@section('content')

    {{-- Bagian 1: Judul Utama --}}
    <section class="bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-center text-4xl font-poller uppercase">About Us</h1>
        </div>
    </section>

{{-- Bagian 2: About Our Website (Versi Revisi Final) --}}
<section class="bg-white py-16">
    <div class="container mx-auto px-4">

        {{-- =============================================== --}}
        {{-- TINGKAT ATAS: JUDUL DI TENGAH --}}
        {{-- =============================================== --}}
        <div class="text-center max-w-3xl mx-auto">
            <p class="text-red-600 font-bold tracking-wider mb-2">WEBSITE</p>
            <h2 class="text-5xl font-poller text-gray-900 mb-4">ABOUT OUR WEBSITE</h2>
            <p class="text-gray-500 font-bold">HOW OUR WEBSITE WORK</p>
        </div>

        {{-- =============================================== --}}
        {{-- TINGKAT BAWAH: KONTEN 2 KOLOM --}}
        {{-- =============================================== --}}
        <div class="grid md:grid-cols-2 gap-12 items-center mt-16">
            {{-- Kolom Kiri: Teks --}}
            <div>
                <h3 class="text-4xl font-poller text-gray-900 mb-4">AUTOPARTS CATALOGUE WEBSITE</h3>
                <p class="text-gray-600 leading-relaxed">
                    Website kami merupakan katalog dari barang dan aksesoris yang kami jual di toko. Anda dapat check ketersediaan barang di website kami, namun tidak dapat membelinya secara langsung melalui website.
                </p>
            </div>
            
            {{-- Kolom Kanan: Gambar --}}
            <div>
                <img src="images/orang1.png" alt="Tim SB Jaya" class="rounded-lg shadow-xl">
            </div>
        </div>

    </div>
</section>
    
    {{-- Bagian 3: "Tahun Melayani Anda" --}}
    <section class="bg-gray-50 py-12">
        <div class="container mx-auto px-4 flex justify-center items-center gap-6">
            <div class="border-2 border-red-600 rounded-full w-24 h-24 flex items-center justify-center">
                <span class="text-red-600 text-4xl font-poller">10</span>
            </div>
            <p class="text-3xl font-poller text-gray-800">Tahun <br> Dengan Tulus Melayani Anda</p>
        </div>
    </section>

    {{-- Bagian 4: Layanan Kami Dukung --}}
    <section class="bg-white py-16">
        <div class="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
             {{-- Kolom Kiri: Gambar --}}
            <div>
                <img src="images/orang2.png" alt="Layanan SB Jaya" class="rounded-lg shadow-xl">
            </div>
            {{-- Kolom Kanan: Teks --}}
            <div class="pl-0 md:pl-12">
                <p class="text-red-600 font-bold tracking-wider mb-2">LAYANAN KAMI</p>
                <h2 class="text-4xl font-poller text-gray-900 mb-8">LAYANAN YANG KAMI DUKUNG</h2>
                <div class="space-y-6">
                    {{-- Daftar Layanan --}}
                    <div class="flex items-center gap-4"><div class="bg-red-100 p-3 rounded-full"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z"></path></svg></div><span class="font-semibold text-gray-700 text-lg">Ganti Oli</span></div>
                    <div class="flex items-center gap-4"><div class="bg-red-100 p-3 rounded-full"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div><span class="font-semibold text-gray-700 text-lg">Aksesoris Mobil</span></div>
                    <div class="flex items-center gap-4"><div class="bg-red-100 p-3 rounded-full"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.49l-1.955 5.236a1 1 0 01-1.858.068l-2.114-5.96a1 1 0 01.37-1.16l5.236-1.955a1 1 0 011.16.37z"></path></svg></div><span class="font-semibold text-gray-700 text-lg">Cek dan Ganti Aki</span></div>
                    <div class="flex items-center gap-4"><div class="bg-red-100 p-3 rounded-full"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div><span class="font-semibold text-gray-700 text-lg">Servis</span></div>
                </div>
            </div>
        </div>
    </section>

    {{-- Bagian 5: Lokasi Toko Kami --}}
    <section class="bg-gray-900 text-white -mb-16">
        <div class="container mx-auto px-4 py-24 text-center">
            <p class="text-red-600 font-bold tracking-wider mb-2">LOKASI</p>
            <h2 class="text-4xl font-poller mb-12">LOKASI TOKO KAMI</h2>

            <div class="bg-white text-gray-800 rounded-xl shadow-2xl p-8 max-w-5xl mx-auto">
                {{-- Info Kontak --}}
                <div class="grid md:grid-cols-3 gap-8 text-left mb-8">
                    <div class="flex gap-4 items-start"><div class="mt-1 bg-red-100 p-3 rounded-full"></div><div><h3 class="font-bold">LOKASI</h3><p class="text-sm text-gray-600">Jl. Raya Demak-Kudus no.29 rt.1/rw.1 Mranak Wonosalam Demak Jawa Tengah</p></div></div>
                    <div class="flex gap-4 items-start"><div class="mt-1 bg-red-100 p-3 rounded-full"></div><div><h3 class="font-bold">KONTAK</h3><p class="text-sm text-gray-600">Nomor Telepon Kantor: 0291686006<br>Nomor WhatsApp: 08122818095</p></div></div>
                    <div class="flex gap-4 items-start"><div class="mt-1 bg-red-100 p-3 rounded-full"></div><div><h3 class="font-bold">JAM BUKA</h3><p class="text-sm text-gray-600">Senin - Sabtu<br>07.00 - 17.00</p></div></div>
                </div>
                {{-- Peta --}}
                <div class="w-full h-80 rounded-lg overflow-hidden border-4 border-white">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0346170951098!2d110.65263687492106!3d-6.886457067385804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70ebd700be14a1%3A0x76d8990a71f43ea1!2sSB%20JAYA%20Variasi!5e0!3m2!1sen!2sid!4v1749316837439!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="w-full h-full object-cover" alt="Peta Lokasi"></iframe>
                </div>
            </div>
        </div>
    </section>

@endsection