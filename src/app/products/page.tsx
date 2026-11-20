import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { productsData } from "@/lib/data/products";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  CheckCircle2,
  Send,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Reusable Software Products",
  description: `Discover pre-engineered digital products and modular software solutions built by ${siteConfig.name} for rapid deployment and customization.`,
};

export default function ProductsPage() {
  return (
    <div className="bg-white">
      {/* Header Banner */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="brand" size="md" className="mb-4">
            Model B Digital Products
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Pre-Engineered Software Products &amp; Modular Engines
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Accelerate your technology roadmap with production-ready software foundations deployed directly to your infrastructure with full customization support.
          </p>
        </div>
      </section>

      {/* Model B Architectural Value Banner */}
      <section className="py-10 bg-blue-50/50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Zero Multi-Seat Markup</p>
                <p className="text-xs text-slate-600">
                  Pay for perpetual source licensing and engineering customization—not punitive monthly user taxes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-600 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Deploy in Days, Not Quarters</p>
                <p className="text-xs text-slate-600">
                  Core engines are pre-built, tested, and containerized. Custom integrations begin immediately.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">100% Private Cloud Residency</p>
                <p className="text-xs text-slate-600">
                  All data stays in your PostgreSQL or AWS/GCP tenancy. Complete compliance with GDPR and HIPAA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {productsData.map((product) => {
              const isAvailable = product.status === "available";

              return (
                <Card
                  key={product.slug}
                  hoverable
                  className="flex flex-col justify-between overflow-hidden border-slate-200"
                >
                  <div>
                    {/* Header bar */}
                    <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <Badge variant={isAvailable ? "success" : "warning"} size="sm">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {product.statusLabel}
                      </Badge>
                    </div>

                    {/* Preview Mockup Area */}
                    <div className="h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex flex-col justify-between text-white relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-brand-400">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-mono">
                          // Architecture Preview
                        </p>
                        <p className="text-sm font-semibold text-slate-200">
                          {product.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          {product.name}
                        </h2>
                        <p className="text-xs font-medium text-brand-600">
                          {product.pricingModel}
                        </p>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {product.summary}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Key Functionalities:
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {product.keyFunctionality.slice(0, 3).map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <p className="text-xs font-semibold text-slate-900 mb-2">Technologies:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-[11px] font-mono bg-slate-100 text-slate-600 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <Button
                      href={`/products/${product.slug}`}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs justify-center"
                    >
                      View Details
                    </Button>
                    <Button
                      href={`/contact?product=${encodeURIComponent(product.name)}`}
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs justify-center"
                      rightIcon={<Send className="w-3 h-3" />}
                    >
                      Request This Product
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
