import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Code, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";

export const AchievementsSection: React.FC = () => {
  const metrics = [
    {
      metric: "100%",
      label: "TypeScript Strict Enforcement",
      detail: "Zero any policy across frontend, backend, and database logic.",
      icon: <Code className="w-5 h-5 text-brand-600" />,
    },
    {
      metric: "ACID",
      label: "Relational Data Integrity",
      detail: "PostgreSQL schemas modeled with strict relational constraints and indexing.",
      icon: <CheckCircle2 className="w-5 h-5 text-brand-600" />,
    },
    {
      metric: "Zero",
      label: "Vendor Hostage Architecture",
      detail: "Complete code ownership, documentation, and containerized deployment scripts.",
      icon: <ShieldCheck className="w-5 h-5 text-brand-600" />,
    },
    {
      metric: "Sub-200ms",
      label: "Target API Route Latency",
      detail: "Optimized server-side execution and lean dependency trees.",
      icon: <Cpu className="w-5 h-5 text-brand-600" />,
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="brand" size="md">
            Architectural Commitments
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineering Standards You Can Rely On
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Rather than relying on inflated vanity statistics, we measure ourselves by verifiable technical rigor and durable software quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="p-6 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:shadow-subtle transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono tracking-tight mb-1">
                {item.metric}
              </p>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {item.label}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
