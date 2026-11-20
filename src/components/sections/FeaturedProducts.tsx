import React from "react";
import { productsData } from "@/lib/data/products";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";

export const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl space-y-3">
            <Badge variant="brand" size="md">
              Model B Showcase
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pre-Engineered Software Products
            </h2>
            <p className="text-slate-600 text-base">
              Battle-tested digital product foundations ready to be deployed on your infrastructure and customized to your exact requirements.
            </p>
          </div>

          <Button
            href="/products"
            variant="outline"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All Products
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {productsData.map((product) => {
            const isAvailable = product.status === "available";

            return (
              <Card
                key={product.slug}
                hoverable
                className="flex flex-col justify-between overflow-hidden border-slate-200"
              >
                <div>
                  {/* Card Header & Status */}
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
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

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs font-medium text-brand-600">
                        {product.tagline}
                      </p>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {product.summary}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">Key Features:</p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {product.features.slice(0, 3).map((f) => (
                          <li key={f.title} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{f.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
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

                {/* Footer Action CTAs */}
                <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/30 flex items-center gap-2">
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
                    Request License
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
