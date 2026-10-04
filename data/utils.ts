// Utility functions safe for both Client and Server Components

export function getProductImageUrl(image: string | null | undefined): string {
  if (!image) {
    return "/images/default-product.svg";
  }
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  if (image.startsWith("/images/") || image.startsWith("/storage/")) {
    return image;
  }
  if (image.startsWith("images/")) {
    return `/${image}`;
  }
  if (image.startsWith("categories/") || image.startsWith("products/")) {
    return `/storage/${image}`;
  }
  return `/storage/products/${image}`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("Rp", "Rp ");
}

export function formatIDR(amount: number): string {
  return formatRupiah(amount);
}
