import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left: copy utama */}
          <div>
            <p className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.18em] text-purple-600 mb-4">
              Digital Music Distribution
            </p>
            <h1 className="text-3xl md:text-[2.6rem] leading-tight font-semibold text-gray-900 mb-4">
              Creates: Partner Resmi
              <br />
              Karir Musik Digitalmu
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-xl">
              Agregator musik gratis untuk izin cover lagu resmi, rilis ke Spotify, Apple Music,
              YouTube Music, TikTok, dan platform global lain, dengan pencatatan metadata,
              ISRC, dan Content ID yang rapi.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
              >
                Mulai Daftar Gratis
              </Link>
              <Link
                href="/panduan"
                className="text-sm font-medium text-purple-700 hover:text-purple-800"
              >
                Baca Panduan Lengkap →
              </Link>
            </div>
            <p className="text-xs md:text-[0.78rem] text-gray-500">
              Cover lagu bebas drama copyright. Rilis musikmu secara profesional,
              dengan laporan royalti resmi tiap periode.
            </p>
          </div>

          {/* Right: dua kartu layanan utama */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px] shadow-sm">
              <div className="h-full rounded-2xl bg-white/95 p-4 sm:p-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-purple-600 mb-2">
                  Layanan
                </p>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  Coverto Master
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  Cover lagu yang sedang hits dengan izin resmi, cepat dan praktis. Akses
                  ribuan katalog lagu trending tanpa pusing urus legalitas.
                </p>
                <Link
                  href="/izin-cover-lagu"
                  className="inline-flex items-center text-xs font-medium text-purple-700 hover:text-purple-800"
                >
                  Selengkapnya →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-purple-600 mb-2">
                Layanan
              </p>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Digital Music Distribution
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Rilis lagu ke Spotify, Apple Music, dan DSP global. Kelola metadata, ISRC,
                dan Content ID dengan sistem yang rapi dan profesional.
              </p>
              <Link
                href="/rilis-musik"
                className="inline-flex items-center text-xs font-medium text-purple-700 hover:text-purple-800"
              >
                → Selengkapnya
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
