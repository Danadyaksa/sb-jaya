"use client";

import { useState, useEffect } from "react";
import { Category } from "@/data/types";
import { getProductImageUrl } from "@/data/utils";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import seedData from "@/data/seed-data.json";
import { Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit/Add modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const loadCategories = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (data && data.length > 0) {
          setCategories(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }
    }

    try {
      const local = localStorage.getItem("sb_custom_categories");
      if (local) {
        setCategories(JSON.parse(local));
        setLoading(false);
        return;
      }
    } catch {
      // ignore
    }

    setCategories(seedData.categories);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage("");
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryImage(cat.image_url || cat.image || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;

    const slug = categoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    const supabase = createClient();

    if (editingCategory) {
      // Update
      try {
        await supabase
          .from("categories")
          .update({ name: categoryName.trim(), slug })
          .eq("id", editingCategory.id);
      } catch {
        // ignore
      }

      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: categoryName.trim(), slug }
          : c
      );
      setCategories(updated);
      try {
        localStorage.setItem("sb_custom_categories", JSON.stringify(updated));
      } catch {
        // ignore
      }
    } else {
      // Insert
      let newCat: Category = {
        id: Date.now(),
        name: categoryName.trim(),
        slug,
        image: null,
      };

      try {
        const { data } = await supabase
          .from("categories")
          .insert({ name: categoryName.trim(), slug })
          .select()
          .single();
        if (data) newCat = data;
      } catch {
        // ignore
      }

      const updated = [...categories, newCat];
      setCategories(updated);
      try {
        localStorage.setItem("sb_custom_categories", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setShowModal(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Kategori</h1>
        <button
          onClick={openCreateModal}
          className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-3 text-sm font-semibold text-gray-700">Gambar</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Nama Kategori</th>
              <th className="p-3 text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center p-8 text-gray-500">
                  Memuat data kategori...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category) => {
                const imageUrl = getProductImageUrl(
                  category.image_url || category.image
                );
                return (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded-md bg-gray-100 border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/default-product.svg";
                        }}
                      />
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      {category.name}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => openEditModal(category)}
                        className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-8 text-gray-500">
                  Belum ada kategori yang dibuat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit / Tambah */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="font-bold text-xl mb-4 text-gray-800">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="Misal: Aksesoris Mobil"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold text-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
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
