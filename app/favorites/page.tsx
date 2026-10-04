"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageTitleBanner from "@/components/ui/PageTitleBanner";
import { Product } from "@/data/types";
import { getProductImageUrl, formatIDR } from "@/data/utils";
import { createClient } from "@/utils/supabase/client";
import seedData from "@/data/seed-data.json";

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const loadFavorites = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    let productIds: number[] = [];

    if (user) {
      const { data: favs } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", user.id);

      if (favs && favs.length > 0) {
        productIds = favs.map((f: any) => f.product_id);
      }
    } else {
      try {
        const local = JSON.parse(localStorage.getItem("sb_favorites") || "[]");
        if (Array.isArray(local)) {
          productIds = local;
        }
      } catch {
        // ignore
      }
    }

    if (productIds.length > 0) {
      // Fetch products by IDs
      try {
        const { data: prods } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .in("id", productIds);

        if (prods && prods.length > 0) {
          setFavoriteProducts(prods);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }

      // Fallback to seedData
      const found = (seedData.products as any[])
        .filter((p) => productIds.includes(p.id))
        .map((p) => ({
          ...p,
          price: Number(p.price) || 0,
          stock: Number(p.stock) || 0,
        }));
      setFavoriteProducts(found);
    } else {
      setFavoriteProducts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();

    const handleUpdate = () => {
      loadFavorites();
    };

    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, []);

  const handleRemove = async (productId: number) => {
    if (user) {
      const supabase = createClient();
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
    } else {
      try {
        const local: number[] = JSON.parse(
          localStorage.getItem("sb_favorites") || "[]"
        );
        const updated = local.filter((id) => id !== productId);
        localStorage.setItem("sb_favorites", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId));
    window.dispatchEvent(new Event("favorites-updated"));
  };

  return (
    <div>
      <PageTitleBanner title="Favourites" />

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <p>Memuat daftar favorit...</p>
          </div>
        ) : favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favoriteProducts.map((product) => {
              const imageUrl = getProductImageUrl(
                product.image_url || product.image
              );
              return (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg group overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="bg-white p-4 flex items-center justify-center h-56">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-56 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/default-product.svg";
                        }}
                      />
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <Link href={`/products/${product.slug}`}>
                        <h3
                          className="font-bold text-gray-800 text-lg mb-2 truncate hover:text-red-600"
                          title={product.name}
                        >
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">
                        STOK TERSEDIA : {product.stock}
                      </p>
                      <p className="text-2xl font-extrabold text-gray-900 mb-4">
                        {formatIDR(product.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(product.id)}
                      className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition-colors text-sm shadow"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <h3 className="text-2xl font-semibold text-gray-800">
              Daftar Favorit Kosong
            </h3>
            <p className="mt-2 text-gray-600">
              Kamu belum menambahkan produk apa pun ke daftar favorit.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              Mulai Eksplor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
