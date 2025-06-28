@extends('layouts.admin')

@section('content')
    <h1 class="text-3xl font-bold text-gray-800">Selamat Datang, {{ Auth::user()->name }}!</h1>
    <p class="mt-2 text-gray-600">Ini adalah halaman dashboard-mu. Silakan pilih menu di sidebar untuk memulai.</p>

    {{-- Nanti di sini kita akan langsung menampilkan halaman "Kelola Produk" --}}
@endsection