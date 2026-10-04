"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search, Heart, User, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("customer");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hide on admin routes and auth pages
  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        supabase
          .from("profiles")
          .select("role, name")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data?.role) {
              setUserRole(data.role);
            } else if (user.user_metadata?.role) {
              setUserRole(user.user_metadata.role);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* BAGIAN ATAS: LOGO, SEARCH, FAVOURITES, LOGIN */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.svg"
              alt="SB Jaya Logo"
              width={160}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Search Bar */}
          <div className="w-full md:w-1/3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="absolute inset-y-0 right-0 px-4 bg-red-600 text-white rounded-r-md hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Favourites & Login/User Menu */}
          <div className="flex items-center space-x-6">
            <Link
              href="/favorites"
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <Heart className="h-6 w-6 text-gray-700 hover:text-red-600 transition-colors" />
              <span className="font-semibold text-sm">FAVOURITES</span>
            </Link>

            {!user ? (
              <Link
                href="/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <User className="h-6 w-6 text-gray-700 hover:text-red-600 transition-colors" />
                <span className="font-semibold text-sm">LOGIN</span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors focus:outline-none"
                >
                  <User className="h-6 w-6 text-red-600" />
                  <span className="font-semibold text-sm">
                    {user.user_metadata?.name || user.email?.split("@")[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Masuk sebagai</p>
                      <p className="text-sm font-bold text-gray-800 capitalize">{userRole}</p>
                    </div>

                    {userRole !== "customer" && (
                      <Link
                        href={userRole === "gudang" ? "/admin/stock" : "/admin/products"}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard Admin
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      LOG OUT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<header className="bg-white shadow-md sticky top-0 z-40 h-20" />}>
      <HeaderContent />
    </Suspense>
  );
}
