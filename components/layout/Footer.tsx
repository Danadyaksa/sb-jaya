"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin routes and auth pages
  if (
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <footer className="bg-red-600 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="SB Jaya Logo"
              width={160}
              height={48}
              className="h-12 w-auto brightness-0 invert"
            />
          </Link>

          {/* Footer Navigation */}
          <nav className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/" className="text-white font-semibold hover:underline">
              Home
            </Link>
            <Link href="/about-us" className="text-white font-semibold hover:underline">
              About Us
            </Link>
            <Link href="/products" className="text-white font-semibold hover:underline">
              Products
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
