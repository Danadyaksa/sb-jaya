"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { StockMovement } from "@/data/types";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { exportToCleanCsv } from "@/utils/exportCsv";

export default function StockHistoryPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);

      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("stock_movements")
            .select("*, product:products(*)")
            .order("id", { ascending: false });

          if (!error && data && data.length > 0) {
            setMovements(data);
            setLoading(false);
            return;
          }
        } catch {
          // ignore
        }
      }

      // Check localStorage fallback
      try {
        const local = localStorage.getItem("sb_stock_movements");
        if (local) {
          setMovements(JSON.parse(local));
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }

      // Sample mock history for demonstration if empty
      setMovements([
        {
          id: 1,
          created_at: new Date().toISOString(),
          product: { name: "Oli Mesin Shell Helix HX7 10W-40" },
          type: "in",
          quantity: 24,
          user_name: "Petugas Gudang",
          notes: "Restock mingguan distributor",
        },
        {
          id: 2,
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          product: { name: "Aki GS Astra Hybrid NS60" },
          type: "out",
          quantity: 2,
          user_name: "Kasir SB Jaya",
          notes: "Penjualan #INV-001",
        },
      ]);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const handleExportCsv = () => {
    const headers = [
      "No",
      "Tanggal & Waktu",
      "Nama Produk / Onderdil",
      "Tipe Mutasi",
      "Jumlah (Pcs)",
      "Petugas",
      "Keterangan",
    ];

    const rows = movements.map((m, idx) => [
      idx + 1,
      new Date(m.created_at).toLocaleString("id-ID"),
      m.product?.name || `Produk #${m.product_id}`,
      m.type === "in" ? "MASUK (IN)" : "KELUAR (OUT)",
      m.quantity,
      m.user_name || "Admin Gudang",
      m.notes || "-",
    ]);

    const totalIn = movements
      .filter((m) => m.type === "in")
      .reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);

    const totalOut = movements
      .filter((m) => m.type === "out")
      .reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);

    const summaryRow = [
      "TOTAL",
      "",
      "",
      `IN: ${totalIn} Pcs | OUT: ${totalOut} Pcs`,
      totalIn - totalOut,
      "",
      "",
    ];

    exportToCleanCsv({
      filename: `Riwayat_Stok_Gudang_SB_Jaya_${Date.now()}.csv`,
      title: "Laporan Riwayat Mutasi Stok Gudang",
      metadata: {
        "Total Catatan": `${movements.length} Baris`,
        "Total Barang Masuk (IN)": `${totalIn} Pcs`,
        "Total Barang Keluar (OUT)": `${totalOut} Pcs`,
      },
      headers,
      rows,
      summaryRow,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Riwayat Pergerakan Stok
          </h1>
          <p className="text-sm text-gray-500">
            Audit log barang masuk dan keluar suku cadang
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={movements.length === 0}
          className="bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm text-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3">Produk</th>
              <th className="py-3 px-3">Tipe</th>
              <th className="py-3 px-3">Jumlah</th>
              <th className="py-3 px-3">Oleh</th>
              <th className="py-3 px-3">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  Memuat riwayat pergerakan stok...
                </td>
              </tr>
            ) : movements.length > 0 ? (
              movements.map((movement) => (
                <tr key={movement.id} className="border-b last:border-b-0 hover:bg-gray-50 text-sm">
                  <td className="p-3 text-gray-500">
                    {new Date(movement.created_at).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 font-semibold text-gray-800">
                    {movement.product?.name || "Produk #" + movement.product_id}
                  </td>
                  <td className="p-3">
                    {movement.type === "in" ? (
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                        IN
                      </span>
                    ) : (
                      <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs">
                        OUT
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-gray-900">
                    {movement.quantity}
                  </td>
                  <td className="p-3 text-gray-700">
                    {movement.user_name || "Admin"}
                  </td>
                  <td className="p-3 text-gray-500 text-xs">
                    {movement.notes || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  Belum ada riwayat pergerakan stok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
