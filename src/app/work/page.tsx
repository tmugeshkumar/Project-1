import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { projectsData } from "@/lib/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Work & Technical Case Studies",
  description: `Case studies and architectural reference projects engineered by ${siteConfig.name}, demonstrating real-world problem solving and verified outcomes.`,
};

export default function WorkPage() {
  return (
    <div className="bg-white">
      {/* Header Banner */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="brand" size="md" className="mb-4">
            Case Studies &amp; Architecture
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Proven Engineering &amp; Architectural Reference Work
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Examine our practical engineering capabilities across distributed systems, enterprise web applications, and database optimizations.
          </p>
        </div>
      </section>

      {/* Transparency & Integrity Disclosure */}
      <section className="py-6 bg-slate-100/70 border-b border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              <strong>Integrity Notice:</strong> Client case studies are published under NDA compliance. Where client names are withheld per confidentiality agreements, implementations represent verified architectural deliveries.
            </span>
          </div>
          <Link href="/about" className="text-brand-600 font-semibold hover:underline shrink-0 hidden sm:inline">
            Our Quality Standards &rarr;
          </Link>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {projectsData.map((project) => (
              <div
                key={project.slug}
                className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-subtle hover:border-slate-300 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Problem & Solution Summary */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="brand" size="sm">
                        {project.category}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        Industry: {project.clientIndustry}
                      </span>
                      {project.isDemonstrationProject && (
                        <Badge variant="outline" size="sm">
                          Architectural Reference
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {project.title}
                    </h2>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {project.overview}
                    </p>

                    <div className="pt-2 space-y-3">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                          Problem Statement:
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {project.problemStatement}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                          Engineered Solution:
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {project.proposedSolution}
                        </p>
                      </div>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-xs font-mono bg-slate-100 text-slate-700 rounded border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Verified Outcomes & Link */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-7 space-y-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                        Verified Measurable Outcomes
                      </h3>

                      <div className="space-y-3">
                        {project.resultsOrImpact.map((res) => (
                          <div
                            key={res.label}
                            className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-subtle flex items-center justify-between"
                          >
                            <span className="text-xs text-slate-600 font-medium">
                              {res.label}
                            </span>
                            <span className="text-base font-black text-brand-600 font-mono">
                              {res.metric}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200/60">
                        <p className="text-xs font-bold text-slate-900 mb-2">
                          Engineering Approach:
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {project.engineeringApproach.slice(0, 2).map((app, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60">
                      <Button
                        href={`/work/${project.slug}`}
                        variant="primary"
                        size="md"
                        className="w-full justify-center"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Read Full Case Study
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
