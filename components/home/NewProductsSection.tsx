import { Product } from "@/data/types";
import ProductCard from "@/components/product/ProductCard";

interface NewProductsSectionProps {
  products: Product[];
}

export default function NewProductsSection({ products }: NewProductsSectionProps) {
  return (
    <section id="produk-baru" className="bg-white py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-red-600 font-bold tracking-wider mb-2">PRODUK</h3>
          <h2 className="text-4xl font-poller text-gray-900 mb-8">PRODUK BARU</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>Belum ada produk baru untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
