"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatIDR, getProductImageUrl } from "@/data/utils";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { exportToCleanCsv } from "@/utils/exportCsv";
import { FileText, Plus, Download, Calendar, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

type DateFilterPreset = "all" | "today" | "week" | "month" | "custom";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [dateFilter, setDateFilter] = useState<DateFilterPreset>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadReports = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("reports")
          .select("*, items:report_items(*, product:products(*))")
          .order("id", { ascending: false });

        if (!error && data && data.length > 0) {
          setReports(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }
    }

    try {
      const local = localStorage.getItem("sb_reports");
      if (local) {
        setReports(JSON.parse(local));
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    setReports([]);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDelete = async (reportId: number) => {
    if (
      !confirm(
        "Yakin ingin menghapus laporan ini? Tindakan ini tidak bisa dibatalkan."
      )
    )
      return;

    try {
      const supabase = createClient();
      await supabase.from("reports").delete().eq("id", reportId);
    } catch {
      // ignore
    }

    const updated = reports.filter((r) => r.id !== reportId);
    setReports(updated);
    try {
      localStorage.setItem("sb_reports", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Filter reports berdasarkan rentang tanggal
  const filteredReports = useMemo(() => {
    if (dateFilter === "all") return reports;

    const now = new Date();

    return reports.filter((r) => {
      const itemDate = new Date(r.created_at);

      if (dateFilter === "today") {
        return (
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }

      if (dateFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo && itemDate <= now;
      }

      if (dateFilter === "month") {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }

      if (dateFilter === "custom") {
        if (!startDate && !endDate) return true;
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(`${endDate}T23:59:59`) : new Date();
        return itemDate >= start && itemDate <= end;
      }

      return true;
    });
  }, [reports, dateFilter, startDate, endDate]);

  // Kalkulasi Ringkasan Finansial
  const summary = useMemo(() => {
    const totalTransactions = filteredReports.length;
    const totalRevenue = filteredReports.reduce(
      (sum, r) => sum + (Number(r.total_amount) || 0),
      0
    );
    const avgTransaction =
      totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

    return { totalTransactions, totalRevenue, avgTransaction };
  }, [filteredReports]);

  // Export ke Excel / CSV
  const handleExportCsv = () => {
    const filterLabelMap: Record<DateFilterPreset, string> = {
      all: "Semua Waktu",
      today: "Hari Ini",
      week: "7 Hari Terakhir",
      month: "Bulan Ini",
      custom: `${startDate || "Awal"} s/d ${endDate || "Sekarang"}`,
    };

    const headers = [
      "No",
      "No. Laporan",
      "Waktu Transaksi",
      "Nama Pelanggan",
      "Kasir",
      "Jumlah Item",
      "Total Belanja (Rp)",
    ];

    const rows = filteredReports.map((r, index) => {
      const itemCount =
        r.items?.reduce((c: number, it: any) => c + (Number(it.quantity) || 1), 0) || 0;
      return [
        index + 1,
        `#${r.id}`,
        new Date(r.created_at).toLocaleString("id-ID"),
        r.customer_name || "Umum",
        r.cashier_name || "Kasir SB Jaya",
        itemCount,
        Number(r.total_amount) || 0,
      ];
    });

    const summaryRow = [
      "TOTAL",
      "",
      "",
      "",
      "",
      `${summary.totalTransactions} Transaksi`,
      summary.totalRevenue,
    ];

    exportToCleanCsv({
      filename: `Laporan_Penjualan_SB_Jaya_${dateFilter}_${Date.now()}.csv`,
      title: "Laporan Rekap Penjualan Kasir",
      metadata: {
        "Periode Laporan": filterLabelMap[dateFilter],
        "Total Transaksi": `${summary.totalTransactions} Transaksi`,
        "Total Omzet": formatIDR(summary.totalRevenue),
        "Rata-rata Transaksi": formatIDR(summary.avgTransaction),
      },
      headers,
      rows,
      summaryRow,
    });
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Laporan Penjualan</h1>
            <p className="text-sm text-gray-500">
              Rekap transaksi kasir dan audit omzet Toko SB Jaya
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredReports.length === 0}
            className="bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel / CSV</span>
          </button>
          <Link
            href="/admin/reports/create"
            className="bg-red-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Transaksi POS</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Total Omzet
            </p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              {formatIDR(summary.totalRevenue)}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Total Transaksi
            </p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              {summary.totalTransactions} Transaksi
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Rata-rata Transaksi
            </p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              {formatIDR(summary.avgTransaction)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Periode:
          </span>
          {(
            [
              { key: "all", label: "Semua Waktu" },
              { key: "today", label: "Hari Ini" },
              { key: "week", label: "7 Hari Terakhir" },
              { key: "month", label: "Bulan Ini" },
              { key: "custom", label: "Kustom Tanggal" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setDateFilter(item.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                dateFilter === item.key
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {dateFilter === "custom" && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-red-500"
            />
            <span className="text-gray-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-red-500"
            />
          </div>
        )}
      </div>

      {/* List Laporan */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16 text-gray-500 bg-white rounded-lg border">
            <p>Memuat laporan penjualan...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              {/* Header Laporan */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">
                      Laporan #{report.id}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/admin/reports/${report.id}/receipt`}
                    target="_blank"
                    className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                  >
                    Lihat Struk
                  </Link>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-gray-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded hover:bg-red-100 transition-colors"
                  >
                    Hapus
                  </button>
                </div>

                <div className="text-left sm:text-right text-xs text-gray-600">
                  <p>Customer: <span className="font-medium text-gray-800">{report.customer_name || "Umum"}</span></p>
                  <p>Kasir: <span className="font-medium text-gray-800">{report.cashier_name || "Kasir SB Jaya"}</span></p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b text-xs uppercase tracking-wider">
                    <th className="py-2">Produk</th>
                    <th className="py-2">Harga</th>
                    <th className="py-2">Jumlah</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.items?.map((item: any) => {
                    const imageUrl = getProductImageUrl(
                      item.product?.image_url || item.product?.image
                    );
                    return (
                      <tr key={item.id} className="border-b last:border-b-0">
                        <td className="py-2.5 flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt={item.product_name || item.product?.name}
                            className="w-10 h-10 object-contain rounded bg-gray-50 p-1 border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/default-product.svg";
                            }}
                          />
                          <span className="font-medium text-gray-800">
                            {item.product_name || item.product?.name}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-600">{formatIDR(item.price)}</td>
                        <td className="py-2.5 text-gray-600">{item.quantity} Pcs</td>
                        <td className="py-2.5 text-right font-semibold text-gray-900">
                          {formatIDR(item.price * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-right mt-4 border-t pt-3 flex justify-end items-center gap-2">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Grand Total:
                </span>
                <span className="font-bold text-lg text-gray-900">
                  {formatIDR(report.total_amount)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-lg border border-gray-200 p-8">
            <p className="text-base font-medium">Tidak ada laporan pada rentang tanggal ini.</p>
            <Link
              href="/admin/reports/create"
              className="mt-3 inline-block text-red-600 font-semibold text-sm hover:underline"
            >
              Buat Transaksi / Laporan Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
