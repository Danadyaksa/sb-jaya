"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Admin SB Jaya");
  const [userRole, setUserRole] = useState("kasir");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(user.user_metadata?.name || user.email?.split("@")[0] || "Admin");
        supabase
          .from("profiles")
          .select("name, role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data?.role) setUserRole(data.role);
            if (data?.name) setUserName(data.name);
          });
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isProductsActive =
    pathname.startsWith("/admin/products") || pathname.startsWith("/admin/produk");
  const isReportsActive = pathname.startsWith("/admin/reports") || pathname.startsWith("/admin/laporan");
  const isCategoriesActive =
    pathname.startsWith("/admin/categories") || pathname.startsWith("/admin/kategori");
  const isStockActive =
    pathname === "/admin/stock" || pathname === "/admin/stok";
  const isStockHistoryActive =
    pathname.startsWith("/admin/stock/history") ||
    pathname.startsWith("/admin/stock/riwayat");

  if (pathname.includes("/receipt")) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col shrink-0">
        <div className="p-6 border-b">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="SB Jaya Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="p-6 border-b">
          <p className="font-bold text-lg text-gray-900 truncate">{userName}</p>
          <p className="text-sm text-gray-500 capitalize">
            Login as {userRole}
          </p>
        </div>

        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto">
          {/* MENU UNTUK KASIR */}
          {(userRole === "kasir" || userRole === "admin") && (
            <>
              <Link
                href="/admin/products"
                className={`block py-2.5 px-6 font-semibold transition-colors ${
                  isProductsActive
                    ? "bg-red-100 text-red-600 border-r-4 border-red-500"
                    : "text-gray-700 hover:bg-red-50"
                }`}
              >
                Kelola Produk
              </Link>
              <Link
                href="/admin/reports"
                className={`block py-2.5 px-6 font-semibold transition-colors ${
                  isReportsActive
                    ? "bg-red-100 text-red-600 border-r-4 border-red-500"
                    : "text-gray-700 hover:bg-red-50"
                }`}
              >
                Laporan
              </Link>
              <Link
                href="/admin/categories"
                className={`block py-2.5 px-6 font-semibold transition-colors ${
                  isCategoriesActive
                    ? "bg-red-100 text-red-600 border-r-4 border-red-500"
                    : "text-gray-700 hover:bg-red-50"
                }`}
              >
                Kelola Kategori
              </Link>
            </>
          )}

          {/* MENU UNTUK GUDANG */}
          {(userRole === "gudang" || userRole === "admin") && (
            <Link
              href="/admin/stock"
              className={`block py-2.5 px-6 font-semibold transition-colors ${
                isStockActive
                  ? "bg-red-100 text-red-600 border-r-4 border-red-500"
                  : "text-gray-700 hover:bg-red-50"
              }`}
            >
              Kelola Stok
            </Link>
          )}

          {/* MENU BERSAMA UNTUK KASIR & GUDANG */}
          <Link
            href="/admin/stock/history"
            className={`block py-2.5 px-6 font-semibold transition-colors ${
              isStockHistoryActive
                ? "bg-red-100 text-red-600 border-r-4 border-red-500"
                : "text-gray-700 hover:bg-red-50"
            }`}
          >
            Riwayat Stok
          </Link>
        </nav>

        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-center border border-red-500 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
