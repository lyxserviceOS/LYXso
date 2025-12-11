import { Check } from 'lucide-react';
import Link from 'next/link';

type Props = {
  org: any;
  section: any;
};

export default function HeroSection({ org, section }: Props) {
  const title = section.title || org.name;
  const subtitle = section.subtitle || 'Din partner for bilpleie og service';
  const bullets = section.bullets || [
    'Profesjonell bilpleie',
    'Trygt dekkhotell',
    'Premium coating',
  ];
  const imageUrl = section.image_url || '/images/hero-default.jpg';

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              {subtitle}
            </p>

            {/* Bullets */}
            <ul className="space-y-3 mb-10">
              {bullets.map((bullet: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-lg">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/bestill"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors text-lg"
              >
                Bestill time
              </Link>

              {org.phone && (
                <a
                  href={`tel:${org.phone}`}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-lg"
                >
                  Ring oss
                </a>
              )}
            </div>
          </div>

          {/* Right side - Image */}
          {imageUrl && (
            <div className="hidden lg:block">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
