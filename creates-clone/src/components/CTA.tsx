import Link from 'next/link';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Siap Menerbangkan Karyamu ke Seluruh Dunia?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan musisi yang telah mempercayakan distribusi musik mereka kepada kami.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/daftar" 
            className="bg-white text-indigo-700 px-8 py-3 rounded-full font-medium hover:bg-indigo-50 transition-colors duration-300"
          >
            Daftar Sekarang - Gratis
          </Link>
          <Link 
            href="/kontak" 
            className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
          >
            Tanya Tim Kami
          </Link>
        </div>
        <p className="mt-6 text-indigo-100">
          Tidak ada biaya pendaftaran. Tidak ada kontrak jangka panjang. Hanya 100% royalti untuk Anda.
        </p>
      </div>
    </section>
  );
};

export default CTA;
