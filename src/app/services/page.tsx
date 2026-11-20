import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { servicesData } from "@/lib/data/services";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  Code2,
  Globe,
  Zap,
  Database,
  Network,
  Cpu,
  ShieldCheck,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Software Engineering Services",
  description: `Explore ${siteConfig.name}'s software development capabilities: custom web applications, workflow automation, PostgreSQL database engineering, APIs, and AI integrations.`,
};

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-6 h-6 text-brand-600" />,
  Globe: <Globe className="w-6 h-6 text-brand-600" />,
  Zap: <Zap className="w-6 h-6 text-brand-600" />,
  Database: <Database className="w-6 h-6 text-brand-600" />,
  Network: <Network className="w-6 h-6 text-brand-600" />,
  Cpu: <Cpu className="w-6 h-6 text-brand-600" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-brand-600" />,
  SlidersHorizontal: <SlidersHorizontal className="w-6 h-6 text-brand-600" />,
};

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Header Banner */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="brand" size="md" className="mb-4">
            Model A Engineering Capabilities
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Custom Software Development Services
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            We architect and develop robust digital systems engineered for long-term scalability, data integrity, and measurable business performance.
          </p>
        </div>
      </section>

      {/* Services Detailed List */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              id={service.slug}
              className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-subtle hover:border-slate-300 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Overview Column */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      {iconMap[service.iconName] || <Code2 className="w-6 h-6 text-brand-600" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        SERVICE 0{index + 1}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-slate-700 font-medium text-base leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Deliverables */}
                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Key Deliverables
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {service.deliverables.map((d) => (
                        <div key={d} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Primary Technologies
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {service.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 text-xs font-mono bg-slate-100 text-slate-700 rounded-md border border-slate-200/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Benefits & CTA Column */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-6 sm:p-7 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Commercial &amp; Technical Benefits
                    </h3>
                    <ul className="space-y-3 text-xs text-slate-600">
                      {service.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-slate-200/60">
                      <h4 className="text-xs font-semibold text-slate-800 mb-2">Ideal For:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {service.idealFor.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-0.5 text-[11px] bg-white border border-slate-200 rounded text-slate-600"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60">
                    <Button
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Inquire About {service.title}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
