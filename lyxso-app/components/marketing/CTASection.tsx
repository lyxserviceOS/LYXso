import Link from "next/link";

interface CTAButton {
  text: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
  variant?: "default" | "gradient";
}

export default function CTASection({
  title,
  subtitle,
  buttons,
  variant = "gradient",
}: CTASectionProps) {
  const bgClass = variant === "gradient"
    ? "rounded-2xl border-2 border-blue-600/50 bg-gradient-to-br from-blue-900/20 to-slate-900/40 p-8 lg:p-12"
    : "rounded-2xl border border-slate-800 bg-slate-900/40 p-8 lg:p-10";

  return (
    <section className={`${bgClass} text-center space-y-6`}>
      <h2 className="text-3xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
      )}
      {buttons.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {buttons.map((button, index) => (
            <Link
              key={index}
              href={button.href}
              className={
                button.variant === "primary" || !button.variant
                  ? "rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                  : "rounded-lg border border-slate-600 bg-slate-900/80 px-8 py-3 text-sm font-semibold text-slate-100 hover:border-blue-400 transition-colors"
              }
            >
              {button.text}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
