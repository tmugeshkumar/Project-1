import React from "react";
import Link from "next/link";
import { servicesData } from "@/lib/data/services";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Code2,
  Globe,
  Zap,
  Database,
  Network,
  Cpu,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5 text-brand-600" />,
  Globe: <Globe className="w-5 h-5 text-brand-600" />,
  Zap: <Zap className="w-5 h-5 text-brand-600" />,
  Database: <Database className="w-5 h-5 text-brand-600" />,
  Network: <Network className="w-5 h-5 text-brand-600" />,
  Cpu: <Cpu className="w-5 h-5 text-brand-600" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-brand-600" />,
  SlidersHorizontal: <SlidersHorizontal className="w-5 h-5 text-brand-600" />,
};

export const FeaturedServices: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl space-y-3">
            <Badge variant="brand" size="md">
              Model A Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Custom Software Development
            </h2>
            <p className="text-slate-600 text-base">
              We design, build, and maintain tailored digital solutions engineered around your exact organizational logic.
            </p>
          </div>

          <Button
            href="/services"
            variant="outline"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            All 8 Engineering Services
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.slice(0, 4).map((service) => (
            <Card
              key={service.id}
              hoverable
              className="p-6 flex flex-col justify-between border-slate-200"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  {iconMap[service.iconName] || <Code2 className="w-5 h-5 text-brand-600" />}
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Core Technologies
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {service.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-600 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href={`/services#${service.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Explore Capabilities <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
