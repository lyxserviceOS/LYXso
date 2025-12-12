import { Clock, Award, ThumbsUp } from 'lucide-react';

type Props = {
  org: any;
  section: any;
};

const defaultUSPs = [
  {
    title: 'Rask service',
    description: 'Få time samme dag eller neste dag',
    icon: 'clock',
  },
  {
    title: 'Erfarne fagfolk',
    description: 'Over 10 års erfaring med bilpleie',
    icon: 'award',
  },
  {
    title: 'Fornøyde kunder',
    description: '4.9 av 5 stjerner på Google',
    icon: 'thumbsup',
  },
];

const iconMap: Record<string, any> = {
  clock: Clock,
  award: Award,
  thumbsup: ThumbsUp,
};

export default function USPSection({ org, section }: Props) {
  const usps = section.usps || defaultUSPs;
  const title = section.title || 'Hvorfor velge oss?';

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-12 text-center">
          {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {usps.map((usp: any, i: number) => {
            const Icon = iconMap[usp.icon] || Award;

            return (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {usp.title}
                </h3>

                <p className="text-slate-600">
                  {usp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
