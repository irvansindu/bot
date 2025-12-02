import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Ahmad Fauzi',
    role: 'Musisi Indie',
    content: 'Sejak pakai CREATES, lagu saya bisa didengar di berbagai platform musik. Pembayaran royalti juga tepat waktu!',
    avatar: '/avatars/ahmad.jpg'
  },
  {
    name: 'Dewi Lestari',
    role: 'Penyanyi',
    content: 'Sangat mudah mengurus perizinan cover lagu melalui CREATES. Sekarang saya bisa fokus berkarya tanpa khawatir masalah hak cipta.',
    avatar: '/avatars/dewi.jpg'
  },
  {
    name: 'Rizky Pratama',
    role: 'Produser Musik',
    content: 'Platform yang sangat membantu untuk mendistribusikan karya artis-artis saya. Fitur analitiknya sangat membantu untuk strategi promosi.',
    avatar: '/avatars/rizky.jpg'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kata Mereka
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dengar pengalaman para musisi yang telah menggunakan layanan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl">
              <div className="text-indigo-500 mb-4">
                <FaQuoteLeft className="w-6 h-6" />
              </div>
              <p className="text-gray-700 italic mb-6">&quot;{testimonial.content}&quot;</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0">
                  {/* Placeholder for avatar */}
                  <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
