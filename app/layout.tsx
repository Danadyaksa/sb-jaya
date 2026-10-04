import type { Metadata, Viewport } from "next";
import { Poller_One, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import SubNavbar from "@/components/layout/SubNavbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${pollerOne.variable} ${poppins.variable} font-poppins scroll-smooth`}>
      <body id="page-top" className="min-h-screen bg-gray-100 flex flex-col font-sans antialiased text-gray-900">
        <ToastProvider>
          <Header />
          <SubNavbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

