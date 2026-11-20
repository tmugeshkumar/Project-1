import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Check, Hammer, Package } from "lucide-react";

export const BusinessModels: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="outline" size="md">
            Our Two-Pillar Business Model
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How We Deliver Value to Our Clients
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We are neither an inflexible SaaS vendor nor a generic IT body shop. We operate through two distinct, complementary models designed to address diverse technical timelines and budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Model A: Custom Software Engineering */}
          <Card hoverable className="p-8 sm:p-10 flex flex-col justify-between border-slate-200/90 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
                  <Hammer className="w-6 h-6" />
                </div>
                <Badge variant="brand" size="md">
                  Model A
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Custom Software Development
                </h3>
                <p className="text-sm font-medium text-brand-600 mb-3">
                  Tailored Discovery, Architecture &amp; Engineering
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  For businesses with proprietary workflows, unique regulatory constraints, or novel product concepts that off-the-shelf software cannot solve.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  How Model A Operates:
                </p>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>Deep-dive technical discovery to document your exact operational bottlenecks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>Architecting custom databases, APIs, and responsive frontends.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>Sprint-based iterative delivery with complete source code ownership.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>Production deployment, security hardening, and staff training.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Ideal for: Startups, SMBs &amp; Enterprise Teams
              </span>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Explore Custom Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Model B: Reusable Software Products */}
          <Card hoverable className="p-8 sm:p-10 flex flex-col justify-between border-slate-200/90 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <Badge variant="success" size="md">
                  Model B
                </Badge>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Reusable Software Products
                </h3>
                <p className="text-sm font-medium text-emerald-600 mb-3">
                  Pre-Engineered Engines &amp; Accelerated Deployment
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  For businesses seeking proven, battle-tested software modules (workflows, telemetry, IAM) deployed rapidly into their own infrastructure with optional bespoke tuning.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  How Model B Operates:
                </p>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Independently researched, developed, and maintained in-house.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Transparent commercial licensing with zero perpetual per-seat markup.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Readily customizable to integrate with your existing internal systems.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Continuously updated with security patches and performance upgrades.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Ideal for: Fast Timelines &amp; Proven Architectures
              </span>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Browse Software Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
