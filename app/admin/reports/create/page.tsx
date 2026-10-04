"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/types";
import { formatIDR } from "@/data/utils";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/Toast";
import seedData from "@/data/seed-data.json";
import { Settings, Keyboard, RotateCcw, X, Check } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

interface ShortcutSettings {
  enabled: boolean;
  focusSearch: string;
  submitCheckout: string;
  clearCart: string;
}

const DEFAULT_SHORTCUTS: ShortcutSettings = {
  enabled: true,
  focusSearch: "F2",
  submitCheckout: "F4",
  clearCart: "Escape",
};

export default function CreateReportPage() {
  const router = useRouter();
  const toast = useToast();

  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Shortcut State
  const [shortcuts, setShortcuts] = useState<ShortcutSettings>(DEFAULT_SHORTCUTS);
  const [showShortcutModal, setShowShortcutModal] = useState(false);
  const [tempShortcuts, setTempShortcuts] = useState<ShortcutSettings>(DEFAULT_SHORTCUTS);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load products
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

  // Load shortcuts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sb_pos_shortcuts");
      if (saved) {
        const parsed = JSON.parse(saved);
        setShortcuts(parsed);
        setTempShortcuts(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Global Keyboard listener for POS Shortcuts
  useEffect(() => {
    if (!shortcuts.enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently inside shortcut modal
      if (showShortcutModal) return;

      const key = e.key;

      if (key.toLowerCase() === shortcuts.focusSearch.toLowerCase()) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (key.toLowerCase() === shortcuts.submitCheckout.toLowerCase()) {
        e.preventDefault();
        if (cart.length === 0) {
          toast.error("Keranjang belanja masih kosong");
          return;
        }
        submitTransaction();
        return;
      }

      if (key.toLowerCase() === shortcuts.clearCart.toLowerCase()) {
        if (cart.length > 0) {
          e.preventDefault();
          if (confirm("Kosongkan keranjang belanja?")) {
            setCart([]);
            toast.info("Keranjang belanja telah dikosongkan");
          }
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, cart, showShortcutModal]);

  // Product Search filter
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
        if (existing.quantity >= product.stock) {
          toast.error(`Stok maksimal tercapai (${product.stock} pcs)`);
          return prev;
        }
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
    toast.success(`Ditambahkan: ${product.name}`);
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

  const submitTransaction = async () => {
    if (cart.length === 0) {
      toast.error("Keranjang belanja masih kosong");
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

          await supabase.from("stock_movements").insert({
            product_id: item.id,
            type: "out",
            quantity: item.quantity,
            notes: `Penjualan #${report.id}`,
            user_name:
              user?.user_metadata?.name || user?.email || "Kasir SB Jaya",
          });

          await supabase.rpc("decrement_stock", {
            p_id: item.id,
            p_qty: item.quantity,
          });
        }

        toast.success("Transaksi berhasil disimpan");
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
        customer_name: customerName.trim() || "Umum",
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

    toast.success("Transaksi berhasil disimpan");
    router.push("/admin/reports");
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    submitTransaction();
  };

  const handleSaveShortcuts = () => {
    setShortcuts(tempShortcuts);
    try {
      localStorage.setItem("sb_pos_shortcuts", JSON.stringify(tempShortcuts));
    } catch {
      // ignore
    }
    setShowShortcutModal(false);
    toast.success("Pengaturan shortcut keyboard berhasil disimpan");
  };

  const handleResetShortcuts = () => {
    setTempShortcuts(DEFAULT_SHORTCUTS);
  };

  return (
    <div className="pb-16 relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Transaksi Kasir (POS)
          </h1>
          <p className="text-sm text-gray-500">
            Pencatatan penjualan onderdil dan cetak struk belanja
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTempShortcuts(shortcuts);
              setShowShortcutModal(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Settings className="w-4 h-4 text-gray-500" />
            <span>Pengaturan Shortcut</span>
          </button>
        </div>
      </div>

      {/* Bar Notifikasi Shortcut Aktif */}
      <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <Keyboard className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-800">Shortcut Keyboard:</span>
          {shortcuts.enabled ? (
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Aktif
            </span>
          ) : (
            <span className="text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
              Nonaktif
            </span>
          )}
        </div>

        {shortcuts.enabled && (
          <div className="flex items-center gap-4 text-gray-500">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-gray-800 text-[11px] shadow-xs">
                {shortcuts.focusSearch}
              </kbd>{" "}
              Cari Produk
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-gray-800 text-[11px] shadow-xs">
                {shortcuts.submitCheckout}
              </kbd>{" "}
              Simpan Transaksi
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-mono text-gray-800 text-[11px] shadow-xs">
                {shortcuts.clearCart}
              </kbd>{" "}
              Kosongkan Keranjang
            </span>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSaveReport}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200"
      >
        {/* Input Nama Customer */}
        <div className="mb-6">
          <label
            htmlFor="customer_name"
            className="block text-gray-700 font-semibold mb-1 text-sm"
          >
            Nama Pelanggan (Opsional)
          </label>
          <input
            type="text"
            id="customer_name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
            placeholder="Masukkan nama pelanggan atau biarkan kosong untuk Umum"
          />
        </div>

        {/* Input Cari Produk */}
        <div className="mb-6 relative">
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="search"
              className="block text-gray-700 font-semibold text-sm"
            >
              Cari Produk
            </label>
            {shortcuts.enabled && (
              <span className="text-xs text-gray-400 font-mono">
                Tekan [{shortcuts.focusSearch}] untuk fokus
              </span>
            )}
          </div>
          <input
            ref={searchInputRef}
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
            placeholder="Ketik nama produk atau brand..."
          />

          {/* Hasil Pencarian */}
          {searchResults.length > 0 && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <li
                  key={product.id}
                  onClick={() => addProductToCart(product)}
                  className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex justify-between items-center border-b last:border-0 text-sm"
                >
                  <span className="font-medium text-gray-800">
                    {product.name}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Stok: {product.stock} | {formatIDR(product.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tabel Keranjang/Cart */}
        <div className="border-t pt-6 mt-6 mb-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            Daftar Barang Belanja
          </h3>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Kosongkan keranjang belanja?")) {
                  setCart([]);
                  toast.info("Keranjang belanja telah dikosongkan");
                }
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Kosongkan Keranjang
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mb-6 text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                <th className="py-2.5 px-3">Produk</th>
                <th className="py-2.5 px-3 text-center">Harga Satuan</th>
                <th className="py-2.5 px-3 text-center">Jumlah</th>
                <th className="py-2.5 px-3 text-right">Subtotal</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 text-sm">
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 text-center text-gray-600">
                      {formatIDR(item.price)}
                    </td>
                    <td className="py-3 px-3 text-center" style={{ width: 140 }}>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-20 text-center border border-gray-300 rounded px-2 py-1 text-sm mx-auto"
                        min={1}
                        max={item.stock}
                      />
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-gray-900">
                      {formatIDR(item.price * item.quantity)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="text-red-600 hover:text-red-700 font-semibold text-xs"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 text-sm">
                    Keranjang masih kosong. Silakan cari produk di atas untuk menambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total & Tombol Simpan */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-4 gap-4">
          <div className="text-left text-xs text-gray-500">
            {shortcuts.enabled && (
              <p>
                Tekan tombol pintas <kbd className="px-1.5 py-0.5 bg-gray-100 border rounded font-mono text-gray-700">{shortcuts.submitCheckout}</kbd> untuk menyimpan langsung.
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Total Pembayaran:
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-3">
              {formatIDR(totalAmount)}
            </p>
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="bg-red-600 text-white font-bold py-2.5 px-8 rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm disabled:opacity-50"
            >
              {loading ? "Menyimpan Transaksi..." : "Simpan & Cetak Struk"}
            </button>
          </div>
        </div>
      </form>

      {/* Modal Pengaturan Shortcut */}
      {showShortcutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-gray-800">
                  Pengaturan Shortcut Keyboard POS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Toggle Aktif / Nonaktif */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    Status Shortcut
                  </p>
                  <p className="text-xs text-gray-500">
                    Aktifkan atau matikan fungsi tombol pintas
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempShortcuts.enabled}
                    onChange={(e) =>
                      setTempShortcuts((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Custom Key Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fokus Pencarian Produk:
                  </label>
                  <select
                    value={tempShortcuts.focusSearch}
                    disabled={!tempShortcuts.enabled}
                    onChange={(e) =>
                      setTempShortcuts((prev) => ({
                        ...prev,
                        focusSearch: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-red-500 disabled:bg-gray-100"
                  >
                    <option value="F2">F2 (Rekomendasi POS)</option>
                    <option value="F1">F1</option>
                    <option value="F3">F3</option>
                    <option value="F6">F6</option>
                    <option value="/">Garis Miring (/)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Simpan & Bayar Transaksi:
                  </label>
                  <select
                    value={tempShortcuts.submitCheckout}
                    disabled={!tempShortcuts.enabled}
                    onChange={(e) =>
                      setTempShortcuts((prev) => ({
                        ...prev,
                        submitCheckout: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-red-500 disabled:bg-gray-100"
                  >
                    <option value="F4">F4 (Rekomendasi POS)</option>
                    <option value="F8">F8</option>
                    <option value="F9">F9</option>
                    <option value="F10">F10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kosongkan Keranjang:
                  </label>
                  <select
                    value={tempShortcuts.clearCart}
                    disabled={!tempShortcuts.enabled}
                    onChange={(e) =>
                      setTempShortcuts((prev) => ({
                        ...prev,
                        clearCart: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-red-500 disabled:bg-gray-100"
                  >
                    <option value="Escape">Escape (Esc)</option>
                    <option value="F7">F7</option>
                    <option value="F8">F8</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetShortcuts}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembalikan ke Default</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end items-center gap-2 p-4 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowShortcutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveShortcuts}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
