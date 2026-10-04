-- Schema SQL untuk Katalog SB Jaya di Supabase PostgreSQL

-- 1. Profiles Table (Auth Users Extension)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'customer' check (role in ('customer', 'kasir', 'gudang')),
  created_at timestamptz default now()
);

-- 2. Categories Table
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique not null,
  image text,
  created_at timestamptz default now()
);

-- 3. Products Table
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique not null,
  brand text,
  description text,
  price numeric(12, 2) not null default 0,
  stock integer not null default 0,
  color text,
  image text,
  category_id bigint references public.categories(id) on delete set null,
  created_at timestamptz default now()
);

-- 4. Favorites Table
create table if not exists public.favorites (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id bigint references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 5. Reports Table
create table if not exists public.reports (
  id bigint generated always as identity primary key,
  invoice_number text unique not null,
  cashier_name text not null,
  total_amount numeric(12, 2) not null default 0,
  payment_method text not null default 'Tunai',
  created_at timestamptz default now()
);

-- 6. Report Items Table
create table if not exists public.report_items (
  id bigint generated always as identity primary key,
  report_id bigint references public.reports(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  price numeric(12, 2) not null default 0,
  subtotal numeric(12, 2) not null default 0
);

-- 7. Stock Movements Table
create table if not exists public.stock_movements (
  id bigint generated always as identity primary key,
  product_id bigint references public.products(id) on delete cascade,
  type text not null check (type in ('in', 'out', 'adjustment')),
  quantity integer not null,
  notes text,
  user_name text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.report_items enable row level security;
alter table public.stock_movements enable row level security;

-- Public read policies for catalog
create policy "Allow public read on categories" on public.categories for select using (true);
create policy "Allow public read on products" on public.products for select using (true);
create policy "Allow public read on profiles" on public.profiles for select using (true);

-- Allow authenticated users to manage products/categories/reports/stock
create policy "Allow all actions for authenticated users on categories" on public.categories for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on products" on public.products for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on reports" on public.reports for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on report_items" on public.report_items for all using (auth.role() = 'authenticated');
create policy "Allow all actions for authenticated users on stock_movements" on public.stock_movements for all using (auth.role() = 'authenticated');

-- Favorites policies (users can only manage their own favorites)
create policy "Users can read own favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on public.favorites for delete using (auth.uid() = user_id);
