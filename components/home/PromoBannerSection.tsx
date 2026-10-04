"use client";

import Link from "next/link";
import { Category } from "@/data/types";
import { getProductImageUrl } from "@/data/utils";

interface PromoBannerSectionProps {
  categories: Category[];
}

export default function PromoBannerSection({ categories }: PromoBannerSectionProps) {
  const pelumasCategory = categories.find((c) => c.slug === "pelumas") || categories[0];
  const keamananCategory =
    categories.find((c) => c.slug === "keamanan-emergency") || categories[1] || categories[0];

  return (
    <section
      className="bg-gray-900 text-white py-20 mt-16"
      style={{ clipPath: "polygon(0 15%, 100% 0, 100% 85%, 0 100%)" }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Blok Kiri: Pelumas */}
          {pelumasCategory && (
            <div className="flex items-center gap-6">
              <img
                src="/images/categories/kategori-pelumas.jpg"
                alt="Oli Mesin"
                className="w-1/3 rounded-lg h-32 object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getProductImageUrl(
                    pelumasCategory.image_url || pelumasCategory.image
                  );
                }}
              />
              <div className="w-2/3">
                <h3 className="text-2xl font-bold mb-2 uppercase">
                  {pelumasCategory.name}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Oli mesin & rantai terbaik dari merek favorit Anda.
                </p>
                <Link
                  href={`/categories/${pelumasCategory.slug}`}
                  className="inline-block bg-red-600 text-white font-bold px-5 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  Cek Sekarang
                </Link>
              </div>
            </div>
          )}

          {/* Blok Kanan: Keamanan & Emergency */}
          {keamananCategory && (
            <div className="flex items-center gap-6">
              <img
                src="/images/categories/kategori-keamanan-emergency.jpg"
                alt="Keamanan Emergency"
                className="w-1/3 rounded-lg h-32 object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getProductImageUrl(
                    keamananCategory.image_url || keamananCategory.image
                  );
                }}
              />
              <div className="w-2/3">
                <h3 className="text-2xl font-bold mb-2 uppercase">
                  {keamananCategory.name}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Perlengkapan untuk keamanan dan keadaan darurat di perjalanan.
                </p>
                <Link
                  href={`/categories/${keamananCategory.slug}`}
                  className="inline-block bg-red-600 text-white font-bold px-5 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  Cek Sekarang
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
