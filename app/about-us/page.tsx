import PageTitleBanner from "@/components/ui/PageTitleBanner";
import { MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "About Us - Katalog SB Jaya",
  description: "Tentang Toko SB Jaya - Aksesoris dan Suku Cadang Mobil Terlengkap.",
};

export default function AboutPage() {
  return (
    <div>
      {/* 1. Judul Utama */}
      <PageTitleBanner title="About Us" />

      {/* 2. About Our Website */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-red-600 font-bold tracking-wider mb-2">WEBSITE</p>
            <h2 className="text-5xl font-poller text-gray-900 mb-4">
              ABOUT OUR WEBSITE
            </h2>
            <p className="text-gray-500 font-bold">HOW OUR WEBSITE WORK</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
            <div>
              <h3 className="text-4xl font-poller text-gray-900 mb-4 leading-snug">
                AUTOPARTS CATALOGUE WEBSITE
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Website kami merupakan katalog dari barang dan aksesoris yang
                kami jual di toko. Anda dapat check ketersediaan barang di website
                kami, namun tidak dapat membelinya secara langsung melalui
                website.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/orang1.png"
                alt="Tim SB Jaya"
                className="rounded-lg shadow-xl max-h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tahun Melayani Anda */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="container mx-auto px-4 flex justify-center items-center gap-6">
          <div className="border-2 border-red-600 rounded-full w-24 h-24 flex items-center justify-center shrink-0">
            <span className="text-red-600 text-4xl font-poller">10</span>
          </div>
          <p className="text-3xl font-poller text-gray-800 leading-tight">
            Tahun <br /> Dengan Tulus Melayani Anda
          </p>
        </div>
      </section>

      {/* 4. Layanan Kami Dukung */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="/images/orang2.png"
              alt="Layanan SB Jaya"
              className="rounded-lg shadow-xl max-h-96 object-contain"
            />
          </div>
          <div className="pl-0 md:pl-12">
            <p className="text-red-600 font-bold tracking-wider mb-2">
              LAYANAN KAMI
            </p>
            <h2 className="text-4xl font-poller text-gray-900 mb-8">
              LAYANAN YANG KAMI DUKUNG
            </h2>
            <div className="space-y-6">
              {/* Ganti Oli */}
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 text-lg">
                  Ganti Oli
                </span>
              </div>

              {/* Aksesoris Mobil */}
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 text-lg">
                  Aksesoris Mobil
                </span>
              </div>

              {/* Cek dan Ganti Aki */}
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.49l-1.955 5.236a1 1 0 01-1.858.068l-2.114-5.96a1 1 0 01.37-1.16l5.236-1.955a1 1 0 011.16.37z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 text-lg">
                  Cek dan Ganti Aki
                </span>
              </div>

              {/* Servis */}
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700 text-lg">
                  Servis
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Lokasi Toko Kami */}
      <section className="bg-gray-900 text-white pb-20">
        <div className="container mx-auto px-4 pt-16 text-center">
          <p className="text-red-600 font-bold tracking-wider mb-2">LOKASI</p>
          <h2 className="text-4xl font-poller mb-12">LOKASI TOKO KAMI</h2>

          <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-8 max-w-5xl mx-auto">
            {/* Info Kontak */}
            <div className="grid md:grid-cols-3 gap-8 text-left mb-8">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-red-100 p-3 rounded-full text-red-600 shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">LOKASI</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Jl. Raya Demak-Kudus no.29 rt.1/rw.1 Mranak Wonosalam Demak
                    Jawa Tengah
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-red-100 p-3 rounded-full text-red-600 shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">KONTAK</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Nomor Telepon Kantor: 0291686006
                    <br />
                    Nomor WhatsApp: 08122818095
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-red-100 p-3 rounded-full text-red-600 shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">JAM BUKA</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Senin - Sabtu
                    <br />
                    07.00 - 17.00
                  </p>
                </div>
              </div>
            </div>

            {/* Peta */}
            <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0346170951098!2d110.65263687492106!3d-6.886457067385804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70ebd700be14a1%3A0x76d8990a71f43ea1!2sSB%20JAYA%20Variasi!5e0!3m2!1sen!2sid!4v1749316837439!5m2!1sen!2sid"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
                title="Peta Lokasi Toko SB Jaya"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
