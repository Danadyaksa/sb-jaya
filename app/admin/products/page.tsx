"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/data/types";
import { getProductImageUrl, formatIDR } from "@/data/utils";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import seedData from "@/data/seed-data.json";
import { MoreVertical, Plus, Package } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const loadProducts = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .order("id", { ascending: false });

        if (!error && data && data.length > 0) {
          setProducts(data);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Fallback to seedData + local modifications
    try {
      const localCustom = localStorage.getItem("sb_custom_products");
      if (localCustom) {
        setProducts(JSON.parse(localCustom));
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

  const handleDelete = async (productId: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("id", productId);
    } catch {
      // ignore
    }

    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    try {
      localStorage.setItem("sb_custom_products", JSON.stringify(updated));
    } catch {
      // ignore
    }
    setOpenDropdownId(null);
  };

  return (
    <div>
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Package className="w-8 h-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-800">Katalog Produk</h1>
        </div>
        <Link
          href="/admin/products/tambah"
          className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Produk</span>
        </Link>
      </div>

      {/* Grid Produk */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <p>Memuat produk...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const imageUrl = getProductImageUrl(
              product.image_url || product.image
            );
            const isMenuOpen = openDropdownId === product.id;

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md group overflow-visible relative flex flex-col justify-between"
              >
                <div className="bg-gray-100 p-4 relative rounded-t-lg">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/default-product.svg";
                    }}
                  />

                  {/* 3-dots Menu */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() =>
                        setOpenDropdownId(isMenuOpen ? null : product.id)
                      }
                      className="bg-white p-2 rounded-full shadow z-20 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-30 border border-gray-100 py-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 text-center">
                  <h3
                    className="font-bold text-gray-800 text-md mb-2 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  <p className="text-lg font-extrabold text-gray-900 mb-2">
                    {formatIDR(product.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stok: {product.stock}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="col-span-4 text-center py-16 text-gray-500 bg-white rounded-lg p-8">
          <p className="text-xl">Belum ada produk.</p>
          <Link
            href="/admin/products/tambah"
            className="mt-4 inline-block text-red-600 font-semibold"
          >
            Tambah Produk Pertama Anda
          </Link>
        </div>
      )}
    </div>
  );
}
