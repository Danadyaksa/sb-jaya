"use client";

import Link from "next/link";
import { Category } from "@/data/types";
import { getProductImageUrl } from "@/data/utils";

interface TrendingCategoriesSectionProps {
  categories: Category[];
}

export default function TrendingCategoriesSection({
  categories,
}: TrendingCategoriesSectionProps) {
  const topCategories = categories.slice(0, 4);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-red-600 font-bold tracking-wider mb-2">SEDANG TRENDING</h3>
          <h2 className="text-4xl font-poller text-gray-900 mb-12">KATEGORI TERATAS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topCategories.map((category) => {
            const imageUrl = getProductImageUrl(category.image_url || category.image);
            return (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg p-6 flex items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Teks */}
                <div className="w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase">
                    {category.name}
                  </h3>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-gray-500 hover:text-red-600 text-sm font-semibold transition-colors inline-block"
                  >
                    View All &rarr;
                  </Link>
                </div>
                {/* Gambar */}
                <div className="w-1/2">
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="rounded-lg w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/default-product.svg";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-block bg-red-600 text-white font-bold text-lg px-10 py-3 rounded-md hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
