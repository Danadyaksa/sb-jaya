import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-center text-4xl font-poller tracking-widest uppercase mb-12">
          CATALOGUE
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/images/kataloghome.png"
              alt="Aksesoris Dashboard Mobil"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl font-poller leading-tight mb-4">
              Cari Aksesoris Terbaik Untuk Mobilmu
            </h1>
            <p className="text-lg text-gray-400 mb-8">Aksesoris Mobil Premium</p>
            <a
              href="#produk-baru"
              className="inline-block bg-red-600 text-white font-bold text-lg px-8 py-3 rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Explore
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
