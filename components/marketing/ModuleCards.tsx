interface Module {
  title: string;
  description: string;
  icon?: string;
}

interface ModuleCardsProps {
  title: string;
  subtitle?: string;
  modules: Module[];
}

export default function ModuleCards({
  title,
  subtitle,
  modules,
}: ModuleCardsProps) {
  return (
    <section id="moduler" className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-slate-300 max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {modules.map((module, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-3"
          >
            {module.icon && (
              <div className="text-2xl mb-2">{module.icon}</div>
            )}
            <h3 className="text-lg font-semibold">{module.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
