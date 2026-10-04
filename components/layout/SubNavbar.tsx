"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, LayoutGrid } from "lucide-react";

export default function SubNavbar() {
  const pathname = usePathname();

  // Hide sub-navbar on admin routes and auth pages
  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const isHome = pathname === "/";
  const isAbout = pathname === "/about-us";
  const isProducts = pathname.startsWith("/products") || pathname.startsWith("/produk") || pathname.startsWith("/categories") || pathname.startsWith("/kategori");

  return (
    <nav className="bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center overflow-x-auto">
          {/* HOME */}
          <Link
            href="/"
            className={`flex items-center space-x-2 px-6 py-3 text-white font-bold text-sm transition-colors whitespace-nowrap ${
              isHome ? "bg-red-600 shadow-inner" : "hover:bg-gray-700"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>HOME</span>
          </Link>

          {/* ABOUT US */}
          <Link
            href="/about-us"
            className={`flex items-center space-x-2 px-6 py-3 text-white font-bold text-sm transition-colors whitespace-nowrap ${
              isAbout ? "bg-red-600 shadow-inner" : "hover:bg-gray-700"
            }`}
          >
            <Info className="h-4 w-4" />
            <span>ABOUT US</span>
          </Link>

          {/* PRODUCTS */}
          <Link
            href="/products"
            className={`flex items-center space-x-2 px-6 py-3 text-white font-bold text-sm transition-colors whitespace-nowrap ${
              isProducts ? "bg-red-600 shadow-inner" : "hover:bg-gray-700"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>PRODUCTS</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
