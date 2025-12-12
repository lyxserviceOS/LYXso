interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3;
  variant?: "default" | "highlight";
}

export default function FeatureGrid({
  title,
  subtitle,
  features,
  columns = 3,
  variant = "default",
}: FeatureGridProps) {
  const gridCols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section className="space-y-6">
      {title && (
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className={`grid gap-6 ${gridCols} pt-4`}>
        {features.map((feature, index) => (
          <div
            key={index}
            className={`rounded-xl border p-6 space-y-3 ${
              variant === "highlight"
                ? "border-slate-800 bg-slate-900/60"
                : "border-slate-800 bg-slate-900/70"
            }`}
          >
            {feature.icon && (
              <div className="text-2xl">{feature.icon}</div>
            )}
            <h3 className={`text-xl font-semibold ${
              variant === "highlight" ? "text-blue-400" : ""
            }`}>
              {feature.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
