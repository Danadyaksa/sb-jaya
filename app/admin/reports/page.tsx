"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Report } from "@/data/types";
import { formatIDR, getProductImageUrl } from "@/data/utils";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { FileText, Plus } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <FileText className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-800">Laporan Penjualan</h1>
        </div>
        <Link
          href="/admin/reports/create"
          className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Laporan</span>
        </Link>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <p>Memuat laporan penjualan...</p>
          </div>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              {/* Header Laporan */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="font-bold text-xl text-gray-800">
                      Laporan #{report.id}
                    </h2>
                    <p className="text-sm text-gray-500">
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
                    className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Lihat Struk
                  </Link>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-gray-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Hapus
                  </button>
                </div>

                <div className="text-left sm:text-right text-sm text-gray-500">
                  <p>Customer: {report.customer_name || "-"}</p>
                  <p>Kasir: {report.cashier_name || "Kasir SB Jaya"}</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="p-2">Produk</th>
                    <th className="p-2">Harga</th>
                    <th className="p-2">Jumlah</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.items?.map((item: any) => {
                    const imageUrl = getProductImageUrl(
                      item.product?.image_url || item.product?.image
                    );
                    return (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 flex items-center gap-4">
                          <img
                            src={imageUrl}
                            alt={item.product_name || item.product?.name}
                            className="w-12 h-12 object-contain rounded-md bg-gray-100 p-1 border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/default-product.svg";
                            }}
                          />
                          <span className="font-semibold text-gray-800">
                            {item.product_name || item.product?.name}
                          </span>
                        </td>
                        <td className="p-2">{formatIDR(item.price)}</td>
                        <td className="p-2">{item.quantity} Pcs</td>
                        <td className="p-2 text-right font-bold text-gray-900">
                          {formatIDR(item.price * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-right mt-4 border-t pt-4">
                <span className="text-gray-600 font-semibold mr-2">
                  Grand Total:
                </span>
                <span className="font-bold text-xl text-gray-900">
                  {formatIDR(report.total_amount)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <p className="text-xl">Belum ada laporan yang dibuat.</p>
            <Link
              href="/admin/reports/create"
              className="mt-4 inline-block text-red-600 font-semibold"
            >
              Buat Transaksi / Laporan Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
