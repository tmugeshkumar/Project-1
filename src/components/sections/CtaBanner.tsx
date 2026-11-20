import React from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MessageSquareCode } from "lucide-react";

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background accent glow */}
      <div 
        className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto">
            <MessageSquareCode className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Have a Complex Software Project or Ready to Deploy a Product?
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you need custom architectural engineering for a high-stakes workflow or want to license and customize one of our proven software products, our engineering team is ready to assist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              href="/contact"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Discuss Your Project
            </Button>
            <Button
              href={`mailto:${siteConfig.contact.email}`}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              Email Us Directly
            </Button>
          </div>

          <p className="text-xs text-slate-500 pt-2">
            Direct review by software architects. Complete confidentiality under mutual NDA when requested.
          </p>
        </div>
      </div>
    </section>
  );
};
