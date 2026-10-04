import React from "react";
import PageTitleBanner from "@/components/ui/PageTitleBanner";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="pb-16 bg-gray-50 min-h-screen">
      <PageTitleBanner title="KATALOG PRODUK" />

      <div className="container mx-auto px-4 max-w-7xl pt-8">
        {/* Filter bar placeholder */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-full md:w-80" />
          <div className="h-10 bg-gray-200 rounded w-full md:w-48" />
        </div>

        {/* Product Cards Grid Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
