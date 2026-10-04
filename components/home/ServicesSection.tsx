export default function ServicesSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-red-600 font-bold tracking-wider mb-2">LAYANAN</h3>
        <h2 className="text-4xl font-poller text-gray-900 mb-12">PILIH LAYANAN KAMI</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {/* Ganti Oli */}
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            <span className="font-semibold text-gray-700">Ganti Oli</span>
          </div>

          {/* Aksesoris Mobil */}
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="font-semibold text-gray-700">Aksesoris Mobil</span>
          </div>

          {/* Cek dan Ganti Aki */}
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.49l-1.955 5.236a1 1 0 01-1.858.068l-2.114-5.96a1 1 0 01.37-1.16l5.236-1.955a1 1 0 011.16.37z"
              />
            </svg>
            <span className="font-semibold text-gray-700">Cek dan Ganti Aki</span>
          </div>

          {/* Servis */}
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="font-semibold text-gray-700">Servis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
