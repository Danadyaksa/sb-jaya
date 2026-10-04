import Link from "next/link";
import PageTitleBanner from "@/components/ui/PageTitleBanner";
import ProductFilterToolbar from "@/components/product/ProductFilterToolbar";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { getProducts, getCategories, getBrands } from "@/data/catalog";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const limit = 12;
  const search = params.search || "";
  const category = params.category || "";
  const brand = params.brand || "";
  const sort = params.sort || "";

  const [productsData, categories, brands] = await Promise.all([
    getProducts({ search, category, brand, sort, page, limit }),
    getCategories(),
    getBrands(),
  ]);

  const { products, total, totalPages } = productsData;
  const from = total > 0 ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, total);

  // Active query parameters for pagination
  const queryParams: Record<string, string> = {};
  if (search) queryParams.search = search;
  if (category) queryParams.category = category;
  if (brand) queryParams.brand = brand;
  if (sort) queryParams.sort = sort;

  return (
    <div>
      <PageTitleBanner title="Products" />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Link
            href="/categories"
            className="inline-block bg-red-600 text-white font-bold text-lg px-10 py-3 rounded-md hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            View All Categories
          </Link>
        </div>

        {/* Toolbar (Filter & Sort) */}
        <ProductFilterToolbar
          categories={categories}
          brands={brands}
          total={total}
          from={from}
          to={to}
        />

        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-500">
              <p className="text-xl">Oops! Belum ada produk yang bisa ditampilkan.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/products"
          queryParams={queryParams}
        />
      </div>
    </div>
  );
}
