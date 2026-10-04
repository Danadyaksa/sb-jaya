import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTitleBanner from "@/components/ui/PageTitleBanner";
import FavoriteButton from "@/components/product/FavoriteButton";
import ShareProductButton from "@/components/product/ShareProductButton";
import { getProductBySlug } from "@/data/catalog";
import { getProductImageUrl, formatIDR } from "@/data/utils";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | Katalog SB Jaya",
    };
  }

  const imageUrl = getProductImageUrl(product.image_url || product.image);
  const partNumber = `SB-${String(product.id).padStart(8, "0")}`;
  const description =
    product.description ||
    `Beli ${product.name} (${partNumber}) dengan harga terbaik di Katalog Toko SB Jaya.`;

  return {
    title: `${product.name} | Katalog SB Jaya`,
    description,
    openGraph: {
      title: `${product.name} - ${formatIDR(product.price)}`,
      description,
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Katalog SB Jaya`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageUrl = getProductImageUrl(product.image_url || product.image);
  const partNumber = `SB-${String(product.id).padStart(8, "0")}`;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: product.name, url: "#" },
  ];

  return (
    <div>
      <PageTitleBanner title={product.name} breadcrumbs={breadcrumbs} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Kolom Kiri: Galeri Gambar */}
          <div>
            <div className="border border-gray-200 rounded-lg overflow-hidden group bg-white shadow-sm">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-96 object-contain bg-white p-4 transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>
          </div>

          {/* Kolom Kanan: Detail & Aksi */}
          <div className="pt-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p
              className={`font-semibold mb-6 ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              STOK TERSEDIA : {product.stock}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <p className="text-gray-500 font-medium">BRAND</p>
                <p className="font-semibold text-gray-800">
                  {product.brand || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">PART NUMBER</p>
                <p className="font-semibold text-gray-800">{partNumber}</p>
              </div>
            </div>

            {/* Opsi Warna jika ada */}
            {product.color && (
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1">COLOR</p>
                <p className="font-semibold text-gray-800">{product.color}</p>
              </div>
            )}

            <p className="text-4xl font-extrabold text-red-600 mb-8">
              {formatIDR(product.price)}
            </p>

            <div className="max-w-xs space-y-4">
              <FavoriteButton productId={product.id} />
              <ShareProductButton
                productName={product.name}
                productPrice={product.price}
                partNumber={partNumber}
              />
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Deskripsi */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <span className="border-red-600 text-red-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg cursor-default">
                Description
              </span>
            </nav>
          </div>
          <div className="prose max-w-none py-8 text-gray-600 leading-relaxed">
            <p className="whitespace-pre-line">
              {product.description || "Tidak ada deskripsi untuk produk ini."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
