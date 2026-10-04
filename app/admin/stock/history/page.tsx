"use client";

import { useState, useEffect } from "react";
import { StockMovement } from "@/data/types";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Riwayat Pergerakan Stok
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200 text-sm">
              <th className="p-3">Tanggal</th>
              <th className="p-3">Produk</th>
              <th className="p-3">Tipe</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Oleh</th>
              <th className="p-3">Catatan</th>
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
                <tr key={movement.id} className="border-b hover:bg-gray-50 text-sm">
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
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        IN
                      </span>
                    ) : (
                      <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
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
