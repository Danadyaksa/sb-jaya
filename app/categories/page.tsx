import Link from "next/link";
import PageTitleBanner from "@/components/ui/PageTitleBanner";
import ProductCard from "@/components/product/ProductCard";
import { getCategories, getProducts } from "@/data/catalog";

export const revalidate = 60;

export const metadata = {
  title: "Product Categories - Katalog SB Jaya",
  description: "Daftar lengkap kategori produk dan suku cadang mobil di Toko SB Jaya.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  // For each category, get top 4 preview products
  const categorySections = await Promise.all(
    categories.map(async (category) => {
      const { products } = await getProducts({
        category: category.slug,
        limit: 4,
      });
      return {
        category,
        products,
      };
    })
  );

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Product Categories", url: "#" },
  ];

  return (
    <div>
      <PageTitleBanner title="Product Categories" breadcrumbs={breadcrumbs} />

      <div className="container mx-auto px-4 py-12">
        {categorySections.length > 0 ? (
          categorySections.map(({ category, products }) => (
            <section key={category.id} className="mb-16">
              {/* Header Section Kategori */}
              <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 uppercase">
                  {category.name}
                </h3>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-sm font-semibold text-red-600 hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>

              {/* Grid Produk dalam Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>Belum ada produk di kategori ini.</p>
                  </div>
                )}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            <h3 className="text-2xl font-bold">Oops!</h3>
            <p className="mt-2">Belum ada kategori yang bisa ditampilkan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
