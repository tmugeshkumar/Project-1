/**
 * Central Site Configuration
 * 
 * COMPANY_NAME is the centralized placeholder for the company name.
 * To rebrand the site globally, simply update the `name` property below.
 */

export const siteConfig = {
  name: "COMPANY_NAME",
  legalName: "COMPANY_NAME Technologies Inc.",
  tagline: "Engineering Custom Software & Scalable Digital Products",
  description:
    "COMPANY_NAME specializes in modern custom software engineering and battle-tested reusable digital products for startups, growth-stage businesses, and enterprises.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  contact: {
    email: "contact@company-name.com",
    inquiriesEmail: "inquiries@company-name.com",
    phone: "+1 (555) 019-2834",
    address: {
      street: "100 Technology Plaza, Suite 400",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "United States",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/company-name-placeholder",
      github: "https://github.com/company-name-placeholder",
      twitter: "https://twitter.com/company_name_placeholder",
      instagram: "https://instagram.com/company_name_placeholder",
    },
  },
  navigation: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Our Work", href: "/work" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Contact", href: "/contact" },
  ],
  footerLinks: {
    solutions: [
      { name: "Custom Software Engineering", href: "/services#custom-software" },
      { name: "Web Application Development", href: "/services#web-applications" },
      { name: "Business Process Automation", href: "/services#automation" },
      { name: "API & Backend Systems", href: "/services#apis-backends" },
      { name: "AI & Data Solutions", href: "/services#ai-solutions" },
      { name: "Product Customization", href: "/services#product-customization" },
    ],
    products: [
      { name: "OpsFlow Engine", href: "/products/opsflow-engine" },
      { name: "DataPulse Analytics", href: "/products/datapulse-analytics" },
      { name: "AuthGate Shield", href: "/products/authgate-shield" },
      { name: "All Products", href: "/products" },
    ],
    company: [
      { name: "About COMPANY_NAME", href: "/about" },
      { name: "Our Work & Case Studies", href: "/work" },
      { name: "Client Experience", href: "/testimonials" },
      { name: "Contact Engineering Team", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security Standards", href: "/security" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
