"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/types";
import { getProductImageUrl, formatIDR } from "@/data/utils";
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImageUrl(product.image_url || product.image);

  return (
    <div className="border border-gray-200 rounded-lg group overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="bg-white p-4 flex items-center justify-center h-56 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-56 object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-product.svg";
            }}
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3
              className="font-bold text-gray-800 text-lg mb-2 truncate hover:text-red-600 transition-colors"
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
        <div>
          <FavoriteButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
