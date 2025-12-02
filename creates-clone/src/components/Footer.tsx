import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaSpotify } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold text-white mb-4">CREATES</h3>
            <p className="mb-4">
              Platform distribusi musik digital dan manajemen hak cipta untuk musisi Indonesia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaYoutube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaSpotify className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              <li><Link href="/tentang-kami" className="hover:text-white">Tentang Kami</Link></li>
              <li><Link href="/karir" className="hover:text-white">Karir</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/kontak" className="hover:text-white">Kontak</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2">
              <li><Link href="/distribusi" className="hover:text-white">Distribusi Musik</Link></li>
              <li><Link href="/cover-lagu" className="hover:text-white">Lisensi Cover Lagu</Link></li>
              <li><Link href="/publishing" className="hover:text-white">Publishing</Link></li>
              <li><Link href="/promosi" className="hover:text-white">Promosi Musik</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Dukungan</h4>
            <ul className="space-y-2">
              <li><Link href="/bantuan" className="hover:text-white">Pusat Bantuan</Link></li>
              <li><Link href="/syarat-ketentuan" className="hover:text-white">Syarat & Ketentuan</Link></li>
              <li><Link href="/kebijakan-privasi" className="hover:text-white">Kebijakan Privasi</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} CREATES. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
