import { getCategories, getNewProducts } from "@/data/catalog";
import HeroSection from "@/components/home/HeroSection";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import ServicesSection from "@/components/home/ServicesSection";
import NewProductsSection from "@/components/home/NewProductsSection";
import TrendingCategoriesSection from "@/components/home/TrendingCategoriesSection";
import PromoBannerSection from "@/components/home/PromoBannerSection";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [categories, newProducts] = await Promise.all([
    getCategories(),
    getNewProducts(8),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Carousel */}
      <CategoryCarousel categories={categories} />

      {/* 3. Services Section */}
      <ServicesSection />

      {/* 4. New Products Section */}
      <NewProductsSection products={newProducts} />

      {/* 5. Trending Categories */}
      <TrendingCategoriesSection categories={categories} />

      {/* 6. Promo Banners */}
      <PromoBannerSection categories={categories} />
    </div>
  );
}
