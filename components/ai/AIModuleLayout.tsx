"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

interface AIModuleLayoutProps {
  title: string;
  description: string;
  icon?: ReactNode;
  children: ReactNode;
  backUrl?: string;
}

export function AIModuleLayout({
  title,
  description,
  icon,
  children,
  backUrl = "/ai"
}: AIModuleLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(backUrl)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbake til AI-moduler
          </button>
          
          <div className="flex items-start gap-4">
            {icon ? (
              <div className="flex-shrink-0">
                {icon}
              </div>
            ) : (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
