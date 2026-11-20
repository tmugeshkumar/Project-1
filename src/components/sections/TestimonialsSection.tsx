import React from "react";
import Link from "next/link";
import { testimonialsData, clientEngagementStandards } from "@/lib/data/testimonials";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Star, ShieldCheck, ArrowRight, Quote } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="outline" size="md">
            Verified Experiences
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Client Feedback &amp; Partnership Standards
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We hold ourselves to strict standards of transparency. We publish only verified client accounts and honest partnership metrics.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonialsData.map((item) => (
            <Card
              key={item.id}
              hoverable
              className="p-8 flex flex-col justify-between border-slate-200"
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

                <div className="relative">
                  <Quote className="w-6 h-6 text-slate-300 mb-2 opacity-50" />
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{item.authorName}</p>
                <p className="text-xs text-slate-500">{item.authorTitle}</p>
                <p className="text-xs font-medium text-brand-600">{item.companyName}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Client Engagement Standards */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-subtle">
          <div className="max-w-2xl mb-8 space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Our Non-Negotiable Client Standards
            </h3>
            <p className="text-slate-600 text-sm">
              Every client engagement is protected by clear contractual terms, transparent code repos, and guaranteed delivery criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientEngagementStandards.map((std) => (
              <div key={std.title} className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">{std.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{std.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Read more about our verified references and testimonial integrity guidelines.
            </span>
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Full Testimonials &amp; Audit Log <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
