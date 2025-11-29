interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialsProps {
  title: string;
  testimonials: Testimonial[];
  note?: string;
}

export default function Testimonials({
  title,
  testimonials,
  note,
}: TestimonialsProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-center">{title}</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 space-y-4"
          >
            <p className="text-lg text-slate-300 italic leading-relaxed">
              "{testimonial.quote}"
            </p>
            <div className="text-sm">
              <p className="font-semibold text-slate-200">{testimonial.author}</p>
              {testimonial.role && (
                <p className="text-slate-400">{testimonial.role}</p>
              )}
              {testimonial.company && (
                <p className="text-slate-400">{testimonial.company}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {note && (
        <p className="text-xs text-slate-500 text-center">{note}</p>
      )}
    </section>
  );
}
