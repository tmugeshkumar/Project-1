import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projectsData } from "@/lib/data/projects";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  ArrowLeft,
  Send,
  ShieldCheck,
} from "lucide-react";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return projectsData.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const project = projectsData.find((p) => p.slug === params.slug);
  if (!project) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: `${project.title} | Case Study`,
    description: project.overview,
  };
}

export default function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Studies
          </Link>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Our Work</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 truncate max-w-xs">{project.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Overview */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="md">
              {project.category}
            </Badge>
            <Badge variant="outline" size="md">
              {project.clientIndustry}
            </Badge>
            {project.isDemonstrationProject && (
              <Badge variant="default" size="md">
                Verified Technical Architecture
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed">
            {project.overview}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-white border border-slate-200 rounded-md font-mono text-xs text-slate-700 shadow-subtle"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem, Solution & Approach */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">
          {/* Problem Statement */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              The Operational Problem
            </h2>
            <div className="bg-red-50/50 border border-red-200/80 rounded-2xl p-6 text-slate-700 text-sm leading-relaxed">
              {project.problemStatement}
            </div>
          </div>

          {/* Proposed Solution */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              The Proposed Engineering Solution
            </h2>
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-6 text-slate-700 text-sm leading-relaxed">
              {project.proposedSolution}
            </div>
          </div>

          {/* Development Approach */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Engineering Approach &amp; Implementation Details
            </h2>
            <div className="space-y-3">
              {project.engineeringApproach.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700"
                >
                  <span className="font-mono text-xs font-bold text-brand-600 bg-white border border-slate-200 rounded px-2 py-0.5 mt-0.5">
                    0{i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Results */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              Measurable Technical &amp; Business Outcomes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.resultsOrImpact.map((res) => (
                <Card key={res.label} className="p-5 border-slate-200 text-center space-y-1">
                  <p className="text-2xl font-black text-brand-600 font-mono">
                    {res.metric}
                  </p>
                  <p className="text-xs text-slate-600">{res.label}</p>
                  {res.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
                      <ShieldCheck className="w-3 h-3" /> Verified Outcome
                    </span>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Need a Solution for a Similar Challenge?
          </h2>
          <p className="text-slate-600 text-sm">
            Our engineers can review your current architecture and deliver a tailored technical proposal under mutual NDA.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              href="/contact?type=custom_software"
              variant="primary"
              size="md"
              rightIcon={<Send className="w-4 h-4" />}
            >
              Discuss Your Project
            </Button>
            <Button href="/work" variant="outline" size="md">
              View Other Case Studies
            </Button>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
