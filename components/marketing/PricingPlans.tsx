import Link from "next/link";

interface Plan {
  name: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface PricingPlansProps {
  title: string;
  subtitle?: string;
  plans: Plan[];
  ctaText?: string;
  ctaHref?: string;
}

export default function PricingPlans({
  title,
  subtitle,
  plans,
  ctaText,
  ctaHref,
}: PricingPlansProps) {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-xl border p-6 space-y-4 relative ${
              plan.popular
                ? "border-2 border-blue-500 bg-slate-900/80"
                : "border-slate-700 bg-slate-900/60"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Populær
              </div>
            )}
            <div>
              <h3 className={`text-xl font-bold ${
                plan.popular ? "text-blue-400" : ""
              }`}>
                {plan.name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {ctaText && ctaHref && (
        <div className="text-center pt-4">
          <Link
            href={ctaHref}
            className="inline-block rounded-lg border border-slate-600 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-blue-400 transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      )}
    </section>
  );
}
