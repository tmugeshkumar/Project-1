"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ContactFormData } from "@/types";
import { CheckCircle2, AlertCircle, Send, ArrowRight } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    companyName: "",
    projectType: "custom_software",
    budgetRange: "undecided",
    projectDescription: "",
    honeypot: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Mount timestamp for bot timing detection
  const [mountTime] = useState<number>(() => Date.now());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on change
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateFrontend = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 15) {
      errors.projectDescription = "Please provide at least 15 characters describing your project.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Spam honeypot check on client
    if (formData.honeypot) {
      console.warn("Spam detected via honeypot.");
      setSubmitSuccess(true);
      return;
    }

    if (!validateFrontend()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submissionTimestamp: mountTime,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const mappedErrors: Record<string, string> = {};
          for (const [key, messages] of Object.entries(result.errors)) {
            mappedErrors[key] = (messages as string[])[0];
          }
          setFormErrors(mappedErrors);
        }
        setServerError(result.message || "Failed to submit inquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        companyName: "",
        projectType: "custom_software",
        budgetRange: "undecided",
        projectDescription: "",
        honeypot: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setServerError("A network error occurred. Please verify your connection or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-8 sm:p-10 text-center animate-in fade-in duration-300">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Inquiry Successfully Submitted
        </h3>
        <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed mb-6">
          Thank you for reaching out. A senior software engineer or product architect will review your project details and respond within 24 business hours.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSubmitSuccess(false)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website_url">Leave this field blank</label>
        <input
          id="company_website_url"
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Sarah Jenkins"
            className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 transition-all ${
              formErrors.fullName
                ? "border-red-300 focus:ring-red-500 bg-red-50/20"
                : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
            }`}
            aria-invalid={!!formErrors.fullName}
            aria-describedby={formErrors.fullName ? "fullName-error" : undefined}
          />
          {formErrors.fullName && (
            <p id="fullName-error" className="mt-1.5 text-xs text-red-600 font-medium">
              {formErrors.fullName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. sarah@example.com"
            className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 transition-all ${
              formErrors.email
                ? "border-red-300 focus:ring-red-500 bg-red-50/20"
                : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
            }`}
            aria-invalid={!!formErrors.email}
            aria-describedby={formErrors.email ? "email-error" : undefined}
          />
          {formErrors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-600 font-medium">
              {formErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Company / Organization */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-semibold text-slate-900 mb-2">
            Company or Organization <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Corporation"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-semibold text-slate-900 mb-2">
            Project Type <span className="text-red-500">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
          >
            <option value="custom_software">Custom Software Engineering (Model A)</option>
            <option value="product_licensing">Reusable Software Product Inquiry (Model B)</option>
            <option value="automation">Workflow / Business Automation</option>
            <option value="modernization">Legacy Codebase Modernization</option>
            <option value="consulting">Architecture Consulting & Code Audit</option>
            <option value="other">Other Software Need</option>
          </select>
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label htmlFor="budgetRange" className="block text-sm font-semibold text-slate-900 mb-2">
          Estimated Budget Range <span className="text-slate-400 font-normal">(Helps scope our proposal)</span>
        </label>
        <select
          id="budgetRange"
          name="budgetRange"
          value={formData.budgetRange}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
        >
          <option value="undecided">Undecided / Need Architecture Consultation</option>
          <option value="under_10k">&lt; $10,000 (Small Automation / Single Module)</option>
          <option value="10k_25k">$10,000 - $25,000 (MVP / Focused Web App / Product License)</option>
          <option value="25k_50k">$25,000 - $50,000 (Full Platform / Enterprise Automation)</option>
          <option value="50k_plus">$50,000+ (Comprehensive Multi-System Platform)</option>
        </select>
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="projectDescription" className="block text-sm font-semibold text-slate-900 mb-2">
          Project Goals & Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          rows={5}
          required
          value={formData.projectDescription}
          onChange={handleChange}
          placeholder="Briefly describe what business problem you are looking to solve, key features needed, or which reusable product you are interested in..."
          className={`w-full px-4 py-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 transition-all ${
            formErrors.projectDescription
              ? "border-red-300 focus:ring-red-500 bg-red-50/20"
              : "border-slate-300 focus:ring-brand-500 focus:border-brand-500"
          }`}
          aria-invalid={!!formErrors.projectDescription}
          aria-describedby={formErrors.projectDescription ? "description-error" : undefined}
        />
        {formErrors.projectDescription && (
          <p id="description-error" className="mt-1.5 text-xs text-red-600 font-medium">
            {formErrors.projectDescription}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-500">
          We respect your privacy. No spam. Direct response from senior engineering within 24 hours.
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          rightIcon={<Send className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Submit Project Inquiry
        </Button>
      </div>
    </form>
  );
};
