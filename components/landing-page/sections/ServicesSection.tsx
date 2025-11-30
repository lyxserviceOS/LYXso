import { Droplets, Package, Shield, Wrench } from 'lucide-react';

type Props = {
  org: any;
  section: any;
};

const defaultServices = [
  {
    name: 'Bilpleie',
    description: 'Profesjonell vask, polering og detaljering',
    icon: 'droplets',
    price: 'Fra 299 kr',
  },
  {
    name: 'Dekkhotell',
    description: 'Trygg lagring av dine dekk hele året',
    icon: 'package',
    price: 'Fra 500 kr/sesong',
  },
  {
    name: 'Coating',
    description: 'Langvarig beskyttelse med garanti',
    icon: 'shield',
    price: 'Fra 4 990 kr',
  },
  {
    name: 'Verksted',
    description: 'Service og reparasjoner',
    icon: 'wrench',
    price: 'Prisestimat på forespørsel',
  },
];

const iconMap: Record<string, any> = {
  droplets: Droplets,
  package: Package,
  shield: Shield,
  wrench: Wrench,
};

export default function ServicesSection({ org, section }: Props) {
  const services = section.services || defaultServices;
  const title = section.title || 'Våre tjenester';
  const subtitle = section.subtitle || 'Alt du trenger for bilen din på ett sted';

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service: any, i: number) => {
            const Icon = iconMap[service.icon] || Droplets;

            return (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {service.name}
                </h3>

                <p className="text-slate-600 mb-4 text-sm">
                  {service.description}
                </p>

                {service.price && (
                  <p className="text-sm font-semibold text-blue-600">
                    {service.price}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="/bestill"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se alle tjenester og bestill
          </a>
        </div>
      </div>
    </section>
  );
}
