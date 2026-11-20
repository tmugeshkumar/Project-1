import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Badge } from "@/components/ui/Badge";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Clock,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Project Inquiry",
  description: `Get in touch with ${siteConfig.name}. Submit your custom software project specifications or request a reusable product commercial license.`,
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Header Banner */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <Badge variant="brand" size="md" className="mb-4">
            Direct Engineering Access
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Start a Conversation With Our Engineering Team
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Whether scoping a bespoke custom software platform or requesting a commercial license for one of our software products, we provide direct architectural feedback.
          </p>
        </div>
      </section>

      {/* Main Content: Form + Contact Details */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-subtle">
              <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  Project Inquiry &amp; Scope Details
                </h2>
                <p className="text-slate-600 text-sm">
                  Please provide as much operational context as possible. A senior software engineer will review your submission.
                </p>
              </div>

              <ContactForm />
            </div>

            {/* Right Column: Direct Channels & Company Socials */}
            <div className="lg:col-span-5 space-y-8">
              {/* Direct Communication Channels */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Direct Inquiries &amp; Offices
                </h3>

                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Project Inquiries</p>
                      <a
                        href={`mailto:${siteConfig.contact.inquiriesEmail}`}
                        className="text-brand-600 hover:underline"
                      >
                        {siteConfig.contact.inquiriesEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">General Information</p>
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="text-slate-600 hover:underline"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Direct Telephone</p>
                      <a
                        href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                        className="text-slate-600 hover:underline"
                      >
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Corporate Address</p>
                      <p className="text-slate-600 leading-relaxed text-xs">
                        {siteConfig.contact.address.street}
                        <br />
                        {siteConfig.contact.address.city}, {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
                        <br />
                        {siteConfig.contact.address.country}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>Response Time: Guaranteed within 24 business hours.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span>Mutual Non-Disclosure Agreement (NDA) available upon request.</span>
                  </div>
                </div>
              </div>

              {/* Verified Social Media Channels */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Company Social Channels
                </h3>
                <p className="text-xs text-slate-600">
                  Follow our engineering updates, open-source architectural patterns, and product releases:
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={siteConfig.contact.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-white hover:border-brand-500 text-slate-700 hover:text-brand-600 text-xs font-semibold transition-all shadow-subtle"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={siteConfig.contact.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-800 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-subtle"
                  >
                    <Github className="w-4 h-4 text-slate-900" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={siteConfig.contact.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-white hover:border-sky-500 text-slate-700 hover:text-sky-600 text-xs font-semibold transition-all shadow-subtle"
                  >
                    <Twitter className="w-4 h-4 text-sky-500" />
                    <span>Twitter / X</span>
                  </a>

                  <a
                    href={siteConfig.contact.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-white hover:border-pink-500 text-slate-700 hover:text-pink-600 text-xs font-semibold transition-all shadow-subtle"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
