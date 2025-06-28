<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function index()
    {
        // Ambil semua laporan, urutkan dari yang paling baru
        // 'with' digunakan untuk mengambil data relasi (items & user) secara efisien
        $reports = Report::with('items.product', 'user')->latest()->get();

        return view('admin.reports.index', ['reports' => $reports]);
    }

    public function showReceipt(Report $report)
 {
     // Eager load relasi untuk efisiensi
     $report->load('items.product', 'user');

     // Tampilkan view khusus untuk struk
     return view('admin.reports.receipt', ['report' => $report]);
 }

    public function destroy(Report $report)
 {
     // Kita tidak perlu mengembalikan stok karena ini adalah penghapusan data penjualan,
     // bukan proses refund/return barang.
     // Dengan onDelete('cascade') di migrasi, report_items akan ikut terhapus.
     $report->delete();

     return back()->with('success', 'Laporan #' . $report->id . ' berhasil dihapus.');
 } 
}