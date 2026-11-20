import React from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center mx-auto">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-brand-600 uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            The page you requested does not exist or has been relocated within the {siteConfig.name} directory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button href="/" variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Return Home
          </Button>
          <Button href="/services" variant="outline" size="md">
            View Services
          </Button>
        </div>
      </div>
    </div>
  );
}
