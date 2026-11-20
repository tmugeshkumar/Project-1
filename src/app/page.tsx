import React from "react";
import { Hero } from "@/components/sections/Hero";
import { BusinessModels } from "@/components/sections/BusinessModels";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { TechStack } from "@/components/sections/TechStack";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, ShieldCheck, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* 1-6. Hero section with headline, description, primary & secondary CTAs */}
      <Hero />

      {/* 7. Introduction to the company & dual business models */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <Badge variant="brand" size="md">
                About {siteConfig.name}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Software Built to Withstand Real-World Complexity
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {siteConfig.name} is an independent software development and digital product firm. We engineer tailored custom software architectures (Model A) and build pre-engineered reusable products (Model B) for businesses seeking durable technology without vendor lock-in.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                By maintaining strict TypeScript checking, normalized PostgreSQL data layers, and clean component systems, we ensure that every application we ship is performant, secure, and ready for long-term scalability.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2">
                <Terminal className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-sm text-slate-900">Type-Safe Architecture</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  End-to-end typing from database models to frontend components prevents runtime regressions.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-sm text-slate-900">Enterprise Data Security</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ACID-compliant PostgreSQL storage, rate-limited APIs, and strict input sanitization.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-sm text-slate-900">Rapid Time-to-Market</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pre-engineered software modules accelerate delivery from months to weeks.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-2">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-sm text-slate-900">100% IP Handover</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full codebase ownership, migrations, and documentation transferred directly to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8-9. Business Model Breakdown (Model A & Model B) */}
      <BusinessModels />

      {/* 8. Custom software development section */}
      <FeaturedServices />

      {/* 9. Reusable software products section */}
      <FeaturedProducts />

      {/* 10. Featured projects & case studies */}
      <FeaturedProjects />

      {/* 11. Technologies and expertise */}
      <TechStack />

      {/* 12. Development process */}
      <ProcessSection />

      {/* 13. Client testimonials and feedback */}
      <TestimonialsSection />

      {/* 14. Company experience and achievements */}
      <AchievementsSection />

      {/* 15. Contact CTA */}
      <CtaBanner />
    </>
  );
}
