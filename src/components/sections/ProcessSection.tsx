import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Search, Compass, Terminal, ShieldAlert, Rocket, HeartHandshake } from "lucide-react";

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Discovery & Problem Definition",
      description: "We audit your existing systems, document functional constraints, interview stakeholders, and clearly define success criteria.",
      icon: <Search className="w-5 h-5 text-brand-600" />,
    },
    {
      number: "02",
      title: "Architectural & Schema Design",
      description: "Before writing application code, we construct normalized PostgreSQL schemas, type-safe API contracts, and component trees.",
      icon: <Compass className="w-5 h-5 text-brand-600" />,
    },
    {
      number: "03",
      title: "Iterative Sprint Engineering",
      description: "We develop in two-week agile increments with strict TypeScript, clean modular architecture, and bi-weekly interactive demos.",
      icon: <Terminal className="w-5 h-5 text-brand-600" />,
    },
    {
      number: "04",
      title: "Automated QA & Security Auditing",
      description: "Every build passes automated unit tests, input fuzzing, rate-limit verifications, and OWASP Top 10 security checks.",
      icon: <ShieldAlert className="w-5 h-5 text-brand-600" />,
    },
    {
      number: "05",
      title: "Zero-Downtime Deployment",
      description: "We deploy to containerized cloud environments with automated migration scripts, CDN caching, and telemetry monitoring.",
      icon: <Rocket className="w-5 h-5 text-brand-600" />,
    },
    {
      number: "06",
      title: "Code Handover & SLA Support",
      description: "You receive 100% intellectual property ownership, comprehensive technical documentation, and post-launch maintenance guarantees.",
      icon: <HeartHandshake className="w-5 h-5 text-brand-600" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="outline" size="md">
            Disciplined Delivery
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Software Engineering Lifecycle
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Software projects fail when assumptions replace architecture. Our structured methodology ensures predictability, transparent progress, and verifiable quality at every phase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-xl p-8 border border-slate-200 shadow-subtle hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-200 font-mono">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
