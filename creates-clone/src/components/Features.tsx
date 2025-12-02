const bullets = [
  {
    title: 'Simple',
    description:
      'Satu dashboard untuk urus izin cover, distribusi, dan laporan royalti. Tanpa formulir rumit dan proses berulang.',
  },
  {
    title: 'Aman',
    description:
      'Bekerja sama dengan publisher dan pemegang hak cipta resmi. Mengurangi risiko take down dan klaim copyright.',
  },
  {
    title: 'Cuan',
    description:
      'Royalti dicatat rapi dan dibayarkan berkala. Kamu fokus produksi, kami bantu urus monetisasi dan distribusi.',
  },
];

const Features = () => {
  return (
    <section className="bg-gray-50 py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-600 mb-2">
            Kenapa Harus Creates?
          </p>
          <h2 className="text-2xl md:text-[1.7rem] font-semibold text-gray-900 mb-3">
            Simple, Aman, Cuan.
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Menciptakan musik itu proses kreatif. Urusan izin, distribusi digital, dan pencatatan royalti biar
            jadi pekerjaan sistem. Creates bantu kamu merilis dan mengelola musik dengan cara yang lebih tertata.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 text-sm">
          {bullets.map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 text-[0.65rem] font-semibold text-purple-700">
                  ·
                </span>
                {item.title}
              </h3>
              <p className="text-xs md:text-[0.8rem] leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
