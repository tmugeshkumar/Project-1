import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Code2, Mail, MapPin, Phone, Linkedin, Github, Twitter, Instagram } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded p-0.5"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>
                  {siteConfig.contact.address.street}, {siteConfig.contact.address.city},{" "}
                  {siteConfig.contact.address.state} {siteConfig.contact.address.zip}
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={siteConfig.contact.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contact.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contact.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contact.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Solutions & Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reusable Products Column */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Software Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-4">
              Company & Standards
            </h3>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {siteConfig.footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} {siteConfig.legalName}. All rights reserved. Built with Next.js, React & TypeScript.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Model A + Model B Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
