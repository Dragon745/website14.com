import { testimonials } from '../../data/servicesData';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-purple-50 rounded-full text-purple-700 font-bold text-sm mb-4 uppercase tracking-wider">
            Client Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading">
            Trusted by <span className="text-purple-700">ambitious businesses</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-body">
            We don't just build websites; we build lasting partnerships that drive growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative group hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Quote decorative icon */}
              <div className="absolute top-6 right-8 text-9xl text-slate-100 font-serif leading-none select-none group-hover:text-purple-50 transition-colors">
                "
              </div>

              <div className="relative z-10">
                <div className="flex text-yellow-400 mb-6 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-700 text-lg leading-relaxed mb-8 font-body min-h-[100px]">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${testimonial.author.avatarGradient} shadow-md`}>
                    {testimonial.author.initials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 font-heading">{testimonial.author.name}</div>
                    <div className="text-sm text-purple-600 font-medium">{testimonial.author.title}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
