import { notFound } from "next/navigation";
import PageTitleBanner from "@/components/ui/PageTitleBanner";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { getCategories, getProducts } from "@/data/catalog";

interface CategoryDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = Math.max(1, parseInt(sParams.page || "1", 10) || 1);
  const limit = 12;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const { products, total, totalPages } = await getProducts({
    category: slug,
    page,
    limit,
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    { name: category.name, url: "#" },
  ];

  return (
    <div>
      <PageTitleBanner title={category.name} breadcrumbs={breadcrumbs} />

      <div className="container mx-auto px-4 py-12">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl={`/categories/${category.slug}`}
            />
          </>
        ) : (
          <p className="text-center text-gray-500 py-16 text-xl">
            Oops! Belum ada produk di kategori ini.
          </p>
        )}
      </div>
    </div>
  );
}
