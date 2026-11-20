import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: `Standard terms of service and commercial engagement conditions for ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-4">
          <Badge variant="outline" size="md">
            Commercial Standards
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-sm text-slate-500 font-mono">
            Last Updated: November 2026 &bull; Initial Corporate Template
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice to Company Legal Counsel:</span> This document represents a baseline terms framework covering website usage, Model A custom software proposals, and Model B reusable software product licensing. Prior to executing commercial agreements or taking online payments, standard Master Services Agreements (MSA) and End-User License Agreements (EULA) drafted by corporate counsel must govern individual transactions.
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Agreement to Terms</h2>
            <p>
              By accessing or using the website of {siteConfig.legalName} (&ldquo;{siteConfig.name}&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using this website or submitting project inquiries.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Service Delivery Models</h2>
            <p>
              {siteConfig.name} offers software capabilities under two primary commercial structures:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Model A (Custom Software Engineering):</strong> Custom development engagements are executed under mutually executed Statements of Work (SOW), defining specific milestones, deliverables, payment schedules, and acceptance criteria.
              </li>
              <li>
                <strong>Model B (Reusable Software Products):</strong> Pre-engineered software modules are provided under defined commercial source licenses, which specify installation scope, permissible seats or instances, and customization rights.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Intellectual Property Rights</h2>
            <p>
              All website content, visual identity, branding, and technical diagrams displayed on this site are the exclusive property of {siteConfig.legalName}. For client engagements under Model A, intellectual property ownership of delivered custom software is transferred in full upon complete milestone payment per contractual agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Limitation of Liability</h2>
            <p>
              Information on this website is provided on an &ldquo;as is&rdquo; basis for informational and business discovery purposes. While we exercise rigorous architectural care, {siteConfig.name} disclaims all warranties regarding continuous uninterrupted access or third-party network interruptions. Specific software performance guarantees and service level agreements (SLAs) are defined exclusively within binding client contracts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
