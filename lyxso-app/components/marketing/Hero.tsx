import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  trustText?: string;
}

export default function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  trustText,
}: HeroProps) {
  return (
    <section className="space-y-8">
      <div className="max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        
        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
          {subtitle}
        </p>

        {(primaryCta || secondaryCta) && (
          <div className="flex flex-wrap gap-4 pt-4">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                {primaryCta.text}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-lg border border-slate-600 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 hover:border-blue-400 transition-colors"
              >
                {secondaryCta.text}
              </Link>
            )}
          </div>
        )}

        {trustText && (
          <p className="text-xs text-slate-400 pt-2">
            {trustText}
          </p>
        )}
      </div>
    </section>
  );
}
