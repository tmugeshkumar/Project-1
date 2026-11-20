import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  Code2,
  Compass,
  Cpu,
  Eye,
  Flag,
  HeartHandshake,
  Layers,
  ShieldCheck,
  Target,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name}, our engineering philosophy, architectural standards, and dual-model software delivery.`,
};

export default function AboutPage() {
  const coreValues = [
    {
      title: "Technical Discipline",
      description: "We write clean, strictly-typed code with zero shortcuts. Every architecture is designed to remain maintainable five years from now.",
      icon: <Code2 className="w-5 h-5 text-brand-600" />,
    },
    {
      title: "Honest Engineering",
      description: "We give transparent technical assessments. If a simpler off-the-shelf solution or script solves your problem better than custom code, we tell you directly.",
      icon: <ShieldCheck className="w-5 h-5 text-brand-600" />,
    },
    {
      title: "Client IP Sovereignty",
      description: "We do not believe in vendor capture. Every migration script, Dockerfile, database diagram, and line of source code belongs completely to you.",
      icon: <HeartHandshake className="w-5 h-5 text-brand-600" />,
    },
    {
      title: "Outcome-Driven Delivery",
      description: "Software has value only when it solves a measurable business problem. We measure success by system reliability, latency, and business ROI.",
      icon: <Target className="w-5 h-5 text-brand-600" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* Header Banner */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="brand" size="md" className="mb-4">
            About {siteConfig.name}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Engineering Custom Software with Integrity &amp; Architectural Rigor
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            {siteConfig.name} was established to provide an honest, engineering-first alternative to bloated agencies and inflexible SaaS platforms.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 sm:p-10 border-slate-200 bg-slate-50/50 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                To become the most dependable software engineering partner for organizations that value technical excellence, clean architecture, and reliable digital products over short-lived hype.
              </p>
            </Card>

            <Card className="p-8 sm:p-10 border-slate-200 bg-slate-50/50 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Flag className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                To solve real-world organizational challenges through disciplined TypeScript development, normalized PostgreSQL database modeling, and reusable software engines that accelerate time-to-value while preserving complete client IP sovereignty.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Philosophy & Development Approach */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="outline" size="md">
                Our Philosophy
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Why We Built {siteConfig.name} on Dual Delivery Models
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Most companies face an unpleasant trade-off when purchasing technology: they either pay crippling monthly subscription fees for rigid SaaS tools that don&apos;t fit their workflow, or they hire traditional agencies that take six months just to write a specification document.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {siteConfig.name} eliminates this compromise. Through **Model A**, we deliver fully bespoke engineering for novel or complex workflows. Through **Model B**, we provide pre-engineered, modular software products (telemetry, workflows, authentication) that can be licensed, customized, and deployed to your private infrastructure in days.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-sm text-slate-900">Architecture-First Planning</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We design schemas, entities, and data flow pipelines prior to writing code, eliminating costly rework down the line.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-sm text-slate-900">Modern, Proven Tooling</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strict TypeScript, Next.js server components, PostgreSQL with Prisma ORM, and Tailwind CSS. No unproven experimental libraries.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-sm text-slate-900">Continuous Regression Testing</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated test suites run against every pull request to ensure that new features never break existing operational paths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="brand" size="md">
              Guiding Principles
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Core Engineering Values
            </h2>
            <p className="text-slate-600 text-sm">
              The foundational commitments that govern every architectural decision and client partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val) => (
              <div
                key={val.title}
                className="p-6 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factual Team & Roadmap Standards */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-subtle space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Future Roadmap &amp; Quality Commitment
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              As an evolving software development firm, we deliberately refuse to publish fabricated team sizes or fictional corporate histories. Our team consists of seasoned software architects, full-stack engineers, and database specialists who communicate with clients directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Product Roadmap
                </p>
                <p className="text-xs text-slate-600">
                  Expanding our Model B product library with pluggable workflow modules and real-time event analytics.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Engineering Standards
                </p>
                <p className="text-xs text-slate-600">
                  Publishing open-source architectural templates and database benchmarking references.
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Client Guarantees
                </p>
                <p className="text-xs text-slate-600">
                  Defect warranty periods and structured SLA response windows for all production deliveries.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Need to discuss an upcoming engineering project?
              </span>
              <Button href="/contact" variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
