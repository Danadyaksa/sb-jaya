export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  products_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  price: number;
  stock: number;
  color: string | null;
  image?: string | null;
  image_url?: string | null;
  category_id: number | null;
  category?: Category;
}

export interface StockMovement {
  id: number;
  product_id: number;
  product?: Product;
  type: "in" | "out" | "adjustment";
  quantity: number;
  notes: string | null;
  user_name: string | null;
  created_at: string;
}

export interface ReportItem {
  id: number;
  report_id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Report {
  id: number;
  invoice_number: string;
  cashier_name: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
  items?: ReportItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role: "customer" | "kasir" | "gudang";
}
