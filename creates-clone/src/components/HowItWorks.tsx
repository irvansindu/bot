import { FaUpload, FaMusic, FaGlobe, FaDollarSign } from 'react-icons/fa';

const steps = [
  {
    icon: <FaUpload className="w-6 h-6 text-white" />,
    title: 'Unggah Musik',
    description: 'Unggah lagu Anda dalam format berkualitas tinggi (WAV/FLAC) dan tambahkan metadata lengkap.'
  },
  {
    icon: <FaMusic className="w-6 h-6 text-white" />,
    title: 'Atur Rilis',
    description: 'Pilih tanggal rilis, platform tujuan, dan tentukan harga jual (jika berbayar).'
  },
  {
    icon: <FaGlobe className="w-6 h-6 text-white" />,
    title: 'Distribusikan',
    description: 'Kami akan mendistribusikan musik Anda ke seluruh platform musik digital pilihan Anda.'
  },
  {
    icon: <FaDollarSign className="w-6 h-6 text-white" />,
    title: 'Dapatkan Royalti',
    description: 'Pantau performa lagu Anda dan dapatkan pembayaran royalti secara transparan.'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cara Kerjanya
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hanya butuh beberapa menit untuk merilis musik Anda ke seluruh dunia.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Progress line */}
            <div className="hidden md:block absolute left-16 top-0 h-full w-1 bg-indigo-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex items-start md:items-center">
                  <div className="flex-shrink-0 w-32 h-32 md:w-16 md:h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl md:text-xl z-10">
                    <div className="flex flex-col items-center">
                      <div className="mb-1">{step.icon}</div>
                      <span className="text-sm">Langkah {index + 1}</span>
                    </div>
                  </div>
                  <div className="ml-6 md:ml-12 mt-4 md:mt-0">
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
