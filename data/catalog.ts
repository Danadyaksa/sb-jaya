import seedData from "./seed-data.json";
import { Category, Product } from "./types";
import { createClient } from "@/utils/supabase/server";
export { getProductImageUrl, formatRupiah, formatIDR } from "./utils";

export const initialCategories: Category[] = (seedData.categories as any[]).map((c) => ({
  ...c,
  image_url: c.image ? `/storage/${c.image}` : null,
}));

export const initialProducts: Product[] = (seedData.products as any[]).map((p) => ({
  ...p,
  price: Number(p.price) || 0,
  stock: Number(p.stock) || 0,
  image_url: p.image ? `/storage/${p.image}` : null,
}));

// Get categories (from Supabase if available, fallback to seedData)
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*, products(count)")
      .order("id", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        products_count: cat.products?.[0]?.count || 0,
      }));
    }
  } catch {
    // Fallback below
  }

  return initialCategories.map((cat) => ({
    ...cat,
    products_count: initialProducts.filter((p) => p.category_id === cat.id).length,
  }));
}

// Get single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

// Get products with filters
export interface ProductFilterParams {
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getProducts(params: ProductFilterParams = {}): Promise<{
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}> {
  const {
    search = "",
    category = "",
    brand = "",
    sort = "",
    page = 1,
    limit = 12,
  } = params;

  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*, category:categories(*)", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (brand) {
      query = query.eq("brand", brand);
    }

    if (category) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (catData) {
        query = query.eq("category_id", catData.id);
      }
    }

    if (sort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("id", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);

    if (!error && data && data.length > 0) {
      return {
        products: data,
        total: count || data.length,
        currentPage: page,
        totalPages: Math.ceil((count || data.length) / limit),
      };
    }
  } catch {
    // Fallback to local data
  }

  // Fallback filtering in memory
  let filtered = [...initialProducts].map((p) => ({
    ...p,
    category: initialCategories.find((c) => c.id === p.category_id),
  }));

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term))
    );
  }

  if (category) {
    const cat = initialCategories.find((c) => c.slug === category);
    if (cat) {
      filtered = filtered.filter((p) => p.category_id === cat.id);
    }
  }

  if (brand) {
    filtered = filtered.filter((p) => p.brand === brand);
  }

  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => b.id - a.id);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    products: paginated,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      return data;
    }
  } catch {
    // Fallback
  }

  const p = initialProducts.find((item) => item.slug === slug);
  if (!p) return null;

  return {
    ...p,
    category: initialCategories.find((c) => c.id === p.category_id),
  };
}

// Get distinct list of brands
export async function getBrands(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select("brand");
    if (data && data.length > 0) {
      const set = new Set(data.map((d: any) => d.brand).filter(Boolean));
      return Array.from(set) as string[];
    }
  } catch {
    // Fallback
  }

  const brands = Array.from(
    new Set(initialProducts.map((p) => p.brand).filter(Boolean))
  ) as string[];
  return brands.sort();
}

// Get newest products for home page
export async function getNewProducts(limit = 8): Promise<Product[]> {
  const result = await getProducts({ limit, sort: "latest" });
  return result.products;
}

