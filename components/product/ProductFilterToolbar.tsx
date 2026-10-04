"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Category } from "@/data/types";

interface ProductFilterToolbarProps {
  categories: Category[];
  brands: string[];
  total: number;
  from: number;
  to: number;
}

export default function ProductFilterToolbar({
  categories,
  brands,
  total,
  from,
  to,
}: ProductFilterToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || ""
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || ""
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    const search = searchParams.get("search");
    if (search) params.set("search", search);

    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedSort) params.set("sort", selectedSort);

    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleApply}>
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-b border-gray-200 py-4 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {total > 0
              ? `Showing ${from}–${to} of ${total} results`
              : "0 results"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Dropdown Kategori */}
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Dropdown Brand */}
          <select
            name="brand"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
          >
            <option value="">Semua Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Dropdown Sort */}
          <select
            name="sort"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white"
          >
            <option value="">Sort Default</option>
            <option value="price_asc">Harga: Termurah</option>
            <option value="price_desc">Harga: Termahal</option>
          </select>

          {/* Tombol Apply */}
          <button
            type="submit"
            className="bg-gray-800 text-white font-semibold px-5 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
          >
            Apply
          </button>
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Reset
          </Link>
        </div>
      </div>
    </form>
  );
}
