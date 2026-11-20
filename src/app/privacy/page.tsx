import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy and data protection terms for ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-4">
          <Badge variant="outline" size="md">
            Legal &amp; Compliance
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 font-mono">
            Last Updated: November 2026 &bull; Initial Corporate Template
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice to Company Legal Counsel:</span> This document represents an initial operational privacy template outlining data collection through contact inquiries. It must undergo formal review and customization by certified legal counsel to reflect specific state, federal, and international jurisdictional compliance prior to formal production launch.
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When visitors access the {siteConfig.name} website, we collect minimal information necessary to deliver services and respond to business inquiries:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Contact &amp; Project Inquiry Data:</strong> Full name, business email address, company name, estimated budget, and project description submitted voluntarily through our inquiry forms.
              </li>
              <li>
                <strong>Technical Telemetry:</strong> Standard HTTP server logs, including anonymized IP address, user-agent string, and timestamp of requests for rate limiting and abuse prevention.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. How We Use Collected Information</h2>
            <p>
              Information gathered via the contact form is used strictly for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Evaluating and responding to your custom software or product inquiries.</li>
              <li>Executing technical discovery sessions and preparing engineering proposals.</li>
              <li>Defending our infrastructure against denial-of-service, spam, and malicious inputs.</li>
            </ul>
            <p>
              We do <strong>not</strong> sell, rent, monetize, or trade your inquiry information or email address to third-party marketing firms or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Data Retention &amp; Security</h2>
            <p>
              Inquiries are stored in encrypted, access-restricted database infrastructure. We implement rate limiting, server-side Zod schema validation, and secure transmission protocols (TLS/HTTPS). Information is retained only as long as necessary to conduct ongoing business communications or fulfill legal audit requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Third-Party Services</h2>
            <p>
              We may utilize transactional email dispatch services (such as Resend or authenticated SMTP relays) to route inquiry notices to our engineering team. These providers are strictly authorized to process email payloads solely for message delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Contact Information</h2>
            <p>
              For privacy-related questions, data removal requests, or confidentiality agreements, please contact:
            </p>
            <p className="font-mono text-xs text-slate-900 bg-slate-50 p-3 rounded border border-slate-200">
              Email: {siteConfig.contact.email}
              <br />
              Entity: {siteConfig.legalName}
              <br />
              Address: {siteConfig.contact.address.street}, {siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
