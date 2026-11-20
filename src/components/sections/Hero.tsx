import React from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Code2, Layers, ShieldCheck, Zap } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-100">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="brand" size="md">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              Software Engineering &amp; Digital Products
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Engineering Robust Software for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-800">
              High-Stakes Business Goals
            </span>
          </h1>

          {/* Value Proposition Description */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            {siteConfig.name} builds bespoke custom software systems and pre-engineered reusable digital products. We solve complex operational challenges with disciplined TypeScript architecture and clean database engineering.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Discuss Your Project
            </Button>
            <Button
              href="/products"
              variant="outline"
              size="lg"
              leftIcon={<Layers className="w-4 h-4 text-slate-500" />}
              className="w-full sm:w-auto"
            >
              Explore Our Products
            </Button>
          </div>

          {/* Architectural Trust Indicators */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-200/80 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">TypeScript Strict</p>
                <p className="text-[11px] text-slate-500">End-to-end type safety</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Model A &amp; Model B</p>
                <p className="text-[11px] text-slate-500">Custom build or product</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">PostgreSQL Core</p>
                <p className="text-[11px] text-slate-500">ACID relational stability</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">100% IP Ownership</p>
                <p className="text-[11px] text-slate-500">No vendor lock-in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
