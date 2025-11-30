import { Star } from 'lucide-react';

type Props = {
  org: any;
  section: any;
};

const defaultTestimonials = [
  {
    name: 'Kari Nordmann',
    text: 'Utrolig fornøyd med coating-jobben! Bilen skinner som ny.',
    rating: 5,
  },
  {
    name: 'Ola Hansen',
    text: 'Enkel booking og profesjonell service. Anbefales!',
    rating: 5,
  },
  {
    name: 'Anne Berg',
    text: 'Dekkhotell-tjenesten er helt super. Praktisk og trygt.',
    rating: 5,
  },
];

export default function TestimonialsSection({ org, section }: Props) {
  const testimonials = section.testimonials || defaultTestimonials;
  const title = section.title || 'Hva kundene våre sier';

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-12 text-center">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial: any, i: number) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-700 mb-4">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <p className="font-semibold text-slate-900">
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
