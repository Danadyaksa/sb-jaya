import type { Metadata } from "next";
import { Poller_One, Poppins } from "next/font/google";
import "./globals.css";

const pollerOne = Poller_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poller",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katalog SB Jaya - Aksesoris Mobil Premium",
  description: "Website katalog aksesoris dan suku cadang mobil terlengkap dari Toko SB Jaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${pollerOne.variable} ${poppins.variable} font-poppins`}>
      <body className="min-h-screen bg-gray-100 flex flex-col font-sans antialiased text-gray-900">
        {children}
      </body>
    </html>
  );
}
