"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Category } from "@/data/types";
import { getProductImageUrl } from "@/data/utils";

interface CategoryCarouselProps {
  categories: Category[];
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white py-16 -mt-16 relative z-10">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          className="category-swiper"
          loop={categories.length > 3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          navigation
          pagination={{
            clickable: true,
          }}
        >
          {categories.map((category) => {
            const imageUrl = getProductImageUrl(category.image_url || category.image);
            return (
              <SwiperSlide key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="block group h-full"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg border border-gray-100 bg-white p-4 text-center h-full hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="rounded-lg w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/default-product.svg";
                      }}
                    />
                    <h3 className="text-xl font-bold uppercase mt-4 text-gray-900 group-hover:text-red-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Shop All &rarr;</p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
