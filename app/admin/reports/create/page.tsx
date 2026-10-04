"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/types";
import { formatIDR } from "@/data/utils";
import { createClient } from "@/utils/supabase/client";
import seedData from "@/data/seed-data.json";

interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

export default function CreateReportPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("products")
          .select("*")
          .order("name");
        if (data && data.length > 0) {
          setAllProducts(data);
          return;
        }
      } catch {
        // ignore
      }

      setAllProducts(
        (seedData.products as any[]).map((p) => ({
          ...p,
          price: Number(p.price) || 0,
          stock: Number(p.stock) || 0,
        }))
      );
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.brand && p.brand.toLowerCase().includes(term))
      )
      .slice(0, 6);

    setSearchResults(filtered);
  }, [searchTerm, allProducts]);

  const addProductToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: 1,
        },
      ];
    });

    setSearchTerm("");
    setSearchResults([]);
  };

  const updateQuantity = (id: number, qty: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const validQty = Math.max(1, Math.min(qty, item.stock));
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeCartItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const invoiceNumber = `INV-${Date.now()}`;

      // Insert into reports
      const { data: report, error } = await supabase
        .from("reports")
        .insert({
          invoice_number: invoiceNumber,
          customer_name: customerName.trim() || null,
          cashier_name:
            user?.user_metadata?.name || user?.email || "Kasir SB Jaya",
          total_amount: totalAmount,
          payment_method: "tunai",
        })
        .select()
        .single();

      if (!error && report) {
        // Insert report items & reduce product stocks
        for (const item of cart) {
          await supabase.from("report_items").insert({
            report_id: report.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          });

          // Stock movement
          await supabase.from("stock_movements").insert({
            product_id: item.id,
            type: "out",
            quantity: item.quantity,
            notes: `Penjualan #${report.id}`,
            user_name:
              user?.user_metadata?.name || user?.email || "Kasir SB Jaya",
          });

          // Decrement stock
          await supabase.rpc("decrement_stock", {
            p_id: item.id,
            p_qty: item.quantity,
          });
        }

        router.push("/admin/reports");
        return;
      }
    } catch {
      // ignore
    }

    // LocalStorage fallback for demo
    try {
      const existingReports = JSON.parse(
        localStorage.getItem("sb_reports") || "[]"
      );
      const newReport = {
        id: Date.now(),
        invoice_number: `INV-${Date.now()}`,
        customer_name: customerName.trim() || "-",
        cashier_name: "Kasir SB Jaya",
        total_amount: totalAmount,
        payment_method: "tunai",
        created_at: new Date().toISOString(),
        items: cart.map((item, idx) => ({
          id: idx + 1,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
          product: {
            name: item.name,
            image_url: "/images/default-product.svg",
          },
        })),
      };

      localStorage.setItem(
        "sb_reports",
        JSON.stringify([newReport, ...existingReports])
      );
    } catch {
      // ignore
    }

    router.push("/admin/reports");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Buat Laporan Baru</h1>
      </div>

      <form
        onSubmit={handleSaveReport}
        className="bg-white p-8 rounded-lg shadow-md border border-gray-100"
      >
        {/* Input Nama Customer */}
        <div className="mb-6">
          <label
            htmlFor="customer_name"
            className="block text-gray-700 font-bold mb-2 text-sm"
          >
            Nama Customer (Opsional)
          </label>
          <input
            type="text"
            id="customer_name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Masukkan nama customer"
          />
        </div>

        {/* Input Cari Produk */}
        <div className="mb-6 relative">
          <label
            htmlFor="search"
            className="block text-gray-700 font-bold mb-2 text-sm"
          >
            Cari Produk
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Ketik nama atau brand produk..."
          />

          {/* Hasil Pencarian */}
          {searchResults.length > 0 && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <li
                  key={product.id}
                  onClick={() => addProductToCart(product)}
                  className="px-4 py-2.5 cursor-pointer hover:bg-gray-100 flex justify-between items-center border-b last:border-0"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {product.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    Stok: {product.stock} | {formatIDR(product.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tabel Keranjang/Cart */}
        <h3 className="text-xl font-bold text-gray-800 border-t pt-6 mt-6 mb-4">
          Daftar Barang
        </h3>
        <table className="w-full mb-6 text-left">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-3 text-left">Produk</th>
              <th className="p-3 text-center">Harga</th>
              <th className="p-3 text-center">Jumlah</th>
              <th className="p-3 text-right">Subtotal</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {cart.length > 0 ? (
              cart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 font-semibold text-gray-800 text-sm">
                    {item.name}
                  </td>
                  <td className="p-3 text-center text-sm">
                    {formatIDR(item.price)}
                  </td>
                  <td className="p-3 text-center" style={{ width: 120 }}>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
                      }
                      className="w-20 text-center border rounded-md px-2 py-1 text-sm mx-auto"
                      min={1}
                      max={item.stock}
                    />
                  </td>
                  <td className="p-3 text-right font-bold text-sm text-gray-900">
                    {formatIDR(item.price * item.quantity)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeCartItem(item.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                  Keranjang masih kosong. Silakan cari dan pilih produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Total & Tombol Simpan */}
        <div className="text-right border-t pt-4">
          <p className="text-2xl font-bold text-gray-900">
            Total: {formatIDR(totalAmount)}
          </p>
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="mt-4 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors shadow disabled:opacity-50"
          >
            {loading ? "Menyimpan Laporan..." : "Simpan Laporan"}
          </button>
        </div>
      </form>
    </div>
  );
}
