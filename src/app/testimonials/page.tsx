import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { testimonialsData, clientEngagementStandards } from "@/lib/data/testimonials";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  Star,
  ShieldCheck,
  Quote,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Client Experience & Verified Testimonials",
  description: `Read verified feedback, reviews, and client satisfaction standards for ${siteConfig.name}. We strictly publish authentic testimonials.`,
};

export default function TestimonialsPage() {
  return (
    <div className="bg-white">
      {/* Header Banner */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="brand" size="md" className="mb-4">
            Feedback &amp; Reliability
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Client Experience &amp; Testimonial Integrity
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Our reputation is built on authentic outcomes. We adhere to a strict policy against fabricated reviews, inflated ratings, or artificial client endorsements.
          </p>
        </div>
      </section>

      {/* Integrity Manifesto */}
      <section className="py-8 bg-blue-50/60 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> The {siteConfig.name} Review Verification Standard
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              Every testimonial displayed on this page is gathered following completed sprint deliveries or production rollouts with explicit written client consent. We do not compensate or incentivize reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="p-8 flex flex-col justify-between border-slate-200 bg-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {item.verifiedClient && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Verified Client
                      </span>
                    )}
                  </div>

                  <Quote className="w-6 h-6 text-slate-300 opacity-60" />

                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      Project Area: {item.projectCategory} &bull; {item.date}
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{item.authorName}</p>
                  <p className="text-xs text-slate-500">{item.authorTitle}</p>
                  <p className="text-xs font-semibold text-brand-600">{item.companyName}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Standards */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <Badge variant="outline" size="md">
                Delivery Commitments
              </Badge>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                What Every Client Can Expect
              </h2>
              <p className="text-slate-600 text-sm">
                Our contractual and operational standards ensure an equitable, transparent partnership from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {clientEngagementStandards.map((std) => (
                <div
                  key={std.title}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    <h3 className="font-bold text-sm text-slate-900">{std.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{std.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">Are you an existing client?</p>
                <p className="text-xs text-slate-500">
                  Submit or update your project testimonial and reference permissions directly.
                </p>
              </div>
              <Button href="/contact" variant="outline" size="sm">
                Contact Account Representative
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
