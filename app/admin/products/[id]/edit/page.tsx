"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/data/types";
import { getProductImageUrl } from "@/data/utils";
import { createClient } from "@/utils/supabase/client";
import seedData from "@/data/seed-data.json";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(0);
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();

      // Categories
      try {
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories(seedData.categories);
        }
      } catch {
        setCategories(seedData.categories);
      }

      // Product
      let prod: Product | null = null;
      try {
        const { data } = await supabase
          .from("products")
          .select("*, category:categories(*)")
          .eq("id", productId)
          .single();
        if (data) prod = data;
      } catch {
        // ignore
      }

      if (!prod) {
        // Check localStorage custom
        try {
          const localCustom: Product[] = JSON.parse(
            localStorage.getItem("sb_custom_products") || "[]"
          );
          const found = localCustom.find((p) => p.id === productId);
          if (found) prod = found;
        } catch {
          // ignore
        }
      }

      if (!prod) {
        // Fallback to seedData
        const found = (seedData.products as any[]).find(
          (p) => p.id === productId
        );
        if (found) {
          prod = {
            ...found,
            price: Number(found.price) || 0,
            stock: Number(found.stock) || 0,
          };
        }
      }

      if (prod) {
        setProduct(prod);
        setName(prod.name);
        setBrand(prod.brand || "");
        setCategoryId(prod.category_id ? prod.category_id.toString() : "");
        setPrice(prod.price.toString());
        setStock(prod.stock);
        setColor(prod.color || "");
        setDescription(prod.description || "");
        setImagePreview(getProductImageUrl(prod.image_url || prod.image));
      }

      setLoading(false);
    };

    fetchData();
  }, [productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let updatedImageUrl = imagePreview || "";

    try {
      const supabase = createClient();

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, imageFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);
          updatedImageUrl = publicUrl;
        }
      }

      const updates = {
        name,
        brand: brand || null,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        price: parseFloat(price),
        color: color || null,
        description: description || null,
        ...(imageFile ? { image_url: updatedImageUrl } : {}),
      };

      await supabase.from("products").update(updates).eq("id", productId);
    } catch {
      // ignore
    }

    // Local custom update
    try {
      const localCustom: Product[] = JSON.parse(
        localStorage.getItem("sb_custom_products") || "[]"
      );
      const index = localCustom.findIndex((p) => p.id === productId);
      const updatedProduct = {
        ...(product || {}),
        name,
        brand: brand || null,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        price: parseFloat(price),
        color: color || null,
        description: description || null,
        image_url: updatedImageUrl,
      } as Product;

      if (index !== -1) {
        localCustom[index] = updatedProduct;
        localStorage.setItem("sb_custom_products", JSON.stringify(localCustom));
      } else {
        localStorage.setItem(
          "sb_custom_products",
          JSON.stringify([updatedProduct, ...localCustom])
        );
      }
    } catch {
      // ignore
    }

    setSaving(false);
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Memuat data produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Produk tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Edit Produk: {product.name}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2 text-sm">
                Nama Produk
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="brand" className="block text-gray-700 font-bold mb-2 text-sm">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category_id" className="block text-gray-700 font-bold mb-2 text-sm">
                Kategori
              </label>
              <select
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 font-bold mb-2 text-sm">
                Harga
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                Stok Saat Ini (Hanya bisa diubah oleh Gudang)
              </label>
              <p className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-800 font-semibold text-sm">
                {stock}
              </p>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div>
            <div className="mb-4">
              <label htmlFor="color" className="block text-gray-700 font-bold mb-2 text-sm">
                Warna
              </label>
              <input
                type="text"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-bold mb-2 text-sm">
                Deskripsi
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                Gambar Saat Ini
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt={product.name}
                  className="w-32 h-32 object-cover mb-4 rounded-lg border border-gray-200"
                />
              )}
              <label htmlFor="image" className="block text-gray-700 font-bold mb-1 text-sm">
                Ganti Gambar
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500"
              />
              <small className="text-gray-500 text-xs">
                Kosongkan jika tidak ingin mengganti gambar.
              </small>
            </div>
          </div>
        </div>

        <div className="mt-8 text-right border-t pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            {saving ? "Menyimpan..." : "Update Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
