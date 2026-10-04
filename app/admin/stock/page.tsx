"use client";

import { useState, useEffect } from "react";
import { Product } from "@/data/types";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import seedData from "@/data/seed-data.json";

export default function AdminStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedStocks, setAddedStocks] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const loadProducts = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("*")
          .order("name");

        if (data && data.length > 0) {
          setProducts(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }
    }

    try {
      const local = localStorage.getItem("sb_custom_products");
      if (local) {
        setProducts(JSON.parse(local));
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    setProducts(
      (seedData.products as any[]).map((p) => ({
        ...p,
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleStockChange = (productId: number, val: number) => {
    setAddedStocks((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleAddStock = async (product: Product) => {
    const qty = addedStocks[product.id] || 0;
    if (qty <= 0) return;

    const newStock = product.stock + qty;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Update product stock
      await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", product.id);

      // Record movement
      await supabase.from("stock_movements").insert({
        product_id: product.id,
        type: "in",
        quantity: qty,
        notes: "Penambahan stok gudang",
        user_name: user?.user_metadata?.name || user?.email || "Petugas Gudang",
      });
    } catch {
      // ignore
    }

    // LocalStorage fallback update
    const updated = products.map((p) =>
      p.id === product.id ? { ...p, stock: newStock } : p
    );
    setProducts(updated);
    try {
      localStorage.setItem("sb_custom_products", JSON.stringify(updated));

      // Append to local movements
      const existingMovs = JSON.parse(
        localStorage.getItem("sb_stock_movements") || "[]"
      );
      const newMov = {
        id: Date.now(),
        product_id: product.id,
        product: { name: product.name },
        type: "in",
        quantity: qty,
        user_name: "Petugas Gudang",
        notes: "Penambahan stok gudang",
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(
        "sb_stock_movements",
        JSON.stringify([newMov, ...existingMovs])
      );
    } catch {
      // ignore
    }

    setAddedStocks((prev) => ({ ...prev, [product.id]: 0 }));
    setSuccessMsg(`Stok ${product.name} berhasil ditambah sebanyak ${qty}!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Kelola Stok Produk
      </h1>

      {successMsg && (
        <div className="bg-green-500 text-white font-bold text-center py-3 mb-6 rounded-lg shadow">
          {successMsg}
        </div>
      )}

      {/* Kotak Peringatan Stok Menipis */}
      {lowStockProducts.length > 0 && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r-lg shadow-sm"
          role="alert"
        >
          <p className="font-bold">Peringatan Stok Menipis!</p>
          <p className="text-sm mt-1">
            Produk berikut memiliki stok 5 atau kurang:
          </p>
          <ul className="list-disc ml-5 mt-2 text-sm space-y-0.5">
            {lowStockProducts.map((p) => (
              <li key={p.id}>
                {p.name} (Sisa: <span className="font-bold">{p.stock}</span>)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200 text-sm">
              <th className="p-3">Nama Produk</th>
              <th className="p-3">Stok Saat Ini</th>
              <th className="p-3">Jumlah Tambahan</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-gray-500">
                  Memuat data stok...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="p-3 font-semibold text-gray-800">
                    {product.name}
                  </td>
                  <td className="p-3 font-bold text-gray-900">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        product.stock <= 5
                          ? "bg-red-100 text-red-700"
                          : "text-gray-900"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={0}
                      value={addedStocks[product.id] ?? 0}
                      onChange={(e) =>
                        handleStockChange(
                          product.id,
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="w-24 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-center"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleAddStock(product)}
                      disabled={!addedStocks[product.id]}
                      className="bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      Tambah Stok
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-8 text-gray-500">
                  Belum ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
