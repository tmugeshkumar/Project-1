import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { productsData } from "@/lib/data/products";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  ShieldCheck,
  Sliders,
  Terminal,
  Users,
} from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return productsData.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = productsData.find((p) => p.slug === params.slug);
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} - ${product.tagline}`,
    description: product.summary,
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = productsData.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const isAvailable = product.status === "available";

  return (
    <div className="bg-white">
      {/* Breadcrumb & Navigation */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Products</span>
            <span>/</span>
            <span className="font-semibold text-slate-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Hero / Overview Header */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="md">
                  {product.category}
                </Badge>
                <Badge variant={isAvailable ? "success" : "warning"} size="md">
                  {product.statusLabel}
                </Badge>
              </div>

              {/* 1. Product Name & Tagline */}
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xl font-medium text-brand-600">
                {product.tagline}
              </p>

              {/* 1. Product Overview */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {product.summary}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                {/* 10. Request CTA */}
                <Button
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  variant="primary"
                  size="lg"
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Request This Product
                </Button>
                <Button
                  href="/contact?type=consulting"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Request a Similar Solution
                </Button>
              </div>
            </div>

            {/* 6. Screenshot / Interface Preview Graphic */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl text-white relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {product.slug}.terminal.sys
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="text-slate-400">
                    <span className="text-brand-400">$</span> status --inspect
                  </div>
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800 space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span>ENGINE_STATE:</span>
                      <span className="text-emerald-400 font-semibold">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TYPE_CHECK:</span>
                      <span className="text-emerald-400 font-semibold">PASSED (0 errors)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DB_STORAGE:</span>
                      <span className="text-blue-400 font-semibold">PostgreSQL (Private)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LICENSING:</span>
                      <span className="text-amber-400 font-semibold">SOURCE_CODE_PERPETUAL</span>
                    </div>
                  </div>

                  <div className="pt-2 text-slate-400">
                    <span className="text-brand-400">$</span> modules --list
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1 pl-2">
                    {product.keyFunctionality.slice(0, 3).map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="text-emerald-400">&#10003;</span>
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem the product solves & 3. Intended users */}
      <section className="py-16 border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-slate-200 space-y-4 bg-white">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                The Business Problem This Product Solves
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.problemSolved}
              </p>
            </Card>

            <Card className="p-8 border-slate-200 space-y-4 bg-white">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Intended Users &amp; Target Organizations
              </h2>
              <ul className="space-y-2 text-sm text-slate-600">
                {product.intendedUsers.map((user) => (
                  <li key={user} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Product Functionality & 5. Key Features */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl">
            <Badge variant="brand" size="md" className="mb-2">
              Capabilities
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Detailed Architecture &amp; Key Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-2 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand-600" />
                  <h3 className="font-bold text-base text-slate-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Core Execution Capabilities:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.keyFunctionality.map((func) => (
                <div key={func} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <span>{func}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Technologies Used & 8. Business Benefits */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Measurable Business Benefits
              </h2>
              <div className="space-y-3">
                {product.businessBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Underlying Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs text-slate-800 shadow-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* 9. Customization possibilities */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Customization &amp; Integration Possibilities
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {product.customizationOptions.map((opt) => (
                    <li key={opt} className="flex items-start gap-2">
                      <Sliders className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Deploy {product.name} on Your Private Cloud
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our software engineering team handles code delivery, containerized setup, database migrations, and custom integration into your operational infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              variant="primary"
              size="lg"
              rightIcon={<Send className="w-4 h-4" />}
            >
              Request Commercial License
            </Button>
            <Button href="/products" variant="outline" size="lg">
              Browse Other Products
            </Button>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
