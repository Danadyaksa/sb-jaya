"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/data/types";
import { createClient } from "@/utils/supabase/client";
import seedData from "@/data/seed-data.json";

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal kategori
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        if (data && data.length > 0) {
          setCategories(data);
          return;
        }
      } catch {
        // ignore
      }
      setCategories(seedData.categories);
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .insert({ name: newCategoryName.trim(), slug })
        .select()
        .single();

      if (!error && data) {
        setCategories((prev) => [...prev, data]);
        setCategoryId(data.id.toString());
        setShowCategoryModal(false);
        setNewCategoryName("");
        return;
      }
    } catch {
      // ignore
    }

    // Local fallback
    const newCat: Category = {
      id: Date.now(),
      name: newCategoryName.trim(),
      slug,
      image: null,
    };
    setCategories((prev) => [...prev, newCat]);
    setCategoryId(newCat.id.toString());
    setShowCategoryModal(false);
    setNewCategoryName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !price || !stock) {
      setErrorMsg("Nama produk, harga, dan stok wajib diisi!");
      return;
    }

    setLoading(true);

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    let uploadedImageUrl = imagePreview || "/images/default-product.svg";

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
          uploadedImageUrl = publicUrl;
        }
      }

      // Insert product
      const productPayload = {
        name: name.trim(),
        slug,
        brand: brand.trim() || null,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        color: color.trim() || null,
        description: description.trim() || null,
        image_url: uploadedImageUrl,
      };

      const { data, error } = await supabase
        .from("products")
        .insert(productPayload)
        .select()
        .single();

      if (!error && data) {
        // Also log stock movement "in"
        await supabase.from("stock_movements").insert({
          product_id: data.id,
          type: "in",
          quantity: parseInt(stock, 10),
          notes: "Stok awal saat produk dibuat",
        });

        router.push("/admin/products");
        return;
      }
    } catch {
      // ignore
    }

    // Local custom products fallback
    try {
      const newProduct = {
        id: Date.now(),
        name: name.trim(),
        slug,
        brand: brand.trim() || null,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        color: color.trim() || null,
        description: description.trim() || null,
        image_url: uploadedImageUrl,
        category: categories.find((c) => c.id.toString() === categoryId),
      };

      const existing = JSON.parse(
        localStorage.getItem("sb_custom_products") || "[]"
      );
      localStorage.setItem(
        "sb_custom_products",
        JSON.stringify([newProduct, ...existing])
      );
    } catch {
      // ignore
    }

    router.push("/admin/products");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tambah Produk Baru</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Oops! Ada yang salah.</strong>
            <p className="mt-1 text-sm">{errorMsg}</p>
          </div>
        )}

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
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category_id" className="block text-gray-700 font-bold mb-2 text-sm">
                Kategori
              </label>
              <div className="flex gap-2">
                <select
                  id="category_id"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 text-sm bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  +
                </button>
              </div>
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="stock" className="block text-gray-700 font-bold mb-2 text-sm">
                Stok Awal
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                required
              />
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 font-bold mb-2 text-sm">
                Gambar Produk
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />

              {imagePreview && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-right border-t pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      </form>

      {/* Modal Tambah Kategori */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="font-bold text-xl mb-4 text-gray-800">
              Tambah Kategori Baru
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveCategory()}
              className="w-full px-3 py-2 border rounded-lg mb-4 text-sm"
              placeholder="Nama Kategori Baru"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold text-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
